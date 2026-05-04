import { CloudOutlined, DisconnectOutlined } from '@ant-design/icons'
import { Segmented } from 'antd'

export default function VersionControls({ version, status, process, onVersionChange, onStatusChange }) {
  const versionOptions = [
    { label: 'K3', value: 'kitten3' },
    { label: 'K4', value: 'kitten4' }
  ]

  if (status === 'online') {
    versionOptions.push({ label: 'KN', value: 'kittenN' })
  }

  return (
    <div className="absolute left-6 top-6 z-[1] flex items-center gap-3">
      <Segmented value={version} shape="default" options={versionOptions} onChange={onVersionChange} />
      <Segmented
        value={status}
        shape="default"
        options={[
          {
            label: <DisconnectOutlined />,
            value: 'offline'
          },
          {
            label: <CloudOutlined />,
            value: 'online'
          }
        ]}
        onChange={onStatusChange}
      />
    </div>
  )
}
