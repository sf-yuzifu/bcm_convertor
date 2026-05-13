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

  const buttonBaseClass =
    '!flex !h-[32px] !w-[32px] !items-center !justify-center !rounded-[5px] !border-0 !bg-[var(--app-color-surface-elevated)] !p-0 !shadow-none hover:!bg-[var(--app-color-primary-hover)] hover:!text-[var(--app-color-primary)]'
  return (
    <div className="relative h-10">
      <header
        className={`relative flex h-10 items-center border-b border-[var(--app-color-primary-hover)] bg-[var(--app-color-surface-elevated)] px-3 ${isMac ? 'justify-center' : ''}`}
        data-tauri-drag-region
      >
        <div className="pointer-events-none text-lg font-bold text-[var(--app-color-accent)]" data-tauri-drag-region>
          编程猫格式工厂
        </div>
      </header>

      <div className={`absolute top-[4px] inline-flex w-fit flex-row-reverse right-1 gap-1`}>
        {isMac ? (
          <Button
            type="text"
            className={`${buttonBaseClass} !text-[var(--app-color-accent)]`}
            aria-label="关于"
            icon={<InfoCircleOutlined style={{ fontSize: 20 }} />}
            onClick={onOpenAbout}
          />
        ) : (
          <>
            <Button
              type="text"
              className={`${buttonBaseClass} !z-[40] !text-[var(--app-color-accent)]`}
              aria-label={aboutOpen ? '关闭关于页面' : '关闭'}
              icon={<CloseOutlined style={{ fontSize: 20 }} />}
              onClick={handleClose}
            />
            <Button
              type="text"
              className={`${buttonBaseClass} !z-[10] mx-[3px] !text-[var(--app-color-accent)]`}
              aria-label="最小化"
              icon={<LineOutlined style={{ fontSize: 20 }} />}
              onClick={handleMinimize}
            />
            <Button
              type="text"
              className={`${buttonBaseClass} !text-[var(--app-color-accent)]`}
              aria-label="关于"
              icon={<InfoCircleOutlined style={{ fontSize: 20 }} />}
              onClick={onOpenAbout}
            />
          </>
        )}
      </div>
    </div>
  )
}
