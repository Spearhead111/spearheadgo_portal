<template>
  <div
    :class="['header-wrapper', lastScrollPosition > 500 ? 'header-wrapper-additional' : '']"
    v-if="showHeader"
  >
    <div class="logo-name">
      <h2>SPEARHEAD</h2>
    </div>
    <ul class="header-menu">
      <li
        v-for="(menuItem, index) in HEAD_MENU"
        v-auth="menuItem.auth"
        @click="routerJump(menuItem.path)"
      >
        <span>{{ menuItem.des }}</span>
      </li>
      <!-- 用户头像菜单 -->
      <v-menu rounded>
        <template v-slot:activator="{ props }">
          <v-btn class="user-avatar-menu" size="small" icon v-bind="props">
            <v-avatar color="brown">
              <span class="text-h5">{{
                userInfo?.nickname ? userInfo?.nickname[0].toUpperCase() : 'Hi'
              }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar color="brown">
                <span class="text-h5">{{
                  userInfo?.nickname ? userInfo?.nickname[0].toUpperCase() : 'Hi'
                }}</span>
              </v-avatar>
              <h3>{{ userInfo?.nickname || '游客' }}</h3>
              <p class="text-caption mt-1">
                {{ userInfo?.username || '未登录' }}
              </p>
              <template v-if="!userStore.token">
                <v-divider></v-divider>
                <v-btn variant="text" @click="toLogin">登录</v-btn>
              </template>
              <template v-if="userStore.token">
                <v-divider></v-divider>
                <v-btn variant="text" @click="logOut">注销</v-btn>
              </template>
            </div>
          </v-card-text>
        </v-card>
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
import { storeToRefs } from 'pinia'

const userStore = useUserStore()

// useStore才是响应式的，如果直接从useStore中拿userInfo会丢失响应式，用storeToRefs来将userStore解构后的state也是响应式
const { userInfo } = storeToRefs(userStore)
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
