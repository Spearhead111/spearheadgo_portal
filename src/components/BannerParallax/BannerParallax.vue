<template>
  <div id="selectBox">
    <button id="1">水下世界 - 乌龟版</button> <button id="2">大海之上 - 鳄鱼版</button>
  </div>

  <div id="appp">loading...</div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import run from './run'

onMounted(() => {
  run()
})
</script>

<style lang="scss" scoped>
#app {
  position: relative;
  overflow: hidden;
  margin: 0 auto;
  min-width: 1000px;
  min-height: 155px;
  height: 10vw;
  max-height: 240px;
}

.layer {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

img {
  user-select: none;
  pointer-events: none;
}
</style>
