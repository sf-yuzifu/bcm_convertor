import { useEffect, useMemo, useRef, useState } from 'react'
import { SearchOutlined, UploadOutlined } from '@ant-design/icons'
import { listen } from '@tauri-apps/api/event'
import PackageConfigPanel from './PackageConfigPanel.jsx'
import SearchPanel from './SearchPanel.jsx'
import {
  chooseProjectIconFile,
  loadPackageConfigDefaults,
  revokeObjectUrlIfNeeded
} from '../services/packageConfig/packageConfigService.js'
import { showAlert } from '../services/system/dialogService.js'
import { showErrorAlert } from '../services/system/errorHandlingService.js'
import { isTauri } from '../services/system/runtimeService.js'
import { runConvertWorkflow } from '../workflows/convertWorkflow.js'

const STAGE_SOFT_CAP = {
  idle: 0,
  'process-files': 10,
  'builder-prepare': 14,
  download: 40,
  package: 90,
  postprocess: 99,
  finalize: 99,
  success: 100,
  error: 100
}

const STAGE_DRIFT_PER_SECOND = {
  idle: 0,
  'process-files': 1.2,
  'builder-prepare': 0.8,
  download: 0.15,
  package: 0.55,
  postprocess: 0.8,
  finalize: 0.25,
  success: 0,
  error: 0
}

const createEmptyPackageConfig = () => ({
  projectName: '',
  projectIcon: '',
  projectIconPreview: '',
  exportPath: '',
  fetchedIcon: ''
})

const normalizePercent = (value) => {
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue)) {
    return null
  }

  return Math.min(100, Math.max(0, Math.round(numericValue)))
}

const mapPercentToRange = (value, fromStart, fromEnd, toStart, toEnd) => {
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue)) {
    return null
  }

  if (fromEnd === fromStart) {
    return toEnd
  }

  const ratio = Math.min(1, Math.max(0, (numericValue - fromStart) / (fromEnd - fromStart)))
  return toStart + ratio * (toEnd - toStart)
}

const mapBuilderProgress = (payload, currentTargetPercent) => {
  const rawStage = payload.stage || 'builder-prepare'
  const rawPercent = Number(payload.percent)
  const message = payload.message || '正在打包，请稍候'
  const detail = payload.detail || ''

  if (rawStage === 'download') {
    return {
      stage: 'download',
      message,
      detail,
      percent: mapPercentToRange(rawPercent, 20, 72, 10, 40) ?? mapPercentToRange(rawPercent, 0, 100, 10, 40) ?? 14
    }
  }

  if (rawStage === 'package') {
    return {
      stage: 'package',
      message,
      detail,
      percent: mapPercentToRange(rawPercent, 78, 92, 40, 84) ?? (message.includes('安装包') ? 78 : 40)
    }
  }

  if (rawStage === 'finalize') {
    return {
      stage: 'package',
      message,
      detail,
      percent: mapPercentToRange(rawPercent, 94, 98, 84, 90) ?? 88
    }
  }

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

  return {
    stage: 'builder-prepare',
    message,
    detail,
    percent: message.includes('生成打包配置') ? 12 : message.includes('执行 electron-builder') ? 14 : 11
  }
}

export default function MainPanel({
  version,
  status,
  process,
  panelStep,
  onPanelStepChange,
  onProcessChange,
  onProjectFetched,
  onPackageConfigChange,
  onChooseProjectIcon,
  onSubmitPackageConfig
}) {
  const [workId, setWorkId] = useState('6654365')
  const [builderMessage, setBuilderMessage] = useState('正在准备转换任务')
  const [builderPercent, setBuilderPercent] = useState(0)
  const [builderTargetPercent, setBuilderTargetPercent] = useState(0)
  const [builderDetail, setBuilderDetail] = useState('')
  const [builderStage, setBuilderStage] = useState('idle')
  const [builderLastEventAt, setBuilderLastEventAt] = useState(0)
  const [packageConfig, setPackageConfig] = useState(createEmptyPackageConfig)
  const [loadedProjectInfo, setLoadedProjectInfo] = useState(null)
  const targetPercentRef = useRef(0)

  const resetBuilderProgress = () => {
    setBuilderMessage('正在准备转换任务')
    setBuilderPercent(0)
    setBuilderTargetPercent(0)
    setBuilderDetail('')
    setBuilderStage('idle')
    setBuilderLastEventAt(0)
    targetPercentRef.current = 0
  }

  const cleanupIconPreview = (previewUrl) => {
    revokeObjectUrlIfNeeded(previewUrl)
  }

  const applyProgressPayload = (payload) => {
    setBuilderMessage(payload.message || '正在打包，请稍候')
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
    let disposed = false

    const setupListener = async () => {
      unlistenBuilderStatus = await listen('builder-status', (event) => {
        if (disposed) {
          return
        }

        const mappedPayload = mapBuilderProgress(event.payload || {}, targetPercentRef.current)
        applyProgressPayload(mappedPayload)
      })
    }

    setupListener()

    return () => {
      disposed = true
      unlistenBuilderStatus?.()
    }
  }, [])

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

  useEffect(() => {
    onPanelStepChange?.('search')
    cleanupIconPreview(packageConfig.projectIconPreview)
    setPackageConfig(createEmptyPackageConfig())
    setLoadedProjectInfo(null)
  }, [onPanelStepChange, status, version])

  useEffect(() => () => cleanupIconPreview(packageConfig.projectIconPreview), [packageConfig.projectIconPreview])

  const titleText = useMemo(() => {
    if (panelStep === 'config') {
      return '打包配置'
    }

    if (process === 1) {
      return builderMessage
    }

    if (process === 2) {
      return '转换与打包已完成'
    }

    return status === 'offline' && version === 'kitten3'
      ? '选择 kitten3 作品文件进行转换'
      : `将 ${version} 作品 ID 输入这里进行转换`
  }, [builderMessage, panelStep, process, status, version])

  const isOfflineKitten3 = status === 'offline' && version === 'kitten3'
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

  const openPackageConfigPanel = async () => {
    const defaults = await loadPackageConfigDefaults({
      version,
      status,
      workId: Number(workId || 0)
    })

    if (defaults === null) {
      return false
    }

    cleanupIconPreview(packageConfig.projectIconPreview)
    setLoadedProjectInfo(defaults.projectInfo)
    setPackageConfig(defaults.packageConfig)
    onPanelStepChange?.('config')
    onProjectFetched?.({
      workId: Number(workId || 0),
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
    cleanupIconPreview(packageConfig.projectIconPreview)
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
      workId: Number(workId || 0),
      version,
      status,
      projectInfo: finalProjectInfo,
      config: packageConfig
    })

    resetBuilderProgress()
    applyProgressPayload({ stage: 'process-files', message: '正在准备转换任务', percent: 0 })
    onProcessChange(1)

    try {
      const result = await runConvertWorkflow({
        version,
        status,
        workId: Number(workId || 0),
        projectInfo: finalProjectInfo,
        onProgress: applyProgressPayload
      })

      if (result.status === 'success') {
        onProcessChange(2)
        onPanelStepChange?.('search')
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
      await showErrorAlert(error)
    }
  }

  const convert = async () => {
    if (process === 1) {
      return
    }

    if (panelStep === 'config') {
      return
    }

    if (process === 2) {
      onProcessChange(0)
      resetBuilderProgress()
      onPanelStepChange?.('search')
      return
    }

    if (!isOfflineKitten3) {
      await openPackageConfigPanel()
      return
    }

    resetBuilderProgress()
    applyProgressPayload({ stage: 'process-files', message: '正在准备转换任务', percent: 0 })
    onProcessChange(1)

    try {
      const result = await runConvertWorkflow({
        version,
        status,
        workId: Number(workId || 0),
        onProgress: applyProgressPayload
      })

      if (result.status === 'success') {
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
      await showErrorAlert(error)
    }
  }

  const buttonText = showInput ? null : process === 2 ? '完成' : '选择文件'
  const buttonIcon = isOfflineKitten3 ? <UploadOutlined /> : <SearchOutlined />

  if (panelStep === 'config') {
    return (
      <PackageConfigPanel
        packageConfig={packageConfig}
        process={process}
        progressText={builderMessage}
        progressPercent={builderPercent}
        onProjectNameChange={handleProjectNameChange}
        onExportPathChange={handleExportPathChange}
        onChooseProjectIcon={handleChooseProjectIcon}
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
      showInput={showInput}
      workId={workId}
      onWorkIdChange={handleWorkIdChange}
      onSubmit={convert}
      buttonIcon={buttonIcon}
      buttonText={buttonText}
    />
  )
}
