<template>
  <Header />
  <PageSetting />
  <RouterView id="router-view" />
  <!-- <Footer /> -->
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from '@/components/Header/Header.vue'
import Footer from '@/components/Footer/Footer.vue'
import PageSetting from '@/components/PageSetting/PageSetting.vue'
import { ref } from 'vue'
</script>

<style lang="scss" scoped>
#router-view {
}
</style>
