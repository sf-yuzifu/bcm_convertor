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
      className="!text-[var(--app-color-accent)]  hover:!bg-[var(--app-color-primary-hover)] hover:!text-[var(--app-color-primary)]"
      aria-label="关于"
      icon={<InfoCircleOutlined style={{ fontSize: 20 }} />}
      onClick={onOpenAbout}
    />,
    <Button
      key="minimize"
      type="text"
      className="!text-[var(--app-color-accent)]  hover:!bg-[var(--app-color-primary-hover)] hover:!text-[var(--app-color-primary)]"
      aria-label="最小化"
      icon={<LineOutlined style={{ fontSize: 20}} />}
      onClick={handleMinimize}
    />,
    <Button
      key="close"
      type="text"
      className="!text-[var(--app-color-accent)]  hover:!bg-[var(--app-color-primary-hover)] hover:!text-[var(--app-color-primary)]"
      aria-label="关闭"
      icon={<CloseOutlined style={{ fontSize: 20 }} />}
      onClick={handleClose}
    />
  ]

  return (
    <header
      className="relative flex h-10 items-center border-b border-[var(--app-color-primary-hover)] bg-[var(--app-color-surface-elevated)] px-3"
      data-tauri-drag-region
    >
      <div className={`absolute flex gap-2 ${isMac ? 'left-3' : 'right-3'}`}>{buttonNodes}</div>
      <div className="text-lg font-bold text-[var(--app-color-accent)]" data-tauri-drag-region>
        编程猫格式工厂
      </div>
    </header>
  )
}
