<template>
  <v-btn
    v-if="props.type === BLOG_VISIBLE_TYPE.PREVIEW"
    @click="emit('update:previewVisible', false)"
    class="close-prview-blog-dialog"
    color="deep-purple-accent-4"
    icon="mdi-close"
  >
  </v-btn>
  <!-- ishljs:是否显示高亮 default-open="preview":只做预览展示 :editable="false":是否可编辑 -->
  <!-- subfield: true表示双栏，false表示单栏  :toolbarsFlag="false":是否显示编辑栏 -->
  <mavon-editor
    class="mavon-editor-show"
    style="margin-top: 100px"
    v-model="props.blogInfo.content"
    :ishljs="false"
    default-open="preview"
    :editable="false"
    :subfield="false"
    :toolbarsFlag="false"
  />
</template>

<script lang="ts" setup>
import './style.scss'
import { ref, nextTick, onMounted, watch } from 'vue'
import { BLOG_VISIBLE_TYPE } from '@/constants/common'
import { ElMessage } from 'element-plus'
import { highlightCode } from '@/utils'
import { addCodeBtn } from '@/utils/mavon.js'

interface BlogInfo {
  title: string
  subtitle: string
  content: any
  banner: any[]
  tags: any[]
}
interface Props {
  type: string
  previewVisible?: boolean
  blogInfo: BlogInfo
}
/** 设置默认值 */
const props = withDefaults(defineProps<Props>(), {
  type: BLOG_VISIBLE_TYPE.DETAIl,
  previewVisible: false
})

const emit = defineEmits(['update:previewVisible'])

onMounted(() => {
  /** 页面元素挂载渲染完毕后，高亮一次代码块 */
  nextTick(() => {
    highlightCode()
    addCodeBtn()
  })
})
</script>
