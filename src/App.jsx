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
  const [aboutOpen, setAboutOpen] = useState(false)

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
          <div className="border border-[#F9E2BA] border-dashed rounded-b-xl w-full h-full">
            <VersionControls
              version={controlState.version}
              status={controlState.status}
              process={controlState.process}
              onVersionChange={handleVersionChange}
              onStatusChange={handleStatusChange}
            />
            <MainPanel
              version={controlState.version}
              status={controlState.status}
              process={controlState.process}
              onProcessChange={setProcess}
            />
          </div>
        </Content>
        <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
      </Layout>
    </AntdApp>
  )
}
