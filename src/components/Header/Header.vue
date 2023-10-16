<template>
  <div class="header-wrapper" v-if="showHeader">
    <div class="logo-name">
      <h2>SPEARHEAD</h2>
    </div>
    <ul class="header-menu">
      <li v-for="(menuItem, index) in HEAD_MENU" @click="routerJump(menuItem.path)">
        <span>{{ menuItem.des }}</span>
      </li>
      <v-avatar class="avatar" :image="myImg" size="40" @click=""></v-avatar>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import './style.scss'
import { ref } from 'vue'
import { HEAD_MENU } from '@/constants'
import { useRouter } from 'vue-router'
import myImg from '@/assets/53.jpg'

const router = useRouter()
const showHeader = ref(true)

document.addEventListener('scroll', () => {
  const scrollY = window.scrollY
  const height = window.innerHeight
  showHeader.value = scrollY < height / 2
})

/**
 * @description :
 * @param {string} path // 路由跳转路径
 * @return {*}
 */
const routerJump = (path: string): void => {
  if (!path) return
  router.push(path)
}
</script>
