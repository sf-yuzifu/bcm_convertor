import { Button, Input } from 'antd'
import { ReloadOutlined, ThunderboltOutlined, UploadOutlined } from '@ant-design/icons'

export default function PackageConfigPanel({
  packageConfig,
  onProjectNameChange,
  onExportPathChange,
  onChooseProjectIcon,
  onBack,
  onSubmit
}) {
  const displayIcon = packageConfig.projectIconPreview || packageConfig.fetchedIcon

  return (
    <div className="flex h-full w-full items-center justify-center px-6">
      <div className="w-full h-full flex flex-col justify-between">
        <div className="flex justify-between mt-12">
          <div className="w-[198px] shrink-0">
            <div className="flex h-[198px] w-[198px] items-center justify-center rounded-xl border border-[#d9d4cc] bg-[#f7f4ef]">
              {displayIcon ? (
                <img src={displayIcon} alt="作品图标" className="h-[98px] w-[98px] rounded-2xl object-cover" />
              ) : (
                <img src="/icn_upload.png" alt="默认图标" className="w-[98px] object-contain opacity-90" />
              )}
            </div>
          </div>
          <div className="flex flex-col justify-between w-[320px]">
            <label className="flex flex-col">
              <span>作品名称：</span>
              <Input value={packageConfig.projectName} placeholder="Input" onChange={onProjectNameChange} />
            </label>
            <div className="flex flex-col">
              <span>作品图标：</span>
              <Button className="w-fit" icon={<UploadOutlined />} onClick={onChooseProjectIcon}>
                Upload
              </Button>
            </div>
            <label className="flex flex-col">
              <span>导出路径：</span>
              <Input value={packageConfig.exportPath} placeholder="Input" onChange={onExportPathChange} />
            </label>
          </div>
        </div>
        <div className="mb-9 flex items-center justify-center gap-3">
          <Button icon={<ReloadOutlined />} onClick={onBack}>
            重新选择
          </Button>
          <Button type="primary" icon={<ThunderboltOutlined />} onClick={onSubmit}>
            一键转换
          </Button>
        </div>
      </div>
    </div>
  )
}
