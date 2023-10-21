<template>
  <iframe
    src="https://spearhead-cdn-1314941949.cos.ap-chengdu.myqcloud.com/writeHeadBanner/tortoise.html"
    frameborder="0"
    class="width-100 write-banner-iframe"
    scrolling="no"
  ></iframe>
  <v-container> </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
</script>

<style lang="scss" scoped>
.write-banner-iframe {
  position: relative;
  animation: imgIn 1s linear;
}
@keyframes imgIn {
  0% {
    bottom: 80px;
    opacity: 0;
  }
  100% {
    bottom: 0;
    opacity: 1;
  }
}
</style>
