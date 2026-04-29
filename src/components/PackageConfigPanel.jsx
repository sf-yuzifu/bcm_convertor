import { Button, Input } from 'antd'
import { ReloadOutlined, ThunderboltOutlined, UploadOutlined } from '@ant-design/icons'

export default function PackageConfigPanel({
  packageConfig,
  process,
  progressText,
  progressPercent,
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

  return (
    <div className="flex h-full w-full items-center justify-center px-6">
      <div className="w-full h-full flex flex-col justify-between">
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
                <div className="flex h-[84px] w-[84px] items-center justify-center overflow-hidden rounded-2xl">
                  {displayIcon ? (
                    <img src={displayIcon} alt="作品图标" className="h-[84px] w-[84px] rounded-2xl object-cover" />
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
              <Button className="w-fit" icon={<UploadOutlined />} onClick={onChooseProjectIcon} disabled={isProcessing}>
                Upload
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
