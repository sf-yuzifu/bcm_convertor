import { useEffect, useState } from 'react'
import packageJson from '../../package.json'
import { invokeBackendCommand } from '../services/system/backendCommandService.js'
import { openExternalUrl } from '../services/system/externalLinkService.js'
import { showErrorAlert } from '../services/system/errorHandlingService.js'
import { getEnv } from '../services/system/runtimeService.js'

const ABOUT_ITEMS = [
  {
    title: '1.生成的程序无法运行/找不到文件存放位置。',
    lines: [
      '答：如果无法打开，则为软件bug。可联系作者。默认情况下文件存放位置Windows/Mac OS在桌面上，而Linux在用户home目录下。'
    ],
    pathLabel: '当前文件存放位置:'
  },
  {
    title: '2.转换后的应用程序大小远远大于bcm文件大小。',
    lines: ['答：为了让bcm独立运行，需要很多其他文件的支持，这部分程序也是占空间的。因此APP文件至少也有200MB左右。']
  },
  {
    title: '3.为什么离线模式下云变量作品无法使用。',
    lines: [
      '答：在编程猫中，云变量的使用是需要确定的作品ID的，但转换的文件并没有对应的作品ID，因此云变量的功能在转换的文件中是无法使用的，将会作为普通变量运行。（但可以使用在线转换）'
    ]
  },
  {
    title: '4.关于安卓APK。',
    lines: ['答：嗯，不会出了...（试着用用'],
    linkLabel: 'CoCo编辑器？',
    linkUrl: 'https://coco.codemao.cn/',
    suffix: '）'
  }
]

export default function AboutModal({ open }) {
  const [savingPath, setSavingPath] = useState('')

  useEffect(() => {
    let disposed = false

    const loadSavingPath = async () => {
      try {
        const env = await getEnv()
        if (!disposed) {
          setSavingPath(env.desktopDirPath || '')
        }
      } catch (error) {
        console.error(error)
      }
    }

    loadSavingPath()

    return () => {
      disposed = true
    }
  }, [])

  const openOutputDirectory = async () => {
    try {
      await invokeBackendCommand(
        'open_file',
        { path: savingPath },
        {
          title: '打开输出目录失败',
          text: '无法自动打开输出目录，请手动前往桌面查看'
        }
      )
    } catch (error) {
      console.error(error)
      await showErrorAlert(error)
    }
  }

  return (
    <div
      className={`absolute inset-0 z-[35] bg-[var(--app-color-surface-elevated)] text-[13px] text-[var(--app-color-text)] transition-transform duration-500 ${
        open ? 'pointer-events-auto scale-100' : 'pointer-events-none scale-0'
      }`}
      style={{ transformOrigin: 'center center' }}
    >
      <div className="absolute inset-x-0 top-0 h-10 bg-transparent z-[16]" data-tauri-drag-region />

      <div className="relative flex h-[78px] flex-col items-center text-center">
        <img src="/pic_aboutUs.png" alt="" className="absolute top-0 h-[78px] w-[252px]" />
        <p className="z-[8] !mt-1 !mb-1 ml-[10px] text-[18px] font-bold">版本号：v{packageJson.version}</p>
        <a
          href="https://shequ.codemao.cn/user/438403"
          target="_blank"
          rel="noreferrer"
          className="z-[8] text-[14px] ml-[10px] text-current !underline"
          onClick={(event) => {
            event.preventDefault()
            openExternalUrl('https://shequ.codemao.cn/user/438403')
          }}
        >
          小鱼yuzifu
        </a>
      </div>

      <div className="px-8">
        <p className="!mb-4 text-[14px] font-bold">关于格式工厂你需要知道：</p>
        {ABOUT_ITEMS.map((item, index) => (
          <div key={item.title} className="!mb-4">
            <p className="!my-0 font-bold">{item.title}</p>
            {item.lines.map((line) => (
              <p key={line} className="!my-0 ml-3">
                {line}
                {item.linkUrl && line === item.lines[item.lines.length - 1] ? (
                  <>
                    <a
                      href={item.linkUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-current"
                      onClick={(event) => {
                        event.preventDefault()
                        openExternalUrl(item.linkUrl)
                      }}
                    >
                      {item.linkLabel}
                    </a>
                    {item.suffix}
                  </>
                ) : null}
              </p>
            ))}
            {item.pathLabel ? (
              <p className="!my-0 ml-3">
                {item.pathLabel}
                <button
                  type="button"
                  className="!ml-1 cursor-pointer border-0 bg-transparent p-0 font-bold text-current underline"
                  onClick={openOutputDirectory}
                >
                  {savingPath || '加载中...'}
                </button>
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
