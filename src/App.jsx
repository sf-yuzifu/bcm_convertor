import { useEffect, useMemo, useRef, useState } from 'react'
import { App as AntdApp, Layout } from 'antd'
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'
import AboutModal from './components/AboutModal.jsx'
import MainPanel from './components/MainPanel.jsx'
import TitleBar from './components/TitleBar.jsx'
import VersionControls from './components/VersionControls.jsx'
import { isTauri } from './services/system/runtimeService.js'

const { Content } = Layout

export default function App() {
  const [version, setVersion] = useState('kitten4')
  const [status, setStatus] = useState('offline')
  const [process, setProcess] = useState(0)
  const [panelStep, setPanelStep] = useState('search')
  const [aboutOpen, setAboutOpen] = useState(false)
  useEffect(() => {
    if (!isTauri() || !aboutOpen) return

    const appWindow = getCurrentWebviewWindow()
    const unlisten = appWindow.onCloseRequested((event) => {
      event.preventDefault()
      setAboutOpen(false)
    })

    return () => {
      unlisten.then((fn) => fn())
    }
  }, [aboutOpen])
  const [isFileDragActive, setIsFileDragActive] = useState(false)
  const showSearchChrome = panelStep === 'search' && process !== 2

  const controlState = useMemo(
    () => ({
      version,
      status,
      process
    }),
    [process, status, version]
  )

  const handleVersionChange = (nextVersion) => {
    if (!process) {
      setVersion(nextVersion)
    }
  }

  const handleStatusChange = (nextStatus) => {
    if (!process) {
      setStatus(nextStatus)
      if (nextStatus === 'offline' && version === 'kittenN') {
        setVersion('kitten4')
      }
    }
  }

  return (
    <AntdApp>
      <Layout className="relative h-full !bg-transparent">
        <TitleBar
          aboutOpen={aboutOpen}
          onOpenAbout={() => setAboutOpen(true)}
          onCloseAbout={() => setAboutOpen(false)}
        />
        <Content className="relative flex h-[calc(100vh-40px)] items-center justify-center bg-[var(--app-color-surface)] p-3">
          <div
            className={`h-full w-full overflow-hidden transition-colors duration-200 ${
              showSearchChrome ? 'rounded-b-xl border border-dashed border-[var(--app-color-border)]' : ''
            }`}
          >
            {showSearchChrome ? (
              <div
                className={`pointer-events-none border-2 border-dashed border-[var(--app-color-primary)] absolute inset-3 z-10 flex items-center justify-center rounded-b-xl bg-[#fff/0.3] backdrop-blur-[6px] transition-opacity duration-200 ${
                  isFileDragActive ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="px-4 text-center text-[16px] font-medium text-[var(--app-color-primary)]">
                  松开即可导入 `.bcm` 文件
                </div>
              </div>
            ) : null}
            {showSearchChrome ? (
              <VersionControls
                version={controlState.version}
                status={controlState.status}
                process={controlState.process}
                onVersionChange={handleVersionChange}
                onStatusChange={handleStatusChange}
              />
            ) : null}
            <MainPanel
              version={controlState.version}
              status={controlState.status}
              process={controlState.process}
              panelStep={panelStep}
              onPanelStepChange={setPanelStep}
              onProcessChange={setProcess}
              onFileDragActiveChange={setIsFileDragActive}
            />
          </div>
        </Content>
        <AboutModal open={aboutOpen} />
      </Layout>
    </AntdApp>
  )
}
