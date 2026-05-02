import { useEffect, useRef } from 'react'
import { Button, Input, InputNumber, Space } from 'antd'
import { ReloadOutlined, ThunderboltOutlined, UploadOutlined } from '@ant-design/icons'

export default function PackageConfigPanel({
  packageConfig,
  process,
  progressText,
  progressPercent,
  builderLogs = [],
  onProjectNameChange,
  onExportPathChange,
  onRoundedIconChange,
  onChooseProjectIcon,
  onBack,
  onSubmit
}) {
  const displayIcon = packageConfig.projectIconPreview || packageConfig.fetchedIconPreview || packageConfig.fetchedIcon
  const isProcessing = process === 1
  const normalizedPercent = Math.min(100, Math.max(0, Math.round(progressPercent || 0)))
  const previewCornerRadiusPercent = Math.min(50, Math.max(0, Number(packageConfig.roundedIconRadius || 22)))
  const circleRadius = 70
  const circleLength = 2 * Math.PI * circleRadius
  const circleOffset = circleLength * (1 - normalizedPercent / 100)
  const logContainerRef = useRef(null)

  useEffect(() => {
    if (!isProcessing || !logContainerRef.current) {
      return
    }

    logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
  }, [builderLogs, isProcessing])

  return (
    <div className="flex h-full w-full items-center justify-center px-6">
      <div className="w-full h-full flex flex-col justify-between">
        <div className="flex justify-between mt-12 gap-6">
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
                <div
                  className="flex h-[84px] w-[84px] items-center justify-center overflow-hidden"
                  style={{ borderRadius: `${previewCornerRadiusPercent}%` }}
                >
                  {displayIcon ? (
                    <img
                      src={displayIcon}
                      alt="作品图标"
                      className="h-[84px] w-[84px] object-cover"
                      style={{ borderRadius: `${previewCornerRadiusPercent}%` }}
                    />
                  ) : (
                    <img
                      src="/icn_upload.png"
                      alt="默认图标"
                      className="w-[84px] object-contain opacity-90"
                      style={{ borderRadius: `${previewCornerRadiusPercent}%` }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="w-[320px]">
            {isProcessing ? (
              <div className="flex h-[198px] flex-col overflow-hidden rounded-xl bg-[#fff] border border-[var(--app-color-border-muted)]">
                <div className="px-3 py-2 text-[13px] font-medium text-[#000]">构建日志</div>
                <div
                  ref={logContainerRef}
                  className="builder-log-scrollbar w-full flex-1 overflow-y-auto px-3 py-2 font-mono text-[12px] text-[#3c3c3c]"
                >
                  {builderLogs.length ? (
                    builderLogs.map((entry, index) => (
                      <div
                        key={`${index}-${entry.stream}`}
                        className={entry.stream === 'stderr' ? 'text-[#ff9c9c]' : 'text-[#3c3c3c]'}
                      >
                        {entry.line}
                      </div>
                    ))
                  ) : (
                    <div className="text-[#8b949e]">正在启动打包任务，请稍候...</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex h-[198px] flex-col justify-between">
                <label className="flex flex-col">
                  <span>作品名称：</span>
                  <Input
                    value={packageConfig.projectName}
                    placeholder="Input"
                    onChange={onProjectNameChange}
                    disabled={isProcessing}
                  />
                </label>
                <div className="flex items-start justify-between gap-6">
                  <div className="flex flex-col gap-2">
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
                  <div className="flex flex-col gap-2">
                    <span>圆角大小：</span>
                    <Space.Compact>
                      <InputNumber
                        min={0}
                        max={50}
                        step={1}
                        value={packageConfig.roundedIconRadius}
                        onChange={onRoundedIconChange}
                        disabled={isProcessing}
                        className="w-[72px]"
                      />
                      <Button disabled className="!cursor-default !text-[var(--app-color-text-secondary,#6b7280)]">
                        %
                      </Button>
                    </Space.Compact>
                  </div>
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
            )}
          </div>
        </div>
        <div className="mb-9">
          {isProcessing ? (
            <div className="mb-3 text-center text-[16px] leading-none font-medium text-[var(--app-color-text-strong)]">
              {progressText}
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
