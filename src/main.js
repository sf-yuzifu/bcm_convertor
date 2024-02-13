import { createApp } from 'vue'
import './styles.css'
import 'nprogress/nprogress.css'
import App from './App.vue'
import { open } from '@tauri-apps/api/shell'

createApp(App).mount('#app')

const bar = document.getElementById('navbar-button-bar')
const links = document.querySelectorAll('a[href]')

/**
 * 菜单栏排序设置（以Mac为例）。
 */
if (navigator.platform.indexOf('Mac') === 0) {
  bar.style.left = '5px'
  bar.style.flexDirection = 'row'
}

/**
 * 链接在外部浏览器打开。
 */
links.forEach((link) => {
  link.addEventListener('click', async (e) => {
    const url = link.getAttribute('href')
    e.preventDefault()
    await open(url)
  })
})
