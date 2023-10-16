<template>
  <div class="home-page-wrapper">
    <div class="home-page-background">
      <img :src="myImg" alt="" />
      <div class="banner-wave1"></div>
      <div class="banner-wave2"></div>
    </div>
    <div class="home-page-content">
      <v-container class="page-content bg-background-variant mb-6">
        <v-sheet :elevation="8" :height="400" :width="300" rounded="lg" class="profile">
          <div class="avatar-content">
            <v-avatar :image="myImg" size="100" @click=""></v-avatar>
          </div>
          <h2>SPEARHEAD</h2>
          <div class="contact-type-wrapper">
            <div class="contact-type-item">
              <v-icon icon="mdi-wechat" size="large" color="#24db5a" />Wechat
            </div>
            <v-divider :thickness="2" vertical inset />
            <div class="contact-type-item"><v-icon icon="mdi-github" size="large" />Github</div>
            <v-divider :thickness="2" vertical inset />
            <div class="contact-type-item">
              <v-icon icon="mdi-qqchat" size="large" color="#7bd4ef" />QQ
            </div>
          </div>
        </v-sheet>
      </v-container>
    </div>
  </div>
</template>

<script lang="ts" setup>
import myImg from '@/assets/53.jpg'
import './style.scss'
import { ref } from 'vue'

const contactType = ref()
</script>
