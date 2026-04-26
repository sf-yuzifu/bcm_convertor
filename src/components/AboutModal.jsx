import { desktopDir } from '@tauri-apps/api/path'
import { Button, Divider, Modal, Space, Typography } from 'antd'
import { invokeBackendCommand } from '../services/system/backendCommandService.js'
import { openExternalUrl } from '../services/system/externalLinkService.js'
import { showErrorAlert } from '../services/system/errorHandlingService.js'

const { Link, Paragraph, Text, Title } = Typography

export default function AboutModal({ open, onClose }) {
  const openOutputDirectory = async () => {
    try {
      await invokeBackendCommand(
        'open_file',
        { path: await desktopDir() },
        {
          title: '打开输出目录失败',
          text: '无法自动打开输出目录，请手动前往桌面查看'
        }
      )
    } catch (error) {
      console.error(error)
      await showErrorAlert(error)
    }
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={760}
      className="[&_.ant-modal-content]:rounded-[28px] [&_.ant-modal-content]:bg-[linear-gradient(180deg,#fffefa_0%,#fff6ee_100%)] [&_.ant-modal-content]:px-6 [&_.ant-modal-content]:pb-3 [&_.ant-modal-content]:pt-6 [&_.ant-modal-header]:!bg-transparent"
      title="关于格式工厂"
    >
      <div className="flex items-center gap-5 max-[760px]:flex-col max-[760px]:items-start">
        <img src="/pic_aboutUs.png" alt="格式工厂" className="w-[252px] max-w-[45%] max-[760px]:max-w-full" />
        <Space direction="vertical" size={4}>
          <Title level={3} className="!m-0">
            版本号：v2.5.0
          </Title>
          <Link onClick={() => openExternalUrl('https://shequ.codemao.cn/user/438403')}>小鱼yuzifu</Link>
        </Space>
      </div>
      <Divider />
      <Space direction="vertical" size={18} className="w-full">
        <div>
          <Text strong>1. 生成的程序无法运行 / 找不到文件存放位置。</Text>
          <Paragraph>
            如果无法打开，则可能是软件问题，可联系作者。Windows 和 macOS 的输出通常在桌面，Linux 通常位于用户的 home
            目录。
            <Button type="link" className="!px-1.5" onClick={openOutputDirectory}>
              点我查看文件位置
            </Button>
          </Paragraph>
        </div>
        <div>
          <Text strong>2. 转换后的应用程序大小远大于 bcm 文件大小。</Text>
          <Paragraph>
            为了让 bcm 独立运行，需要附带额外运行时与资源文件，因此最终生成的应用体积通常会明显增大。
          </Paragraph>
        </div>
        <div>
          <Text strong>3. 为什么离线模式下云变量作品无法使用。</Text>
          <Paragraph>
            编程猫中的云变量需要绑定明确的作品 ID。离线转换得到的文件不具备对应线上作品 ID，因此云变量会退化为普通变量。
          </Paragraph>
        </div>
        <div>
          <Text strong>4. 关于安卓 APK。</Text>
          <Paragraph>
            当前暂不提供 APK 输出。你可以试试
            <Link onClick={() => openExternalUrl('https://coco.codemao.cn/')}> CoCo 编辑器 </Link>
            相关方案。
          </Paragraph>
        </div>
      </Space>
    </Modal>
  )
}
