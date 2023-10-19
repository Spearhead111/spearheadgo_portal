<template>
  <Header />
  <PageSetting />
  <RouterView id="router-view" />
  <!-- 回到顶部 -->
  <v-icon
    class="go-top"
    v-if="showGoTop"
    icon="mdi-arrow-collapse-up"
    color="rgb(146 107 231)"
    size="large"
    @click="goBackTop"
  ></v-icon>
  <!-- <Footer /> -->
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from '@/components/Header/Header.vue'
import Footer from '@/components/Footer/Footer.vue'
import PageSetting from '@/components/PageSetting/PageSetting.vue'
import { onMounted, ref } from 'vue'

const showGoTop = ref(false)

onMounted(() => {
  window.addEventListener('scroll', showGoTopIcon)
})

/** 是否展示回到顶部的按钮icon */
const showGoTopIcon = () => {
  if (
    document.documentElement.scrollTop > (window.innerHeight * 3) / 4 ||
    document.body.scrollTop > (window.innerHeight * 3) / 4
  ) {
    showGoTop.value = true
  } else {
    showGoTop.value = false
  }
}

/** 回到顶部 */
const goBackTop = () => {
  // document.documentElement.scrollTop = document.body.scrollTop = 0;
  let top = document.documentElement.scrollTop || document.body.scrollTop
  // 实现过度滚动效果
  const timeTop = setInterval(() => {
    document.body.scrollTop = document.documentElement.scrollTop = top -= 50
    if (top <= 0) {
      clearInterval(timeTop)
    }
  }, 10)
}
</script>

<style lang="scss" scoped>
#router-view {
}
.go-top {
  position: fixed;
  right: 30px;
  bottom: 78px;
  z-index: 9999;
  cursor: pointer;
  width: 35px;
  height: 35px;
  transition: $transitionAll;
  &:hover {
    bottom: 85px;
  }
}
</style>
