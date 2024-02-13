<script setup>
import { ref } from 'vue'
import {
  getK3file,
  getOnlineInfo,
  kitten3,
  kitten4,
  linux,
  macos,
  online,
  windows
} from '../functions/convert.js'
import { type } from '@tauri-apps/api/os'
import { join, homeDir, desktopDir } from '@tauri-apps/api/path'
import { removeDir } from '@tauri-apps/api/fs'
import NProgress from 'nprogress'
import { invoke } from '@tauri-apps/api/tauri'

const homeDirPath = await homeDir()
const osType = await type()

const emit = defineEmits(['pro'])
const props = defineProps(['ver', 'status', 'process'])

const workid = ref(6654365)

NProgress.configure({
  template: `<div class="bar loading" role="bar"></div>`
})

const checkNum = (event) => {
  let value = event.target.value
  value = value.replace(/\D/g, '')
  value = Math.trunc(value)
  if (value > 10 ** 9) value = parseInt(String(value).slice(0, 9))
  event.target.value = value
  workid.value = value
}
const convert = async () => {
  try {
    if (osType === 'Windows_NT') {
      await removeDir(await join(homeDirPath, 'convert_tmp2'), { recursive: true })
    }
  } catch (error) {}
  console.log(props.ver, props.status, workid.value)
  emit('pro', 1)
  NProgress.start()
  let project_info
  if (props.status === 'offline' && props.ver === 'kitten3') {
    project_info = await getK3file()
  } else {
    project_info = await getOnlineInfo(workid.value)
  }
  console.log(project_info)
  if (project_info === null) {
    emit('pro', 0)
    NProgress.done()
  }
  if (props.status === 'online') {
    await online(project_info)
  } else if (props.ver === 'kitten3') {
    await kitten3(project_info)
  } else {
    await kitten4(project_info)
  }
  if (osType === 'Darwin') {
    await macos(project_info)
  } else if (osType === 'Linux') {
    await linux(project_info)
  } else {
    await windows(project_info)
  }
  try {
    await removeDir(await join(homeDirPath, 'convert_tmp'), { recursive: true })
    if (osType === 'Windows_NT') {
      await removeDir(await join(homeDirPath, 'convert_tmp2'), { recursive: true })
    }
  } catch (error) {
    console.error(error)
  }
  emit('pro', 2)
  NProgress.done()
  await invoke('open_file', { path: await desktopDir() })
}
</script>

<template>
  <div id="main">
    <img
      :style="{
        width: props.process === 2 ? '259px' : '130px',
        marginBlock: props.process === 2 ? '0 2em' : ''
      }"
      id="main-pic"
      :src="props.process === 2 ? '/success.png' : '/icn_upload.png'"
      alt=""
    />
    <p id="main-title" v-if="props.process !== 2">
      {{
        props.status === 'offline' && props.ver === 'kitten3'
          ? '选择kitten3作品文件进行转换'
          : '将' + props.ver + '作品id输入这里进行转换'
      }}
    </p>
    <input
      :style="
        props.status === 'offline' && props.ver === 'kitten3'
          ? { opacity: 0, height: 0, marginBlockEnd: 0 }
          : { opacity: 1, height: '25px', marginBlockEnd: '1em' }
      "
      v-if="props.process !== 2"
      @input="checkNum"
      v-model.number="workid"
      id="bcm-id"
    />
    <button id="convert" @click="props.process !== 2 ? convert() : $emit('pro', 0)">
      {{
        props.process === 2
          ? '完成'
          : props.status === 'offline' && props.ver === 'kitten3'
          ? '选择文件'
          : '确认'
      }}
    </button>
  </div>
  <div id="loading"></div>
</template>

<style scoped>
input:focus-visible {
  outline-style: unset;
}
</style>
