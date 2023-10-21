<template>
  <v-card rounded="lg" variant="elevated" :elevation="5" class="blog-profile-wrapper">
    <v-img
      class="align-end text-white profile-img"
      height="200"
      src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
      cover
    >
      <v-card-title v-html="highLightWord('文章大标题', highlightKey)"></v-card-title>
    </v-img>
    <v-card-subtitle class="pt-2"> Number 10 </v-card-subtitle>
    <v-card-subtitle class="pt-1" style="display: flex; align-items: center">
      <calendar-dot
        class="mr-1"
        theme="multi-color"
        size="17.5"
        :fill="['#333', '#4a90e2', '#ffffff', '#ffffff']"
        :strokeWidth="2"
      />
      发布于{{ formatDate(1672506061000) }}
    </v-card-subtitle>
    <v-card-text height="200" class="pt-1">
      <div
        class="blog-profile-text"
        v-html="
          highLightWord(
            '五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字五十个字',
            highlightKey
          )
        "
      ></div>
    </v-card-text>
    <div class="blog-profile-tag-wrapper">
      <v-chip size="small" label>
        <v-icon start icon="mdi-label"></v-icon><span>我是五个字</span>
      </v-chip>
      <v-chip size="small" label>
        <v-icon start icon="mdi-label"></v-icon><span>我是五个字</span>
      </v-chip>
      <v-chip size="small" label>
        <v-icon start icon="mdi-label"></v-icon><span>我是五个字</span>
      </v-chip>
    </div>
    <v-card-actions style="justify-content: space-between">
      <div class="blog-profile-icon-wrapper">
        <div>
          <endocrine
            theme="multi-color"
            size="17.5"
            :fill="['#333', '#ec2941', '#f5a623', '#f5a623']"
            :strokeWidth="2"
          />
          <span>{{ 0 }} 浏览</span>
        </div>
        <div>
          <comments
            theme="multi-color"
            size="17.5"
            :fill="['#333', '#f88e3f', '#FFF', '#5d92a5']"
            :strokeWidth="2"
          />
          <span>{{ 0 }} 评论</span>
        </div>
        <div>
          <Like
            theme="two-tone"
            size="17.5"
            :fill="['#8f8f8f', '#f8664e']"
            :strokeWidth="2"
            strokeLinecap="butt"
          />
          <span>{{ 0 }} 点赞</span>
        </div>
      </div>
      <v-btn
        border
        variant="text"
        class="text-none"
        append-icon="mdi-chevron-right"
        color="teal-lighten-1"
      >
        了解详细
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Like, Comments, Endocrine, CalendarDot } from '@icon-park/vue-next'
import { formatDate, highLightWord } from '@/utils'
import './style.scss'

const { articleProfile, highlightKey } = defineProps<{
  articleProfile: any
  highlightKey: string // 搜索的高亮关键字
}>()
const tagList = ref<any[]>([]) // 文章tag列表
</script>
