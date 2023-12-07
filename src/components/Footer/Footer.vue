<template>
  <v-card class="footer-wrapper flex flex-column align-center justify-center" rounded="0">
    <div class="pt-0 font-18">
      The only <span class="font-weight-bold">limit</span> is your
      <span class="font-weight-bold" style="color: #880e4f">imagination</span>
    </div>
    <v-divider></v-divider>
    <div>
      <a class="beian-link mr-2" href="https://beian.miit.gov.cn/" target="_blank">
        蜀ICP备2022028996号-1
      </a>
      <v-icon icon="mdi-copyright"></v-icon>
      {{ `${new Date().getFullYear()}` }} <strong>Spearhead</strong>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import './style.scss'
</script>
