<script setup>
import { appWindow } from '@tauri-apps/api/window'
const showAbout = () => {
  document.getElementById('aboutUs').style.transform = 'scale(1)'
}

const close = () => {
  if (document.getElementById('aboutUs').style.transform === 'scale(1)') {
    document.getElementById('aboutUs').style.transform = ''
  } else {
    appWindow.close()
  }
}
</script>

<template>
  <div style="cursor: default" data-tauri-drag-region id="navbar">
    <div id="navbar-button-bar">
      <button class="navbar-button" id="close" @click="close">
        <img src="/icn_close.png" alt="" />
      </button>
      <button class="navbar-button" id="minus" @click="appWindow.minimize">
        <img src="/icn_minimize.png" alt="" />
      </button>
      <button class="navbar-button" id="about" @click="showAbout">
        <img src="/icn_aboutUs.png" alt="" />
      </button>
    </div>
    <p data-tauri-drag-region>编程猫格式工厂</p>
  </div>
</template>

<style scoped></style>
