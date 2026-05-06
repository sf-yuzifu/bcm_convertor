import { createWriteStream, existsSync, mkdirSync, readdirSync, renameSync, rmSync, statSync } from 'node:fs'
import { get } from 'node:https'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { pipeline } from 'node:stream/promises'
import { randomUUID } from 'node:crypto'

const ADOPTIUM_API_BASE = 'https://api.adoptium.net/v3/binary/latest'
const RELEASE_KEYSTORE_PASS = 'bcmconvertor'
const RELEASE_KEY_ALIAS = 'bcmkey'

const TUNA_MIRROR = 'https://mirrors.tuna.tsinghua.edu.cn/Adoptium'
const GITHUB_MIRROR = process.env.BCM_GITHUB_MIRROR || ''

const rewriteDownloadUrl = (url) => {
  const temurinMatch = url.match(
    /github\.com\/adoptium\/temurin(\d+)-binaries\/releases\/download\/[^/]+\/(OpenJDK\d+U-jre_(x64|aarch64)_(windows|linux|mac)_hotspot_\S+\.(zip|tar\.gz))/
  )
  if (temurinMatch) {
    const [, major, filename] = temurinMatch
    const rewritten = `${TUNA_MIRROR}/${major}/jre/${temurinMatch[3]}/${temurinMatch[4]}/${filename}`
    process.stdout.write(`[bcm-android] 使用清华 TUNA 镜像下载 JRE\n`)
    return rewritten
  }

  if (GITHUB_MIRROR && url.includes('github.com') && !url.startsWith(GITHUB_MIRROR)) {
    return GITHUB_MIRROR + url
  }

  return url
}

const scriptDir = dirname(fileURLToPath(import.meta.url))
const androidBuilderDir = resolve(scriptDir, '..', '..', 'builder', 'android')
const jreDir = join(androidBuilderDir, 'jre')
const apksignerPath = join(androidBuilderDir, 'apksigner.jar')
const releaseKeystorePath = join(androidBuilderDir, 'release.keystore')

const getPlatformRelease = () => {
  if (process.platform === 'win32' && process.arch === 'x64') {
    return { platform: 'windows', arch: 'x64', ext: '.zip' }
  }

  if (process.platform === 'linux' && process.arch === 'x64') {
    return { platform: 'linux', arch: 'x64', ext: '.tar.gz' }
  }

  throw new Error(`不支持的操作系统: ${process.platform}/${process.arch}`)
}

const getJavaBinaryName = () => {
  if (process.platform === 'win32') {
    return 'java.exe'
  }

  return 'java'
}

const buildJreDownloadUrl = () => {
  const { platform, arch } = getPlatformRelease()
  return `${ADOPTIUM_API_BASE}/21/ga/${platform}/${arch}/jre/hotspot/normal/eclipse`
}

const getJreArchivePath = () => {
  const { ext } = getPlatformRelease()
  return join(jreDir, `temurin-jre${ext}`)
}

const getJavaBinaryPath = () => {
  const javaBinary = getJavaBinaryName()
  return join(jreDir, 'bin', javaBinary)
}

const getKeytoolBinaryPath = () => {
  const keytoolBinary = process.platform === 'win32' ? 'keytool.exe' : 'keytool'
  return join(jreDir, 'bin', keytoolBinary)
}

const isJreReady = () => existsSync(getJavaBinaryPath())

const downloadFile = async (url, destPath, label, maxRedirects = 5) => {
  const destDir = dirname(destPath)
  mkdirSync(destDir, { recursive: true })

  let currentUrl = url
  for (let redirectCount = 0; redirectCount <= maxRedirects; redirectCount++) {
    const result = await new Promise((resolvePromise, reject) => {
      const request = get(
        currentUrl,
        { timeout: 300000, headers: { 'User-Agent': 'bcm-convertor/2.0' } },
        (response) => {
          if (response.statusCode >= 300 && response.statusCode < 400) {
            const redirectUrl = response.headers.location
            if (redirectUrl) {
              resolvePromise({ redirected: true, url: redirectUrl })
              return
            }
            reject(new Error(`下载 ${label} 失败，重定向缺少 Location 头`))
            return
          }

          if (response.statusCode !== 200) {
            reject(new Error(`下载 ${label} 失败，HTTP 状态码: ${response.statusCode}`))
            return
          }

          resolvePromise({ redirected: false, response })
        }
      )

      request.on('error', reject)
      request.setTimeout(300000, () => {
        request.destroy()
        reject(new Error(`下载 ${label} 超时`))
      })
    })

    if (!result.redirected) {
      const response = result.response
      const tempPath = destPath + '.download'
      const totalSize = parseInt(response.headers['content-length'], 10) || 0
      let downloadedSize = 0
      let lastLogTime = Date.now()

      await new Promise((resolveStream, rejectStream) => {
        const fileStream = createWriteStream(tempPath)

        response.on('data', (chunk) => {
          downloadedSize += chunk.length
          const now = Date.now()
          if (now - lastLogTime > 2000) {
            const percent = totalSize > 0 ? ((downloadedSize / totalSize) * 100).toFixed(1) : '?'
            const sizeMB = (downloadedSize / 1024 / 1024).toFixed(1)
            const totalMB = totalSize > 0 ? (totalSize / 1024 / 1024).toFixed(1) : '?'
            process.stdout.write(`[bcm-android] 正在下载 ${label} ... ${percent}% (${sizeMB}MB / ${totalMB}MB)\r`)
            lastLogTime = now
          }
        })

        response.on('error', rejectStream)
        fileStream.on('error', rejectStream)

        pipeline(response, fileStream)
          .then(() => resolveStream())
          .catch(rejectStream)
      })

      try {
        rmSync(destPath, { force: true })
      } catch {
        // ignore
      }

      renameSync(tempPath, destPath)
      process.stdout.write('\n')
      return
    }

    currentUrl = rewriteDownloadUrl(result.url)
  }

  throw new Error(`下载 ${label} 失败，重定向次数超过上限`)
}

const extractJreArchive = (archivePath) => {
  const { ext } = getPlatformRelease()

  if (ext === '.zip') {
    process.stdout.write('[bcm-android] 正在解压 JRE ...\n')
    const result = spawnSync(
      'powershell',
      ['-NoProfile', '-Command', `Expand-Archive -Path '${archivePath}' -DestinationPath '${jreDir}' -Force`],
      { stdio: 'inherit' }
    )

    if (result.error || result.status !== 0) {
      throw new Error(`解压 JRE 失败: ${result.error?.message || '退出码 ' + result.status}`)
    }

    flattenJreDirectory()
    return
  }

  if (ext === '.tar.gz') {
    const result = spawnSync('tar', ['-xzf', archivePath, '-C', jreDir], { stdio: 'inherit' })

    if (result.error || result.status !== 0) {
      throw new Error(`解压 JRE 失败: ${result.error?.message || '退出码 ' + result.status}`)
    }

    flattenJreDirectory()
    return
  }

  throw new Error(`不支持的压缩格式: ${ext}`)
}

const flattenJreDirectory = () => {
  try {
    const entries = readdirSync(jreDir)

    const nestedDirs = entries.filter((entry) => {
      const fullPath = join(jreDir, entry)
      try {
        return statSync(fullPath).isDirectory() && entry.startsWith('jdk')
      } catch {
        return false
      }
    })

    if (nestedDirs.length === 1) {
      const nestedPath = join(jreDir, nestedDirs[0])
      const tempPath = join(jreDir, '_temp_jre_')

      renameSync(nestedPath, tempPath)

      const nestedEntries = readdirSync(tempPath)
      for (const entry of nestedEntries) {
        const src = join(tempPath, entry)
        const dst = join(jreDir, entry)
        try {
          rmSync(dst, { recursive: true, force: true })
        } catch {
          // ignore
        }
        renameSync(src, dst)
      }

      rmSync(tempPath, { recursive: true, force: true })
    }
  } catch (error) {
    process.stdout.write(`[bcm-android] 展平目录完成或跳过: ${error.message}\n`)
  }
}

const cleanupJreArchive = () => {
  const archivePath = getJreArchivePath()
  try {
    if (existsSync(archivePath)) {
      rmSync(archivePath, { force: true })
    }
  } catch {
    // ignore
  }
}

const ensureJre = async () => {
  if (isJreReady()) {
    process.stdout.write('[bcm-android] 内置 JRE 已就绪，跳过下载\n')
    return true
  }

  process.stdout.write('[bcm-android] 正在准备内置 JRE ...\n')

  const url = buildJreDownloadUrl()
  const archivePath = getJreArchivePath()

  await downloadFile(url, archivePath, 'JRE')

  if (!existsSync(archivePath)) {
    throw new Error('下载的 JRE 文件不存在')
  }

  const stats = statSync(archivePath)
  if (stats.size < 1024 * 1024) {
    throw new Error(`下载的 JRE 文件大小异常: ${stats.size} 字节`)
  }

  extractJreArchive(archivePath)
  cleanupJreArchive()

  if (isJreReady()) {
    const javaBinary = getJavaBinaryPath()
    process.stdout.write(`[bcm-android] 内置 JRE 准备完成: ${javaBinary}\n`)
    return true
  }

  throw new Error('JRE 解压后未找到 java 可执行文件')
}

const ensureReleaseKeystore = () => {
  if (existsSync(releaseKeystorePath)) {
    process.stdout.write('[bcm-android] release.keystore 已就绪，跳过生成\n')
    return
  }

  if (!isJreReady()) {
    throw new Error('JRE 尚未就绪，无法生成 keystore')
  }

  process.stdout.write('[bcm-android] 正在生成 release keystore ...\n')

  const keytoolBinary = getKeytoolBinaryPath()
  const dname = `CN=BCM Convertor ${randomUUID().slice(0, 8)}`

  const result = spawnSync(
    keytoolBinary,
    [
      '-genkeypair',
      '-alias',
      RELEASE_KEY_ALIAS,
      '-keyalg',
      'RSA',
      '-keysize',
      '2048',
      '-validity',
      '10950',
      '-keystore',
      releaseKeystorePath,
      '-storetype',
      'PKCS12',
      '-storepass',
      RELEASE_KEYSTORE_PASS,
      '-keypass',
      RELEASE_KEYSTORE_PASS,
      '-dname',
      dname
    ],
    { stdio: 'inherit' }
  )

  if (result.error || result.status !== 0) {
    throw new Error(`生成 release keystore 失败: ${result.error?.message || '退出码 ' + result.status}`)
  }

  if (!existsSync(releaseKeystorePath)) {
    throw new Error('release keystore 生成后未找到文件')
  }

  process.stdout.write('[bcm-android] release.keystore 生成完成\n')
}

const main = async () => {
  try {
    await ensureJre()
  } catch (error) {
    process.stdout.write(`[bcm-android] JRE 准备失败: ${error.message}\n`)
    process.exit(1)
  }

  try {
    ensureReleaseKeystore()
  } catch (error) {
    process.stdout.write(`[bcm-android] keystore 准备失败: ${error.message}\n`)
    process.exit(1)
  }

  if (!existsSync(apksignerPath)) {
    process.stdout.write('[bcm-android] ⚠ 未找到 apksigner.jar\n')
    process.stdout.write('[bcm-android] 请从 Android SDK Build-Tools 获取 apksigner.jar\n')
    process.stdout.write('[bcm-android] 方法一（已有 Android SDK）:\n')
    process.stdout.write(
      `[bcm-android]   copy %ANDROID_HOME%\\build-tools\\34.0.0\\lib\\apksigner.jar "${androidBuilderDir}\\"\n`
    )
    process.stdout.write('[bcm-android] 方法二（使用 sdkmanager）:\n')
    process.stdout.write('[bcm-android]   sdkmanager "build-tools;34.0.0"\n')
    process.stdout.write('[bcm-android]   然后复制 apksigner.jar 到上述目录\n')
  } else {
    process.stdout.write('[bcm-android] apksigner.jar 已就绪\n')
  }
}

main()
