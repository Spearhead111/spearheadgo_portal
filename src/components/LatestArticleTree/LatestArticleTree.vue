<template>
  <div class="flex flex-column align-center">
    <div class="mb-3 font-bold" style="color: #7a7a7a">最新发布</div>
    <template v-for="(item, index) in latestArticleData" :key="index">
      <LatestArticleLeaf
        :is-left="index % 2 === 0"
        :article-info="item"
        :style="{ 'align-self': index % 2 === 0 ? 'flex-start' : 'flex-end' }"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import './style.scss'
import LatestArticleLeaf from './LatestArticleLeaf/LatestArticleLeaf.vue'
import { onMounted, ref } from 'vue'
import useArticleStore from '@/stores/modules/article'
import { errorCodeMap } from '@/utils'
import { ElMessage } from 'element-plus'
import type { Tag } from '@/views/Home/Home.vue'

export interface LatestArticle {
  articleId: number
  title: string
  createTime: number
  author: string
  authorRole: string
  authorAvatar: string
  tags: Tag[]
}

const articleStore = useArticleStore()
const latestArticleData = ref<LatestArticle[]>([])
const pageNo = ref(1)
const pageSize = ref(6)

onMounted(() => {
  getLatestArticle()
})

const getLatestArticle = async () => {
  const params = {
    pageNo: pageNo.value,
    pageSize: pageSize.value
  }
  const res = await articleStore.getLatestArticle(params)
  if (res && res.result_code === 'success') {
    latestArticleData.value = (res as any).data
  } else {
    ElMessage(errorCodeMap(res.result_code, res.message))
  }
}
</script>

<style lang="scss"></style>
