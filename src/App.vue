<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Header from '@/components/Header/Header.vue'
import Footer from '@/components/Footer/Footer.vue'
</script>

<template>
  <Header />
  <RouterView id="router-view" />
  <Footer />
</template>

<style lang="scss" scoped>
#router-view {
}
</style>
