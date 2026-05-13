import { useEffect, useMemo, useRef, useState } from 'react'
import { SearchOutlined, UploadOutlined } from '@ant-design/icons'
import { listen } from '@tauri-apps/api/event'
import { getCurrentWindow } from '@tauri-apps/api/window'
import PackageConfigPanel from './PackageConfigPanel.jsx'
import SearchPanel from './SearchPanel.jsx'
import {
  chooseProjectIconFile,
  loadPackageConfigDefaults,
  revokeObjectUrlIfNeeded
} from '../services/packageConfig/packageConfigService.js'
import { showAlert } from '../services/system/dialogService.js'
import {
  attachUserFacingErrorMetadata,
  normalizeUserFacingError,
  showErrorAlert
} from '../services/system/errorHandlingService.js'
import { isTauri } from '../services/system/runtimeService.js'
import { openBuildLogFile, revealOutputDirectory, writeBuildLogFile } from '../services/workspace/workspaceService.js'
import { runConvertWorkflow } from '../workflows/convertWorkflow.js'

const STAGE_SOFT_CAP = {
  idle: 0,
  start: 10,
  'process-files': 10,
  prepare: 24,
  build: 30,
  download: 45,
  package: 88,
  postprocess: 99,
  finalize: 90,
  success: 100,
  error: 100
}

const STAGE_DRIFT_PER_SECOND = {
  idle: 0,
  start: 0.8,
  'process-files': 1.2,
  prepare: 0.6,
  build: 0.4,
  download: 0.12,
  package: 0.45,
  postprocess: 0.8,
  finalize: 0.2,
  success: 0,
  error: 0
}

const createEmptyPackageConfig = () => ({
  projectName: '',
  projectIcon: '',
  projectIconPreview: '',
  exportPath: '',
  fetchedIcon: '',
  fetchedIconPreview: '',
  roundedIconRadius: 22,
  targetPlatform: detectCurrentPlatform()
})

function detectCurrentPlatform() {
  try {
    const p = navigator.platform || ''
    if (p.startsWith('Mac')) return 'macos'
    if (p.startsWith('Linux')) return 'linux'
  } catch {}
  return 'windows'
}

const MAX_BUILDER_LOG_LINES = 400
const BCM_FILE_PATTERN = /\.bcm$/i

const normalizePercent = (value) => {
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue)) {
    return null
  }

  return Math.min(100, Math.max(0, Math.round(numericValue)))
}

const mapBuilderProgress = (payload, currentTargetPercent) => {
  const rawStage = payload.stage || 'prepare'
  const rawPercent = Number(payload.percent)
  const message = payload.message || '正在打包，请稍候'
  const detail = payload.detail || ''

  if (rawStage === 'success') {
    return {
      stage: 'postprocess',
      message: '打包已完成，正在整理输出文件',
      detail,
      percent: 90
    }
  }

  if (rawStage === 'error') {
    return {
      stage: 'error',
      message,
      detail,
      percent: currentTargetPercent
    }
  }

  if (!Number.isFinite(rawPercent)) {
    return {
      stage: rawStage,
      message,
      detail,
      percent: currentTargetPercent
    }
  }

  return {
    stage: rawStage,
    message,
    detail,
    percent: rawPercent
  }
}

export default function MainPanel({
  version,
  status,
  process,
  panelStep,
  onPanelStepChange,
  onProcessChange,
  onFileDragActiveChange,
  onProjectFetched,
  onPackageConfigChange,
  onChooseProjectIcon,
  onSubmitPackageConfig,
  bcmSelectTrigger
}) {
  const [workId, setWorkId] = useState('6654365')
  const [isDragActive, setIsDragActive] = useState(false)
  const [builderMessage, setBuilderMessage] = useState('正在准备转换任务')
  const [builderPercent, setBuilderPercent] = useState(0)
  const [builderTargetPercent, setBuilderTargetPercent] = useState(0)
  const [builderDetail, setBuilderDetail] = useState('')
  const [builderStage, setBuilderStage] = useState('idle')
  const [builderLastEventAt, setBuilderLastEventAt] = useState(0)
  const [builderLogs, setBuilderLogs] = useState([])
  const [packageConfig, setPackageConfig] = useState(createEmptyPackageConfig)
  const [loadedProjectInfo, setLoadedProjectInfo] = useState(null)
  const [lastOutputDirectory, setLastOutputDirectory] = useState('')
  const [lastOutputPath, setLastOutputPath] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const targetPercentRef = useRef(0)
  const builderLogsRef = useRef([])
  const builderMessageRef = useRef('正在准备转换任务')
  const builderPercentRef = useRef(0)
  const isOfflineKitten3 = status === 'offline' && version === 'kitten3'
  const isOnlineKittenN = status === 'online' && version === 'kittenN'
  const numericWorkId = Number(workId || 0)
  const activeOutputDirectory = lastOutputDirectory || packageConfig.exportPath
  const activeOutputPath = lastOutputPath || activeOutputDirectory

  const resetBuilderProgress = () => {
    setBuilderMessage('正在准备转换任务')
    setBuilderPercent(0)
    setBuilderTargetPercent(0)
    setBuilderDetail('')
    setBuilderStage('idle')
    setBuilderLastEventAt(0)
    setBuilderLogs([])
    targetPercentRef.current = 0
    builderLogsRef.current = []
    builderMessageRef.current = '正在准备转换任务'
    builderPercentRef.current = 0
  }

  const cleanupIconPreview = (...previewUrls) => {
    previewUrls.forEach((previewUrl) => revokeObjectUrlIfNeeded(previewUrl))
  }

  const applyProgressPayload = (payload) => {
    const nextMessage = payload.message || '正在打包，请稍候'
    setBuilderMessage(nextMessage)
    builderMessageRef.current = nextMessage
    setBuilderDetail(payload.detail || '')
    setBuilderStage(payload.stage || 'idle')
    setBuilderLastEventAt(Date.now())

    const nextPercent = normalizePercent(payload.percent)
    if (nextPercent === null) {
      return
    }

    setBuilderTargetPercent((prev) => {
      let nextTarget = Math.max(prev, nextPercent)
      if ((payload.stage || builderStage) === 'success') {
        nextTarget = 100
      }
      targetPercentRef.current = nextTarget
      return nextTarget
    })
  }

  useEffect(() => {
    if (!isTauri()) {
      return undefined
    }

    let unlistenBuilderStatus
    let unlistenBuilderLog
    let disposed = false

    const setupListener = async () => {
      unlistenBuilderStatus = await listen('builder-status', (event) => {
        if (disposed) {
          return
        }

        const mappedPayload = mapBuilderProgress(event.payload || {}, targetPercentRef.current)
        applyProgressPayload(mappedPayload)
      })

      unlistenBuilderLog = await listen('builder-log', (event) => {
        if (disposed) {
          return
        }

        const payload = event.payload || {}
        const line = String(payload.line || '').trim()
        if (!line) {
          return
        }

        setBuilderLogs((prev) => {
          const next = [...prev, { stream: payload.stream || 'stdout', line }]
          const trimmed = next.slice(-MAX_BUILDER_LOG_LINES)
          builderLogsRef.current = trimmed
          return trimmed
        })
      })
    }

    setupListener()

    return () => {
      disposed = true
      unlistenBuilderStatus?.()
      unlistenBuilderLog?.()
    }
  }, [])

  useEffect(() => {
    builderPercentRef.current = builderPercent
  }, [builderPercent])

  useEffect(() => {
    onFileDragActiveChange?.(isDragActive)
  }, [isDragActive, onFileDragActiveChange])

  useEffect(() => {
    if (!isOfflineKitten3 || process === 1 || panelStep !== 'search') {
      setIsDragActive(false)
    }
  }, [isOfflineKitten3, panelStep, process])

  useEffect(() => {
    if (!isTauri()) {
      return undefined
    }

    let disposed = false
    let unlistenDragDrop

    const setupDragDrop = async () => {
      unlistenDragDrop = await getCurrentWindow().onDragDropEvent(async (event) => {
        if (disposed || !isOfflineKitten3 || process === 1 || panelStep !== 'search') {
          return
        }

        if (event.payload.type === 'enter' || event.payload.type === 'over') {
          setIsDragActive(true)
          return
        }

        if (event.payload.type === 'leave') {
          setIsDragActive(false)
          return
        }

        if (event.payload.type !== 'drop') {
          return
        }

        setIsDragActive(false)
        const droppedPaths = Array.isArray(event.payload.paths) ? event.payload.paths : []
        const bcmPath = droppedPaths.find((path) => BCM_FILE_PATTERN.test(path))

        if (!bcmPath) {
          await showAlert('文件格式不支持', '请拖入一个 .bcm 文件')
          return
        }

        if (droppedPaths.length > 1) {
          await showAlert('检测到多个文件', '本次只会导入第一个 .bcm 文件')
        }

        try {
          await openPackageConfigPanel({ sourceFilePath: bcmPath })
        } catch (error) {
          console.error(error)
          await showErrorAlert(error)
        }
      })
    }

    setupDragDrop()

    return () => {
      disposed = true
      onFileDragActiveChange?.(false)
      unlistenDragDrop?.()
    }
  }, [isOfflineKitten3, onFileDragActiveChange, panelStep, process])

  useEffect(() => {
    let lastTickAt = Date.now()
    const timer = window.setInterval(() => {
      if (process !== 1) {
        lastTickAt = Date.now()
        return
      }

      const now = Date.now()
      const deltaSeconds = Math.max(0.08, (now - lastTickAt) / 1000)
      lastTickAt = now

      setBuilderPercent((prev) => {
        const stage = builderStage
        const softCap = STAGE_SOFT_CAP[stage] ?? targetPercentRef.current
        const driftRate = STAGE_DRIFT_PER_SECOND[stage] ?? 0
        const timeSinceLastEvent = builderLastEventAt ? Date.now() - builderLastEventAt : 0
        let desiredPercent = targetPercentRef.current

        if (stage !== 'success' && stage !== 'error' && timeSinceLastEvent >= 1200 && prev < softCap) {
          desiredPercent = Math.max(desiredPercent, Math.min(softCap, prev + driftRate * deltaSeconds))
        }

        if (desiredPercent <= prev) {
          if (stage === 'success' && prev < 100) {
            return Math.min(100, prev + 240 * deltaSeconds)
          }
          return prev
        }

        const gap = desiredPercent - prev
        const smoothStep = Math.max(0.6, gap * 0.18)
        return Math.min(desiredPercent, prev + smoothStep)
      })
    }, 120)

    return () => window.clearInterval(timer)
  }, [builderLastEventAt, builderStage, process])

  const persistBuildLog = async ({ projectName, outputPath, status, error }) => {
    if (!builderLogsRef.current.length && !error) {
      return null
    }

    return writeBuildLogFile({
      projectName: projectName || packageConfig.projectName || loadedProjectInfo?.name || `work-${workId}`,
      outputPath,
      builderLogs: builderLogsRef.current,
      progressText: builderMessageRef.current,
      progressPercent: builderPercentRef.current,
      status,
      error
    })
  }

  const handleBuildFailure = async ({ error, projectName, outputPath }) => {
    const normalizedError = normalizeUserFacingError(error, {
      code: 'CONVERT_WORKFLOW_FAILED',
      stage: builderStage || 'error'
    })
    let logFilePath = ''

    try {
      logFilePath = await persistBuildLog({
        projectName,
        outputPath,
        status: 'error',
        error: normalizedError
      })

      if (logFilePath) {
        attachUserFacingErrorMetadata(normalizedError, { logPath: logFilePath })
      }
    } catch (logError) {
      console.error('failed to persist or open build log', logError)
    }

    await showErrorAlert(normalizedError, {
      onOpenLog:
        logFilePath && normalizedError.logPath
          ? async () => {
              try {
                await openBuildLogFile(logFilePath)
              } catch (openLogError) {
                console.error(openLogError)
                await showErrorAlert(openLogError, {
                  onRetryOpenLog: async () => openBuildLogFile(logFilePath)
                })
              }
            }
          : undefined
    })
  }

  useEffect(() => {
    onPanelStepChange?.('search')
    cleanupIconPreview(packageConfig.projectIconPreview, packageConfig.fetchedIconPreview)
    setPackageConfig(createEmptyPackageConfig())
    setLoadedProjectInfo(null)
    setLastOutputDirectory('')
    setLastOutputPath('')
  }, [onPanelStepChange, status, version])

  useEffect(() => {
    if (!bcmSelectTrigger || !isOfflineKitten3 || process === 1) return
    const timer = setTimeout(async () => {
      try {
        await openPackageConfigPanel()
      } catch (error) {
        console.error(error)
        await showErrorAlert(error)
      }
    }, 50)
    return () => clearTimeout(timer)
  }, [bcmSelectTrigger])

  useEffect(
    () => () => cleanupIconPreview(packageConfig.projectIconPreview, packageConfig.fetchedIconPreview),
    [packageConfig.fetchedIconPreview, packageConfig.projectIconPreview]
  )

  const titleText = useMemo(() => {
    if (process === 2) {
      return '转换与打包已完成'
    }

    if (panelStep === 'config') {
      return '打包配置'
    }

    if (process === 1) {
      return builderMessage
    }

    return status === 'offline' && version === 'kitten3'
      ? '选择 Kitten3 作品文件进行转换'
      : `将 ${version.charAt(0).toUpperCase() + version.slice(1)} 作品 ID 输入这里进行转换`
  }, [builderMessage, isOnlineKittenN, panelStep, process, status, version])

  const showInput = !isOfflineKitten3 && panelStep === 'search'

  const handleWorkIdChange = (value) => {
    let nextValue = String(value ?? '').replace(/\D/g, '')
    if (nextValue.length > 9) {
      nextValue = nextValue.slice(0, 9)
    }
    setWorkId(nextValue)
  }

  const updatePackageConfig = (patch) => {
    setPackageConfig((prev) => {
      const next = { ...prev, ...patch }
      onPackageConfigChange?.(next)
      return next
    })
  }

  const openPackageConfigPanel = async ({ sourceFilePath } = {}) => {
    const defaults = await loadPackageConfigDefaults({
      version,
      status,
      workId: numericWorkId,
      sourceFilePath
    })

    if (defaults === null) {
      return false
    }

    cleanupIconPreview(packageConfig.projectIconPreview, packageConfig.fetchedIconPreview)
    setLoadedProjectInfo(defaults.projectInfo)
    setPackageConfig(defaults.packageConfig)
    onPanelStepChange?.('config')
    onProjectFetched?.({
      workId: numericWorkId,
      version,
      status,
      projectInfo: defaults.projectInfo,
      config: defaults.packageConfig
    })

    return true
  }

  const handleProjectNameChange = (event) => {
    updatePackageConfig({ projectName: event.target.value })
  }

  const handleExportPathChange = (event) => {
    updatePackageConfig({ exportPath: event.target.value })
  }

  const handleRoundedIconChange = (value) => {
    const numericValue = Number(value)
    updatePackageConfig({
      roundedIconRadius: Number.isFinite(numericValue) ? Math.min(50, Math.max(0, numericValue)) : 0
    })
  }

  const handleTargetPlatformChange = (platform) => {
    updatePackageConfig({ targetPlatform: platform })
  }

  const handleChooseProjectIcon = async () => {
    const selectedIcon = await chooseProjectIconFile()
    if (!selectedIcon) {
      return
    }

    cleanupIconPreview(packageConfig.projectIconPreview)
    const nextConfig = {
      projectIcon: selectedIcon.path,
      projectIconPreview: selectedIcon.previewUrl
    }
    updatePackageConfig(nextConfig)
    onChooseProjectIcon?.({ ...packageConfig, ...nextConfig })
  }

  const handleBackToSearch = () => {
    cleanupIconPreview(packageConfig.projectIconPreview, packageConfig.fetchedIconPreview)
    onPanelStepChange?.('search')
  }

  const handleSubmitPackageConfig = async () => {
    if (!packageConfig.exportPath.trim()) {
      await showAlert('缺少导出路径', '请选择或填写导出路径')
      return
    }

    const projectInfo = loadedProjectInfo
    if (!projectInfo) {
      await showAlert('缺少作品信息', '请返回重新选择作品后再试')
      return
    }

    const finalProjectInfo = {
      ...projectInfo,
      name: packageConfig.projectName.trim() || projectInfo.name,
      packageConfig
    }

    onSubmitPackageConfig?.({
      workId: numericWorkId,
      version,
      status,
      projectInfo: finalProjectInfo,
      config: packageConfig
    })

    resetBuilderProgress()
    applyProgressPayload({ stage: 'process-files', message: '正在准备转换任务', percent: 0 })
    setLastOutputDirectory('')
    setLastOutputPath('')
    onProcessChange(1)

    try {
      const result = await runConvertWorkflow({
        version,
        status,
        workId: numericWorkId,
        projectInfo: finalProjectInfo,
        onProgress: applyProgressPayload
      })

      if (result.status === 'success') {
        setLastOutputDirectory(result.outputDirectory || packageConfig.exportPath || '')
        setLastOutputPath(result.outputPath || result.outputDirectory || packageConfig.exportPath || '')
        await persistBuildLog({
          projectName: finalProjectInfo.name,
          outputPath: result.outputDirectory || packageConfig.exportPath,
          status: 'success'
        })
        onProcessChange(2)
        applyProgressPayload({ stage: 'success', message: '转换与打包已完成', percent: 100 })
        return
      }

      onProcessChange(0)

      if (result.status === 'unavailable') {
        await showAlert('当前环境不支持', '请在桌面应用中使用转换功能')
      }
    } catch (error) {
      console.error(error)
      onProcessChange(0)
      await handleBuildFailure({
        error,
        projectName: finalProjectInfo.name,
        outputPath: packageConfig.exportPath
      })
    }
  }

  const convert = async () => {
    if (process === 1 || isSubmitting) {
      return
    }

    if (panelStep === 'config') {
      return
    }

    if (process === 2) {
      handleContinueConvert()
      return
    }

    setIsSubmitting(true)
    try {
      await openPackageConfigPanel()
    } catch (error) {
      console.error(error)
      await showErrorAlert(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContinueConvert = () => {
    onProcessChange(0)
    resetBuilderProgress()
    setLastOutputDirectory('')
    setLastOutputPath('')
    onPanelStepChange?.('search')
  }

  const handleOpenOutput = async () => {
    try {
      await revealOutputDirectory(activeOutputPath)
    } catch (error) {
      console.error(error)
      await showErrorAlert(error, {
        onRetryOpenOutput: async () => revealOutputDirectory(activeOutputPath)
      })
    }
  }

  const buttonText = showInput ? null : process === 2 ? '完成' : '选择文件'
  const buttonIcon = isOfflineKitten3 ? <UploadOutlined /> : <SearchOutlined />

  if (panelStep === 'config' && process !== 2) {
    return (
      <PackageConfigPanel
        packageConfig={packageConfig}
        process={process}
        progressText={builderMessage}
        progressPercent={builderPercent}
        builderLogs={builderLogs}
        onProjectNameChange={handleProjectNameChange}
        onExportPathChange={handleExportPathChange}
        onRoundedIconChange={handleRoundedIconChange}
        onChooseProjectIcon={handleChooseProjectIcon}
        onTargetPlatformChange={handleTargetPlatformChange}
        onBack={handleBackToSearch}
        onSubmit={handleSubmitPackageConfig}
      />
    )
  }

  return (
    <SearchPanel
      titleText={titleText}
      process={process}
      builderPercent={builderPercent}
      isOfflineKitten3={isOfflineKitten3}
      showInput={showInput}
      workId={workId}
      onWorkIdChange={handleWorkIdChange}
      onSubmit={convert}
      onOpenOutput={handleOpenOutput}
      onContinue={handleContinueConvert}
      buttonIcon={buttonIcon}
      buttonText={buttonText}
      isSubmitting={isSubmitting}
    />
  )
}
