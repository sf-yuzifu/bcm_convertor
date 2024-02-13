<script setup>
const props = defineProps(['ver', 'status'])
</script>

<template>
  <div id="funcs">
    <div id="change">
      <span
        class="into"
        :style="{ color: props.ver === 'kitten3' ? '#fff' : 'rgb(133, 122, 99)' }"
        id="kitten3"
        @click="$emit('ver', 'kitten3')"
        >k3</span
      >
      <span
        class="into"
        :style="{ color: props.ver === 'kitten4' ? '#fff' : 'rgb(133, 122, 99)' }"
        id="kitten4"
        @click="$emit('ver', 'kitten4')"
        >k4</span
      >
      <div id="seld" :style="{ left: props.ver === 'kitten3' ? '2px' : '37px' }"></div>
    </div>
    <div id="wifi" :class="props.status" @click="$emit('status')">
      <img id="line" :src="props.status === 'offline' ? '/close-wifi.svg' : '/wifi.svg'" alt="" />
    </div>
  </div>
</template>

<style scoped>
#wifi.online {
  background: rgb(250, 154, 75);
}

#wifi.offline {
  background: rgb(255, 231, 189);
}

#change span,
#wifi {
  cursor: pointer;
}
</style>
