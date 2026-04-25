<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { listen } from '@tauri-apps/api/event'
import { showAlert } from '../services/system/dialogService.js'
import { showErrorAlert } from '../services/system/errorHandlingService.js'
import { isTauri } from '../services/system/runtimeService.js'
import { runConvertWorkflow } from '../workflows/convertWorkflow.js'

const emit = defineEmits(['pro'])
const props = defineProps(['ver', 'status', 'process'])

const workid = ref(6654365)
const builderMessage = ref('正在准备转换任务')
const builderPercent = ref(0)
const builderTargetPercent = ref(0)
const builderDetail = ref('')
const builderStage = ref('idle')
const builderLastEventAt = ref(0)
let unlistenBuilderStatus
let builderProgressTimer

const STAGE_SOFT_CAP = {
  idle: 0,
  'process-files': 10,
  'builder-prepare': 14,
  download: 40,
  package: 90,
  postprocess: 99,
  finalize: 99,
  success: 100,
  error: 100
}

const STAGE_DRIFT_PER_SECOND = {
  idle: 0,
  'process-files': 1.2,
  'builder-prepare': 0.8,
  download: 0.15,
  package: 0.55,
  postprocess: 0.8,
  finalize: 0.25,
  success: 0,
  error: 0
}

const normalizePercent = (value) => {
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue)) {
    return null
  }

  return Math.min(100, Math.max(0, Math.round(numericValue)))
}

const mapPercentToRange = (value, fromStart, fromEnd, toStart, toEnd) => {
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue)) {
    return null
  }

  if (fromEnd === fromStart) {
    return toEnd
  }

  const ratio = Math.min(1, Math.max(0, (numericValue - fromStart) / (fromEnd - fromStart)))
  return toStart + ratio * (toEnd - toStart)
}

const applyProgressPayload = (payload) => {
  builderMessage.value = payload.message || '正在打包，请稍候'
  builderDetail.value = payload.detail || ''
  builderStage.value = payload.stage || builderStage.value
  builderLastEventAt.value = Date.now()

  const nextPercent = normalizePercent(payload.percent)
  if (nextPercent !== null) {
    builderTargetPercent.value = Math.max(builderTargetPercent.value, nextPercent)
    if (builderStage.value === 'success') {
      builderTargetPercent.value = 100
    }
  }
}

const mapBuilderProgress = (payload) => {
  const rawStage = payload.stage || 'builder-prepare'
  const rawPercent = Number(payload.percent)
  const message = payload.message || '正在打包，请稍候'
  const detail = payload.detail || ''

  if (rawStage === 'download') {
    return {
      stage: 'download',
      message,
      detail,
      percent:
        mapPercentToRange(rawPercent, 20, 72, 10, 40) ??
        mapPercentToRange(rawPercent, 0, 100, 10, 40) ??
        14
    }
  }

  if (rawStage === 'package') {
    return {
      stage: 'package',
      message,
      detail,
      percent:
        mapPercentToRange(rawPercent, 78, 92, 40, 84) ??
        (message.includes('安装包') ? 78 : 40)
    }
  }

  if (rawStage === 'finalize') {
    return {
      stage: 'package',
      message,
      detail,
      percent: mapPercentToRange(rawPercent, 94, 98, 84, 90) ?? 88
    }
  }

  if (rawStage === 'success') {
    return {
      stage: 'postprocess',
      message: '打包已完成，正在整理输出文件',
      detail,
      percent: 90
    }
  }

  if (rawStage === 'error') {
    return {
      stage: 'error',
      message,
      detail,
      percent: builderTargetPercent.value
    }
  }

  return {
    stage: 'builder-prepare',
    message,
    detail,
    percent: message.includes('生成打包配置') ? 12 : message.includes('执行 electron-builder') ? 14 : 11
  }
}

const resetBuilderProgress = () => {
  builderMessage.value = '正在准备转换任务'
  builderPercent.value = 0
  builderTargetPercent.value = 0
  builderDetail.value = ''
  builderStage.value = 'idle'
  builderLastEventAt.value = 0
}

const updateBuilderProgress = (deltaSeconds) => {
  if (props.process !== 1) {
    return
  }

  const stage = builderStage.value
  const softCap = STAGE_SOFT_CAP[stage] ?? builderTargetPercent.value
  const driftRate = STAGE_DRIFT_PER_SECOND[stage] ?? 0
  const timeSinceLastEvent = builderLastEventAt.value ? Date.now() - builderLastEventAt.value : 0
  let desiredPercent = builderTargetPercent.value

  if (
    stage !== 'success' &&
    stage !== 'error' &&
    timeSinceLastEvent >= 1200 &&
    builderPercent.value < softCap
  ) {
    desiredPercent = Math.max(
      desiredPercent,
      Math.min(softCap, builderPercent.value + driftRate * deltaSeconds)
    )
  }

  if (desiredPercent <= builderPercent.value) {
    if (stage === 'success' && builderPercent.value < 100) {
      builderPercent.value = Math.min(100, builderPercent.value + 240 * deltaSeconds)
    }
    return
  }

  const gap = desiredPercent - builderPercent.value
  const smoothStep = Math.max(0.6, gap * 0.18)
  builderPercent.value = Math.min(desiredPercent, builderPercent.value + smoothStep)
}

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

  resetBuilderProgress()
  applyProgressPayload({ stage: 'process-files', message: '正在准备转换任务', percent: 0 })
  emit('pro', 1)

  try {
    const result = await runConvertWorkflow({
      version: props.ver,
      status: props.status,
      workId: workid.value,
      onProgress: applyProgressPayload
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
    await showErrorAlert(error)
  }
}

onMounted(async () => {
  if (!isTauri()) {
    return
  }

  unlistenBuilderStatus = await listen('builder-status', (event) => {
    applyProgressPayload(mapBuilderProgress(event.payload || {}))
  })

  let lastTickAt = Date.now()
  builderProgressTimer = window.setInterval(() => {
    const now = Date.now()
    const deltaSeconds = Math.max(0.08, (now - lastTickAt) / 1000)
    lastTickAt = now
    updateBuilderProgress(deltaSeconds)
  }, 120)
})

onBeforeUnmount(() => {
  unlistenBuilderStatus?.()
  if (builderProgressTimer) {
    window.clearInterval(builderProgressTimer)
  }
})
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
    <p id="main-title" v-if="props.process === 1">{{ builderMessage }}</p>
    <div v-if="props.process === 1" id="builder-progress">
      <div id="builder-progress-meta">
        <span>总体进度</span>
        <span>{{ builderPercent }}%</span>
      </div>
      <div id="builder-progress-track">
        <div id="builder-progress-bar" :style="{ width: `${builderPercent}%` }"></div>
      </div>
      <p v-if="builderDetail" id="builder-progress-detail">{{ builderDetail }}</p>
    </div>
    <p id="main-title" v-else-if="props.process !== 2">
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

#builder-progress {
  width: min(360px, 100%);
  margin: 0 auto 1.25em;
}

#builder-progress-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.45em;
  font-size: 14px;
}

#builder-progress-track {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.12);
}

#builder-progress-bar {
  height: 100%;
  border-radius: inherit;
  background: #f4d35e;
  transition: width 0.2s ease;
}

#builder-progress-detail {
  margin: 0.6em 0 0;
  font-size: 12px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.72);
  word-break: break-word;
}
</style>
