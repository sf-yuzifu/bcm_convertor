<script setup>
import Func from './components/Func.vue'
import Main from './components/Main.vue'
import About from './components/About.vue'
import Navbar from './components/Navbar.vue'

import { ref } from 'vue'

const cur_version = ref('kitten4')
const cur_status = ref('offline')
const cur_process = ref(0)

const ver = (version) => {
  if (!cur_process.value) cur_version.value = version
}

const status = () => {
  if (!cur_process.value) cur_status.value = cur_status.value === 'offline' ? 'online' : 'offline'
}

const process = (process) => {
  cur_process.value = process
}
</script>

<template>
  <Navbar></Navbar>
  <Func
    v-if="cur_process !== 2"
    :ver="cur_version"
    :status="cur_status"
    @ver="ver"
    @status="status"
  ></Func>
  <Suspense>
    <Main :ver="cur_version" :status="cur_status" :process="cur_process" @pro="process"></Main>
  </Suspense>
  <About></About>
</template>

<style scoped></style>
