import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import 'antd/dist/reset.css'
import './index.css'
import App from './App.jsx'

const theme = {
  token: {
    colorPrimary: '#fa9a4b',
    colorInfo: '#fa9a4b',
    colorSuccess: '#52c41a',
    fontFamily: 'MiSans'
  }
}

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <ConfigProvider theme={theme}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
)
