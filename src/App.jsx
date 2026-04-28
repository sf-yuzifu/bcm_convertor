import { useMemo, useState } from 'react'
import { App as AntdApp, Layout } from 'antd'
import AboutModal from './components/AboutModal.jsx'
import MainPanel from './components/MainPanel.jsx'
import TitleBar from './components/TitleBar.jsx'
import VersionControls from './components/VersionControls.jsx'

const { Content } = Layout

export default function App() {
  const [version, setVersion] = useState('kitten4')
  const [status, setStatus] = useState('offline')
  const [process, setProcess] = useState(0)
  const [panelStep, setPanelStep] = useState('search')
  const [aboutOpen, setAboutOpen] = useState(false)
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
    }
  }

  return (
    <AntdApp>
      <Layout className="h-full !bg-transparent">
        <TitleBar
          aboutOpen={aboutOpen}
          onOpenAbout={() => setAboutOpen(true)}
          onCloseAbout={() => setAboutOpen(false)}
        />
        <Content className="relative flex h-[calc(100vh-40px)] bg-[#FFFCF7] items-center justify-center p-3">
          <div
            className={`${showSearchChrome ? 'border border-[#F9E2BA] border-dashed rounded-b-xl' : ''} h-full w-full`}
          >
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
            />
          </div>
        </Content>
        <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
      </Layout>
    </AntdApp>
  )
}
