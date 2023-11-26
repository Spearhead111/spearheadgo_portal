<template>
  <Header></Header>
  <PageSetting class="hidden-xs" />
  <RouterView id="router-view" :key="routerKey" />
  <!-- 回到顶部 -->
  <v-icon
    class="go-top"
    v-if="showGoTop"
    icon="mdi-arrow-collapse-up"
    color="rgb(146 107 231)"
    size="large"
    @click="goBackTop"
  ></v-icon>
  <Footer class="align-self-end hidden-xs"></Footer>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import Header from '@/components/Header/Header.vue'
import Footer from '@/components/Footer/Footer.vue'
import PageSetting from '@/components/PageSetting/PageSetting.vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import useUserStore from './stores/modules/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const showGoTop = ref(false)

const routerKey = computed(() => {
  return route.path + JSON.stringify(route.query)
})

onMounted(async () => {
  window.addEventListener('scroll', showGoTopIcon)
  // 校验一下用户当前信息有没有变更，如果变更需要重新登录
  await userStore.verify()
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
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style lang="scss" scoped>
#router-view {
}
.go-top {
  position: fixed;
  right: 30px;
  bottom: 78px;
  z-index: 1001;
  cursor: pointer;
  width: 35px;
  height: 35px;
  transition: $transitionAll;
  &:hover {
    bottom: 85px;
  }
}
@media (max-width: 600px) {
  .go-top {
    scale: 0.8;
    display: none;
  }
}
</style>
