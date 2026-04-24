<script setup>
import { ref } from 'vue'
import { showAlert } from '../services/system/dialogService.js'
import { runConvertWorkflow } from '../workflows/convertWorkflow.js'

const emit = defineEmits(['pro'])
const props = defineProps(['ver', 'status', 'process'])

const workid = ref(6654365)

const checkNum = (event) => {
  let value = event.target.value
  value = value.replace(/\D/g, '')
  value = Math.trunc(value)
  if (value > 10 ** 9) value = parseInt(String(value).slice(0, 9))
  event.target.value = value
  workid.value = value
}

const convert = async () => {
  if (props.process === 1) {
    return
  }

  emit('pro', 1)

  try {
    const result = await runConvertWorkflow({
      version: props.ver,
      status: props.status,
      workId: workid.value
    })

    if (result.status === 'success') {
      emit('pro', 2)
      return
    }

    emit('pro', 0)

    if (result.status === 'unavailable') {
      await showAlert('当前环境不支持', '请在桌面应用中使用转换功能')
    }
  } catch (error) {
    console.error(error)
    emit('pro', 0)
    await showAlert('转换失败', error?.message || '请稍后重试')
  }
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
