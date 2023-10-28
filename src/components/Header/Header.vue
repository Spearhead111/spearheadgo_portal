<template>
  <div
    :class="['header-wrapper', lastScrollPosition > 500 ? 'header-wrapper-additional' : '']"
    v-if="showHeader"
  >
    <div class="logo-name">
      <h2>SPEARHEAD</h2>
    </div>
    <ul class="header-menu">
      <li v-for="(menuItem, index) in HEAD_MENU" @click="routerJump(menuItem.path)">
        <span>{{ menuItem.des }}</span>
      </li>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-avatar
            v-bind="props"
            class="avatar"
            image="https://spearhead-cdn-1314941949.cos.ap-chengdu.myqcloud.com/53.jpg"
            size="40"
            @click=""
          ></v-avatar>
        </template>
        <v-list style="position: relative; left: 20px">
          <v-list-item class="px-2 py-1">
            <v-btn variant="text" @click="toLogin">登录</v-btn>
          </v-list-item>
          <v-list-item v-if="userStore.token" class="px-2 py-1">
            <v-btn variant="text" @click="logOut">注销</v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import './style.scss'
import { ref } from 'vue'
import { HEAD_MENU } from '@/constants'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import useUserStore from '@/stores/modules/user'

const userStore = useUserStore()

const router = useRouter()
const showHeader = ref(true) // 是否显示头部
const lastScrollPosition = ref(window.scrollY) // 最后一次的滚动位置

onMounted(() => {
  window.addEventListener('scroll', scrollEvent)
})

const scrollEvent = () => {
  const currentScrollPosition = window.scrollY
  // 用最后一次的滚动位置和当前的滚动位置进行比较
  if (currentScrollPosition > lastScrollPosition.value) {
    showHeader.value = false
  } else {
    showHeader.value = true
  }
  lastScrollPosition.value = currentScrollPosition
}

/**
 * @description :
 * @param {string} path // 路由跳转路径
 * @return {*}
 */
const routerJump = (path: string): void => {
  if (!path) return
  router.push(path)
}

const toLogin = () => {
  router.push('/login')
}

const logOut = () => {
  userStore.logOut()
}
</script>
