<template>
  <div
    :class="['header-wrapper', lastScrollPosition > 500 ? 'header-wrapper-additional' : '']"
    v-if="showHeader"
  >
    <div class="menu-drawer-wrapper">
      <v-layout>
        <v-app-bar-nav-icon
          color="#fff"
          variant="text"
          @click.stop="drawer = !drawer"
        ></v-app-bar-nav-icon>
        <v-navigation-drawer
          class="menu-drawer-content"
          v-model="drawer"
          location="bottom"
          temporary
        >
          <!-- <v-list-item v-for="(menuItem, index) in HEAD_MENU"> 1 </v-list-item> -->
          <li
            v-for="(menuItem, index) in HEAD_MENU"
            v-auth="menuItem.auth"
            :class="{
              'submenu-item': true,
              'submenu-selected': selectedSubMenu.split('-').includes(menuItem.submenuName)
            }"
          >
            <v-menu open-delay="150" close-delay="0" location="right">
              <template v-slot:activator="{ props }">
                <v-btn variant="text" v-bind="props" @click="routerJump(menuItem)">
                  <v-img :width="24" :src="menuItem.iconUrl"></v-img>
                  <span class="submeun-text pl-2" style="font-size: 16px; font-weight: bold">{{
                    menuItem.des
                  }}</span>
                </v-btn>
              </template>

              <v-list v-if="menuItem.children.length" style="padding: 0">
                <v-list-item
                  v-for="(subSubmenu, idx) in menuItem.children"
                  :key="idx"
                  style="padding: 0"
                >
                  <v-btn variant="text" @click="routerJump(subSubmenu)">
                    <span
                      :class="{
                        'submenu-selected': selectedSubMenu === subSubmenu.submenuName
                      }"
                      >{{ subSubmenu.des }}</span
                    >
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-menu>
            <!-- <v-btn variant="text" @click="routerJump(menuItem)">
          <span style="font-size: 16px; font-weight: bold">{{ menuItem.des }}</span>
        </v-btn> -->
          </li>
          <div class="text-center">
            <v-btn
              color="deep-purple-accent-4"
              icon="mdi-close"
              variant="text"
              @click="drawer = false"
            >
            </v-btn>
          </div>
        </v-navigation-drawer>
      </v-layout>
    </div>
    <div class="logo-name">
      <div class="front">SPEARHEAD</div>
      <div class="bottom">一起学习共同进步</div>
    </div>
    <ul class="header-menu">
      <li
        v-for="(menuItem, index) in HEAD_MENU"
        v-auth="menuItem.auth"
        :class="{
          'submenu-item': true,
          'submenu-selected': selectedSubMenu.split('-').includes(menuItem.submenuName)
        }"
      >
        <v-menu open-on-hover open-delay="150" close-delay="0">
          <template v-slot:activator="{ props }">
            <v-btn variant="text" v-bind="props" @click="routerJump(menuItem)">
              <v-img :width="24" :src="menuItem.iconUrl"></v-img>
              <span class="submeun-text pl-2" style="font-size: 16px; font-weight: bold">{{
                menuItem.des
              }}</span>
            </v-btn>
          </template>

          <v-list v-if="menuItem.children.length" style="padding: 0">
            <v-list-item
              v-for="(subSubmenu, idx) in menuItem.children"
              :key="idx"
              style="padding: 0"
            >
              <v-btn variant="text" @click="routerJump(subSubmenu)">
                <span
                  :class="{
                    'submenu-selected': selectedSubMenu === subSubmenu.submenuName
                  }"
                  >{{ subSubmenu.des }}</span
                >
              </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
        <!-- <v-btn variant="text" @click="routerJump(menuItem)">
          <span style="font-size: 16px; font-weight: bold">{{ menuItem.des }}</span>
        </v-btn> -->
      </li>
      <!-- 用户头像菜单 -->
      <v-menu rounded>
        <template v-slot:activator="{ props }">
          <v-btn class="user-avatar-menu" size="small" icon v-bind="props">
            <v-avatar color="brown">
              <v-img v-if="userInfo.avatar" cover :src="userInfo?.avatar"></v-img>
              <span v-else class="text-h5">{{
                userInfo?.nickname ? userInfo?.nickname[0].toUpperCase() : 'Hi'
              }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar color="brown">
                <v-img v-if="userInfo.avatar" cover :src="userInfo?.avatar"></v-img>
                <span v-else class="text-h5">{{
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
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import useUserStore from '@/stores/modules/user'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()

// useStore才是响应式的，如果直接从useStore中拿userInfo会丢失响应式，用storeToRefs来将userStore解构后的state也是响应式
const { userInfo, selectedSubMenu } = storeToRefs(userStore)
const router = useRouter()
const route = useRoute()
const showHeader = ref(true) // 是否显示头部
const lastScrollPosition = ref(window.scrollY) // 最后一次的滚动位置
const drawer = ref(false) // 手机端是否展示导航目录

onMounted(() => {
  window.addEventListener('scroll', scrollEvent)
})

/** 判断header是否显示 */
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
 * @param {any} item // 子菜单的配置信息
 * @return {*}
 */
const routerJump = (item: any): void => {
  if (!item.path) return
  selectedSubMenu.value = item.submenuName
  router.push(item.path)
  // 将当前的菜单选择存储到sessionStorage中
  sessionStorage.setItem('selectedSubMenu', selectedSubMenu.value)
}

const toLogin = () => {
  localStorage.setItem('scrollTop', window.scrollY + '')
  router.push({
    path: 'login',
    query: {
      from: route.fullPath
    }
  })
}

const logOut = () => {
  userStore.logOut()
}
</script>
