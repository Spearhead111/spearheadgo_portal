<template>
  <Header />
  <v-btn style="margin-top: 100px" @click="toggleTheme">点击切换主题</v-btn>
  <RouterView id="router-view" />
  <!-- <Footer /> -->
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from '@/components/Header/Header.vue'
import Footer from '@/components/Footer/Footer.vue'
import { ref } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>

<style lang="scss" scoped>
#router-view {
}
</style>
