import { InfoCircleOutlined, LineOutlined, CloseOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'
import { isTauri } from '../services/system/runtimeService.js'

const appWindow = isTauri() ? getCurrentWebviewWindow() : null
const isMac = navigator.platform.startsWith('Mac')

export default function TitleBar({ aboutOpen, onOpenAbout, onCloseAbout }) {
  const handleClose = async () => {
    if (aboutOpen) {
      onCloseAbout()
      return
    }

    if (appWindow) {
      await appWindow.close()
    }
  }

  const handleMinimize = async () => {
    if (appWindow) {
      await appWindow.minimize()
    }
  }

  const buttonNodes = [
    <Button
      key="about"
      type="text"
      className="!h-8 !w-8 !border-0 !text-lg !text-[#FFCC22] !shadow-none hover:!bg-[rgba(250,154,75,0.12)] hover:!text-[#fa9a4b]"
      aria-label="关于"
      icon={<InfoCircleOutlined />}
      onClick={onOpenAbout}
    />,
    <Button
      key="minimize"
      type="text"
      className="!h-8 !w-8 !border-0 !text-lg !text-[#FFCC22] !shadow-none hover:!bg-[rgba(250,154,75,0.12)] hover:!text-[#fa9a4b]"
      aria-label="最小化"
      icon={<LineOutlined />}
      onClick={handleMinimize}
    />,
    <Button
      key="close"
      type="text"
      danger
      className="!h-8 !w-8 !border-0 !text-lg !text-[#FFCC22] !shadow-none hover:!bg-[rgba(250,154,75,0.12)] hover:!text-[#fa9a4b]"
      aria-label="关闭"
      icon={<CloseOutlined />}
      onClick={handleClose}
    />
  ]

  return (
    <header
      className="relative flex h-10 items-center border-b border-[rgba(250,154,75,0.12)] bg-white px-3"
      data-tauri-drag-region
    >
      <div className={`absolute flex gap-2 ${isMac ? 'left-3' : 'right-3'}`}>{buttonNodes}</div>
      <div className="text-lg font-bold text-[#FFCC22]" data-tauri-drag-region>
        编程猫格式工厂
      </div>
    </header>
  )
}
