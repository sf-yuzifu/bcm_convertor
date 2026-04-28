import { Button, InputNumber, Typography } from 'antd'

const { Text } = Typography

export default function SearchPanel({
  titleText,
  process,
  builderPercent,
  showInput,
  workId,
  onWorkIdChange,
  onSubmit,
  buttonIcon,
  buttonText
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <img src="/icn_upload.png" alt="logo" className="mb-6 w-[148px]" />
      <div className="mb-3 text-4 text-[#3D3D3D]">{titleText}</div>
      {process === 1 ? (
        <Text className="mb-3 text-[rgba(61,61,61,0.65)]">{`${Math.round(builderPercent)}%`}</Text>
      ) : null}
      <div className="flex items-center gap-3">
        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${
            showInput ? 'w-[160px] opacity-100 translate-x-0' : 'pointer-events-none w-0 -translate-x-2 opacity-0'
          }`}
        >
          <InputNumber
            value={workId ? Number(workId) : null}
            onChange={onWorkIdChange}
            className={`!w-[160px] origin-left transition-all duration-300 ease-out ${
              showInput ? 'opacity-100 blur-0' : 'w-0 opacity-0 blur-[2px]'
            }`}
            controls={false}
            min={0}
            max={999999999}
            precision={0}
            disabled={process === 1 || !showInput}
            placeholder="作品 ID"
          />
        </div>
        <Button
          onClick={onSubmit}
          type="primary"
          htmlType="button"
          icon={buttonIcon}
          loading={process === 1}
          className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-out ${
            showInput ? '!w-10 !px-0' : '!w-[112px] !px-4'
          }`}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  )
}
