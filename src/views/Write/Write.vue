<template>
  <div class="flex flex-column flex">
    <iframe
      src="https://spearhead-cdn-1314941949.cos.ap-chengdu.myqcloud.com/writeHeadBanner/tortoise.html"
      frameborder="0"
      class="width-100 write-banner-iframe"
      scrolling="no"
    ></iframe>
    <v-container class="write-blog-wrapper">
      <v-form ref="form">
        <v-text-field
          class="pb-5"
          v-model="blogTitle"
          placeholder="请输入文章标题（最多15个字符）"
          hint="请输入文章标题（最多15个字符）"
          :counter="15"
          :rules="rules.blogTitle"
          variant="solo"
          clearable
          label="文章标题"
        ></v-text-field>
        <v-text-field
          class="pb-5"
          v-model="blogSubtitle"
          placeholder="请输入文章副标题（最多20个字符）"
          hint="请输入文章副标题（最多20个字符）"
          :counter="20"
          :rules="rules.blogSubtitle"
          variant="solo"
          clearable
          label="文章副标题"
        ></v-text-field>
        <v-file-input
          class="pb-5"
          accept="image/*"
          label="文章封面"
          hint="请选择文章封面图片(仅支持最大1M)"
          prepend-icon=""
          append-inner-icon="mdi-image"
          v-model="blogBanner"
          :rules="rules.blogBanner"
          show-size
          counter
          chips
          variant="solo"
        >
          <template v-slot:selection="{ fileNames }">
            <template v-for="fileName in fileNames" :key="fileName">
              <v-chip size="small" label color="primary" class="me-2">
                {{ fileName }}
              </v-chip>
            </template>
          </template></v-file-input
        >
        <v-select
          class="pb-5"
          label="文章标签"
          v-model="blogTags"
          :items="tagList"
          :counter="3"
          :rules="rules.blogTags"
          placeholder="最多选择3个标签"
          item-title="label"
          item-value="code"
          multiple
          chips
          clearable
          variant="solo"
        >
          <!-- 选中的tag(chip)在select框中的插槽设置 -->
          <template #chip="{ item }">
            <v-chip :color="item.raw.color"
              ><v-icon start icon="mdi-label"></v-icon><span>{{ item.raw.label }}</span></v-chip
            >
          </template>
        </v-select>
        <div class="flex align-center justify-space-between mb-2">
          <span style="font-size: 20px">文章内容</span>
          <v-tooltip text="预览">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-eye-outline"
                color="deep-purple-accent-4"
                size="x-small"
                @click="debouncePreviewBlog"
              >
              </v-btn>
            </template>
          </v-tooltip>
          <v-dialog
            v-model="previewBlogDialogVisible"
            :scrim="false"
            class="blog-preview-dialog pa-0 ma-0"
          >
            <Blog
              :type="BLOG_VISIBLE_TYPE.PREVIEW"
              :blogInfo="blogInfo"
              v-model:previewVisible="previewBlogDialogVisible"
            />
          </v-dialog>
        </div>
        <!-- MavonEditor富文本编辑器 -->
        <mavon-editor class="mb-8 mavon-editor" v-model="blogContent" :ishljs="true" />
      </v-form>
      <div class="flex align-center justify-center">
        <v-btn prepend-icon="mdi-upload" color="deep-purple-accent-4" @click="debouncePublishBlog">
          发布文章
        </v-btn>
        <v-dialog v-model="publishLoading" persistent width="auto">
          <v-card color="primary">
            <v-card-text>
              发布中请稍后
              <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import './style.scss'
import { debounce, throttle } from 'lodash'
import Blog from '@/views/Blog/Blog.vue'
import { onMounted } from 'vue'
import { BLOG_VISIBLE_TYPE } from '@/constants/common'
import { ElMessage } from 'element-plus'
// import 'mavon-editor/dist/markdown/github-markdown.min.css'

const form = ref()
const blogTitle = ref('') // 文章标题
const blogSubtitle = ref('') // 文章副标题
const blogContent = ref<any>() // 文章内容
const blogBanner = ref<any[]>([]) // 文章banner图片
const blogTags = ref<any[]>([]) // 文章标签
const blogInfo = computed(() => {
  const info = {
    title: blogTitle.value.trim(),
    subtitle: blogSubtitle.value.trim(),
    content: blogContent.value,
    banner: blogBanner.value,
    tags: blogTags.value
  }
  return info
})
const tagList = ref<any[]>([]) // 文章类型标签
const publishLoading = ref(false) // 发布文章loading
const previewBlogDialogVisible = ref(false) // 预览文章dialog显示
const rules = ref<any>({
  blogTitle: [
    (v: string) => !!v || '请输入文章标题',
    (v: string) => (v && v.length <= 15) || '文章标题长度不能超过15个字符'
  ],
  blogSubtitle: [
    (v: string) => !!v || '请输入文章副标题',
    (v: string) => (v && v.length <= 25) || '文章副标题长度不能超过25个字符'
  ],
  blogTags: [
    (v: any[]) => v.length > 0 || '请至少选择一个文章标签',
    (v: any[]) => (v.length > 0 && v.length <= 3) || '文章最多选择3个标签'
  ],
  blogBanner: [
    (v: any) => {
      return !!v.length || '请选择文章封面图片'
    },
    (v: any) => {
      return !v || !v.length || v[0].size < 1000000 || '上传的文章封面图片不能超过1M'
    }
  ]
})

onMounted(() => {
  for (let i = 0; i < 10; i++) {
    tagList.value.push({
      label: 'label' + i,
      code: 'code' + i,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      selected: false
    })
  }
})

/** 预览文章 */
const previewBlog = async () => {
  const { valid } = await form.value.validate()
  // if (!valid) {
  //   ElMessage.error('请填写完整文章信息')
  //   return
  // }
  const params = {
    blogTitle: blogTitle.value,
    blogSubtitle: blogSubtitle.value,
    blogContent: blogContent.value,
    blogBanner: blogBanner.value,
    blogTags: blogTags.value
  }
  console.log(params, '预览文章！！！')
  previewBlogDialogVisible.value = true
}

/** 防抖预览文章 */
const debouncePreviewBlog = debounce(previewBlog, 300)

/** 发布文章 */
const publishBlog = async () => {
  const { valid } = await form.value.validate()
  if (!valid) {
    return
  }
  const params = {
    blogTitle: blogTitle.value,
    blogSubtitle: blogSubtitle.value,
    blogContent: blogContent.value,
    blogBanner: blogBanner.value,
    blogTags: blogTags.value
  }
  publishLoading.value = true
  setTimeout(() => {
    console.log(params, '发布文章！！！')
    publishLoading.value = false
  }, 10000)
}

/** 防抖发布文章 */
const debouncePublishBlog = debounce(publishBlog, 300)
</script>
