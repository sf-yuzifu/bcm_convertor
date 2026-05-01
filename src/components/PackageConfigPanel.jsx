import { useEffect, useRef, useState } from 'react'
import { Button, Input } from 'antd'
import { ReloadOutlined, ThunderboltOutlined, UploadOutlined } from '@ant-design/icons'

export default function PackageConfigPanel({
  packageConfig,
  process,
  progressText,
  progressPercent,
  builderLogs = [],
  onProjectNameChange,
  onExportPathChange,
  onChooseProjectIcon,
  onBack,
  onSubmit
}) {
  const displayIcon = packageConfig.projectIconPreview || packageConfig.fetchedIcon
  const isProcessing = process === 1
  const normalizedPercent = Math.min(100, Math.max(0, Math.round(progressPercent || 0)))
  const circleRadius = 70
  const circleLength = 2 * Math.PI * circleRadius
  const circleOffset = circleLength * (1 - normalizedPercent / 100)
  const logContainerRef = useRef(null)
  const [showDetailedLogs, setShowDetailedLogs] = useState(false)

  useEffect(() => {
    if (!isProcessing || !showDetailedLogs || !logContainerRef.current) {
      return
    }

    logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
  }, [builderLogs, isProcessing, showDetailedLogs])

  useEffect(() => {
    if (!isProcessing) {
      setShowDetailedLogs(false)
    }
  }, [isProcessing])

  return (
    <div className="flex h-full w-full items-center justify-center px-6">
      <div className="w-full h-full flex flex-col justify-between">
        {isProcessing && showDetailedLogs ? (
          <div
            ref={logContainerRef}
            className="builder-log-scrollbar h-full w-full overflow-y-auto rounded-xl p-3 bg-[#0f1115] !my-3 font-mono text-[14px] text-[#d7dde7]"
          >
            {builderLogs.length ? (
              builderLogs.map((entry, index) => (
                <div
                  key={`${index}-${entry.stream}`}
                  className={entry.stream === 'stderr' ? 'text-[#ff9c9c]' : 'text-[#d7dde7]'}
                >
                  {entry.line}
                </div>
              ))
            ) : (
              <div className="text-[#8b949e]">正在启动打包任务，请稍候...</div>
            )}
          </div>
        ) : (
          <div className="flex justify-between mt-12">
            <div className="w-[198px] shrink-0">
              <div className="flex h-[198px] w-[198px] items-center justify-center rounded-xl border border-[var(--app-color-border-muted)]">
                <div className="relative flex h-[168px] w-[168px] items-center justify-center">
                  {isProcessing ? (
                    <svg viewBox="0 0 168 168" className="-rotate-90 absolute inset-0 h-full w-full" aria-hidden="true">
                      <circle
                        cx="84"
                        cy="84"
                        r={circleRadius}
                        fill="none"
                        stroke="var(--app-color-ring-track)"
                        strokeWidth="6"
                      />
                      <circle
                        cx="84"
                        cy="84"
                        r={circleRadius}
                        fill="none"
                        stroke="var(--app-color-primary)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={circleLength}
                        strokeDashoffset={circleOffset}
                        className="transition-[stroke-dashoffset] duration-500 ease-out"
                      />
                    </svg>
                  ) : null}
                  <div className="flex h-[84px] w-[84px] items-center justify-center overflow-hidden">
                    {displayIcon ? (
                      <img src={displayIcon} alt="作品图标" className="h-[84px] w-[84px] object-cover" />
                    ) : (
                      <img src="/icn_upload.png" alt="默认图标" className="w-[84px] object-contain opacity-90" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between w-[320px]">
              <label className="flex flex-col">
                <span>作品名称：</span>
                <Input
                  value={packageConfig.projectName}
                  placeholder="Input"
                  onChange={onProjectNameChange}
                  disabled={isProcessing}
                />
              </label>
              <div className="flex flex-col">
                <span>作品图标：</span>
                <Button
                  className="w-fit"
                  icon={<UploadOutlined />}
                  onClick={onChooseProjectIcon}
                  disabled={isProcessing}
                >
                  上传图标
                </Button>
              </div>
              <label className="flex flex-col">
                <span>导出路径：</span>
                <Input
                  value={packageConfig.exportPath}
                  placeholder="Input"
                  onChange={onExportPathChange}
                  disabled={isProcessing}
                />
              </label>
            </div>
          </div>
        )}
        <div className="mb-9">
          {isProcessing ? (
            <div
              className="mb-3 text-center text-[16px] leading-none font-medium text-[var(--app-color-text-strong)]"
              onClick={() => setShowDetailedLogs((prev) => !prev)}
            >
              {progressText}
              {/* <span className="ml-2 text-[12px] font-normal text-[var(--app-color-text-muted)]">
                {showDetailedLogs ? '点击切换图形进度' : '点击查看详细日志'}
              </span> */}
            </div>
          ) : null}
          <div className="flex items-center justify-center gap-3">
            <Button icon={<ReloadOutlined />} onClick={onBack} disabled={isProcessing}>
              重新选择
            </Button>
            <Button type="primary" icon={<ThunderboltOutlined />} onClick={onSubmit} loading={isProcessing}>
              一键转换
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
