<template>
  <div class="admin-articles-wrapper">
    <div class="width-100 admin-header-banner">
      <img
        class="banner-img"
        src="https://file.spearheadgo.com/img/banner/admin-article-banner.jpg"
        alt=""
      />
    </div>
    <v-container class="admin-articles-content">
      <!-- 文章管理项tab -->
      <v-tabs v-model="curTab" bg-color="transparent" color="deep-purple-accent-4" show-arrows grow>
        <v-tab v-for="tabItem in ADMIN_ARTICLE_TAB" :key="tabItem.value" :value="tabItem.value">
          <span class="font-weight-bold" style="font-size: 18px">{{ tabItem.name }}</span>
        </v-tab>
      </v-tabs>

      <v-window v-model="curTab">
        <v-window-item :value="ADMIN_ARTICLE_TAB.article.value">
          <ArticlesList />
        </v-window-item>
        <v-window-item :value="ADMIN_ARTICLE_TAB.categories.value">
          <CategoriesList />
        </v-window-item>
      </v-window>
    </v-container>
  </div>
</template>
<script lang="ts" setup>
import './style.scss'
import { ref, nextTick, onMounted, watch, computed } from 'vue'
import { ADMIN_ARTICLE_TAB } from '@/constants'
import ArticlesList from './ArticlesList.vue'
import CategoriesList from './CategoriesList.vue'

const curTab = ref(ADMIN_ARTICLE_TAB.article.value) // 默认是文章列表
</script>
