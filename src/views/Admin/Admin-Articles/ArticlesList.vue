<template>
  <div class="article-list-wrapper">
    <v-form ref="form" class="search-form">
      <v-container style="max-width: none">
        <v-row align="center">
          <v-col cols="3">
            <v-text-field
              v-model="search"
              density="compact"
              placeholder="请输入文章标题"
              prepend-inner-icon="mdi-format-title"
              color="blue-grey-lighten-2"
              variant="underlined"
              clearable
              label="文章标题"
            ></v-text-field>
          </v-col>

          <v-col cols="3">
            <v-autocomplete
              label="文章标签"
              v-model="blogTags"
              :items="tagList"
              density="compact"
              prepend-inner-icon="mdi-tag-multiple"
              item-title="label"
              item-value="code"
              multiple
              chips
              closable-chips
              clearable
              color="blue-grey-lighten-2"
              variant="underlined"
            >
              <!-- 选中的tag(chip)在select框中的插槽设置 -->
              <template v-slot:chip="{ props, item, index }">
                <v-chip
                  v-if="index < 2"
                  v-bind="props"
                  :color="item.raw.color"
                  variant="elevated"
                  elevation="0"
                  ><v-icon start :color="item.raw.iconColor" :icon="item.raw.icon"></v-icon
                  ><span class="tag-label">{{ item.raw.label }}</span></v-chip
                >
                <!-- 超过两个省略 -->
                <span v-if="index === 2" class="text-grey text-caption align-self-center">
                  (+{{ blogTags.length - 2 }} 其他)
                </span>
              </template>

              <!-- 选中的tag(chip)在select下拉框中的插槽设置 -->
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props">
                  <v-chip
                    class="rounded-lg"
                    elevation="0"
                    size="small"
                    :color="item.raw.color"
                    variant="elevated"
                  >
                    <v-icon start :color="item.raw.iconColor" :icon="item.raw.icon"> </v-icon>
                    <span class="tag-label">{{ item.raw.label }}</span>
                  </v-chip>
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-col>

          <v-col cols="3">
            <v-autocomplete
              label="作者"
              v-model="blogAuthor"
              closable-chips
              :items="userList"
              prepend-inner-icon="mdi-account-outline"
              density="compact"
              item-title="nickname"
              item-value="id"
              multiple
              chips
              clearable
              color="blue-grey-lighten-2"
              variant="underlined"
            >
              <template v-slot:chip="{ props, item, index }">
                <v-chip
                  v-if="index < 2"
                  elevation="0"
                  v-bind="props"
                  :text="item.raw.nickname"
                ></v-chip>

                <!-- 超过两个省略 -->
                <span v-if="index === 2" class="text-grey text-caption align-self-center">
                  (+{{ blogAuthor.length - 2 }} 其他)
                </span>
              </template>

              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :prepend-avatar="item?.raw?.avatar"
                  :title="`用户昵称：${item.raw.nickname}`"
                  :subtitle="`用户账号：${item.raw.username}`"
                >
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-col>

          <v-col cols="3" align-self="center" class="pl-8">
            <v-btn
              prepend-icon="mdi-magnify"
              color="deep-purple-accent-4"
              :loading="loading"
              @click="getArticlesData"
              >搜索</v-btn
            >
            <v-btn prepend-icon="mdi-refresh" class="ml-5" @click="resetForm">重置</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
    <!-- 文章列表 -->
    <el-table
      v-loading="loading"
      :data="articleDataList"
      tooltip-effect="dark"
      class="article-table"
      :header-cell-style="{ background: 'var(--second-bg-color)', fontWeight: 'bold' }"
      stripe
      style="width: 100%"
      height="480"
    >
      <el-table-column prop="id" label="文章ID" width="100" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="文章标题" min-width="200" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tags" label="文章标签" min-width="250" show-overflow-tooltip>
        <template #default="scope">
          <v-chip
            class="mr-1"
            v-for="tag in scope.row.tags"
            :color="tag.color"
            variant="elevated"
            elevation="0"
            size="small"
            label
          >
            <v-icon start :color="tag.iconColor" :icon="tag.icon"> </v-icon>
            <span class="tag-label">{{ tag.label }}</span>
          </v-chip>
        </template>
      </el-table-column>
      <el-table-column prop="isActivated" label="状态" width="100" show-overflow-tooltip>
        <template #default="scope">
          <span>
            <v-chip
              size="small"
              :color="scope.row.isActivated === 1 ? 'teal-lighten-1' : 'brown-lighten-2'"
              elevation="0"
              variant="elevated"
            >
              {{ scope.row.isActivated === 1 ? '上线中' : '被删除' }}
            </v-chip>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="likes" label="点赞数" width="80" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ scope.row.likes }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="发布时间" width="165" show-overflow-tooltip>
        <template #default="scope">
          <span> {{ formatDate(scope.row.createTime) }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="author" label="作者" width="150" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="最近更新时间" width="165" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ formatDate(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateBy" label="最近更新者" width="150" show-overflow-tooltip>
        <template #default="scope">
          <span>{{ scope.row.updateBy }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作" width="100" fixed="right">
        <template #default="scope">
          <div class="flex align-center">
            <v-tooltip text="编辑">
              <template v-slot:activator="{ props }">
                <v-icon
                  v-bind="props"
                  size="small"
                  color="light-blue-darken-2"
                  class="me-2"
                  @click="editItem(scope.row)"
                  icon="mdi-pencil"
                />
              </template>
            </v-tooltip>

            <v-tooltip text="查看文章">
              <template v-slot:activator="{ props }">
                <v-icon
                  v-bind="props"
                  size="small"
                  color="purple-darken-4"
                  class="me-2"
                  style="position: relative; top: 1px"
                  @click="showArticle(scope.row)"
                  icon="mdi-eye-arrow-right"
                />
              </template>
            </v-tooltip>

            <v-tooltip v-if="scope.row.isActivated === 1" text="删除">
              <template v-slot:activator="{ props }">
                <v-icon
                  v-auth="USER_ROLE_MAP.ADMIN"
                  v-bind="props"
                  size="small"
                  color="red-darken-1"
                  style="position: relative; top: -1px"
                  @click="selectDeleteItem(scope.row)"
                  icon="mdi-delete"
                >
                </v-icon>
              </template>
            </v-tooltip>
            <v-tooltip v-else text="上线">
              <template v-slot:activator="{ props }">
                <v-icon
                  v-auth="USER_ROLE_MAP.ADMIN"
                  v-bind="props"
                  size="small"
                  color="green-darken-1"
                  style="position: relative; top: -1px"
                  @click="selectRecoverItem(scope.row)"
                  icon="mdi-upload"
                >
                </v-icon>
              </template>
            </v-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      class="align-center justify-center"
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="articleDataTotal"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 文章删除二次确认弹窗 -->
    <v-dialog v-if="deleteDialog" v-model="deleteDialog" width="auto">
      <v-card>
        <v-card-text>
          <tips theme="filled" size="18" fill="#fcd53f" :strokeWidth="2" />
          确认删除此篇文章吗？
        </v-card-text>
        <v-card-actions>
          <div class="flex">
            <v-btn
              size="small"
              variant="tonal"
              block
              @click="(deleteDialog = false), (curDeleteArticleId = '')"
              >取消</v-btn
            >
            <v-btn size="small" variant="tonal" block @click="deleteItem">确认</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 文章恢复上线二次确认弹窗 -->
    <v-dialog v-if="recoverDialog" v-model="recoverDialog" width="auto">
      <v-card>
        <v-card-text>
          <tips theme="filled" size="18" fill="#fcd53f" :strokeWidth="2" />
          确认上线此篇文章吗？
        </v-card-text>
        <v-card-actions>
          <div class="flex">
            <v-btn
              size="small"
              variant="tonal"
              block
              @click="(recoverDialog = false), (curRecoverArticleId = '')"
              >取消</v-btn
            >
            <v-btn size="small" variant="tonal" block @click="recoverItem">确认</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { type Tag } from '@/views/Home/Home.vue'
import useArticleStore from '@/stores/modules/article'
import useUserStore from '@/stores/modules/user'
import { formatDate, errorCodeMap } from '@/utils'
import router from '@/router'
import { Tips } from '@icon-park/vue-next'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { USER_ROLE_MAP } from '@/constants'

interface ArticleData {
  id: string
  title: string
  author: string
  createTime: number
  updateBy: string
  updateTime: number
  likes: number
  tags: Tag[]
  isActivated: number
}

export interface UserInfo {
  id: string
  username: string
  nickname: string
  avatar?: string
  email: string
  role: string
  createTime: number
  updateTime: number
  articlesCount: number
  isActivated: number
}
const userStore = useUserStore()
const { userInfo, selectedSubMenu } = storeToRefs(userStore)
const articleStore = useArticleStore()
const articleDataList = ref<ArticleData[]>([]) // 文章列表数据
const articleDataTotal = ref(0) // 搜索的文章总数
const search = ref('') // 搜索内容(文章标题) 模糊匹配
const blogTags = ref<any[]>([]) // 文章标签搜索项(多选)
const blogAuthor = ref<string[]>([]) // 文章作者搜索项(多选)
const pageNo = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const tagList = ref<Tag[]>([]) // 文章类型标签
const userList = ref<UserInfo[]>([]) // 用户列表
const form = ref()
const deleteDialog = ref(false)
const curDeleteArticleId = ref('')
const recoverDialog = ref(false)
const curRecoverArticleId = ref('')

onMounted(async () => {
  init()
})

const init = async () => {
  loading.value = true
  await getArticleTagList()
  await getArticlesData()
  await getUserList()
  loading.value = false
}

/** 获取用户列表 */
const getUserList = async () => {
  const params = {
    pageNo: 1,
    pageSize: 100000,
    search: '',
    status: -1, // -1 查询所有用户
    role: ''
  }
  const res = await userStore.getAllUserList(params)
  if (res && res.result_code === 'success') {
    userList.value = (res.data as any).list
  } else {
    ElMessage(errorCodeMap(res.result_code, res.message))
  }
}

/** 获取文章列表数据 */
const getArticlesData = async () => {
  const params = {
    pageNo: pageNo.value,
    pageSize: pageSize.value,
    search: search.value || '',
    tagList: blogTags.value.join(','),
    author: blogAuthor.value.join(',')
  }

  const res = await articleStore.getAdminArticleList(params)
  if (res && res.result_code === 'success') {
    const { list, total } = res.data as { list: ArticleData[]; total: number }
    articleDataList.value = list
    articleDataTotal.value = total
  } else {
    ElMessage(errorCodeMap(res.result_code, res.message))
  }
}

/** 获取文章标签 */
const getArticleTagList = async () => {
  const res = await articleStore.getArticleTagList()
  if (res && res.result_code === 'success') {
    const { list, total } = res.data as { list: Tag[]; total: number }
    tagList.value = list
  } else {
    ElMessage(errorCodeMap(res.result_code, res.message))
  }
}

/** 重置搜索表单 */
const resetForm = () => {
  form.value.reset()
}

/** pageNo 改变 */
const handleCurrentChange = (val: number) => {
  pageNo.value = val
  getArticlesData()
}

/** pageSize 改变 */
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getArticlesData()
}

/** 查看文章 */
const showArticle = (article: ArticleData) => {
  if (article.isActivated !== 1) {
    return ElMessage.error('文章未上线，无法查看')
  }
  router.push({
    name: 'ArticleDetail',
    query: {
      articleId: article.id
    }
  })
  selectedSubMenu.value = ''
  sessionStorage.removeItem('selectedSubMenu')
}

/** 编辑文章 */
const editItem = (article: ArticleData) => {
  if (article.isActivated !== 1) {
    return ElMessage.error('文章未上线，无法编辑')
  }
  if (!(userInfo.value.role === USER_ROLE_MAP.ROOT || userInfo.value.nickname === article.author)) {
    return ElMessage.error('只有作者本人和ROOT管理员才能进行编辑！')
  }
  router.push({
    name: 'Write',
    query: {
      articleId: article.id
    }
  })
  selectedSubMenu.value = ''
  sessionStorage.removeItem('selectedSubMenu')
}

/** 选择要回复上线的 article 并打开二次弹窗 */
const selectRecoverItem = (article: ArticleData) => {
  recoverDialog.value = true
  curRecoverArticleId.value = article.id
}

/** 删除文章 */
const recoverItem = async () => {
  const res = await articleStore.recoverArticle(Number(curRecoverArticleId.value))
  if (res && res.result_code === 'success') {
    recoverDialog.value = false
    curRecoverArticleId.value = ''
    ElMessage.success('重新上线成功')
    pageNo.value = 1
    await getArticlesData()
  } else {
    ElMessage(errorCodeMap(res.result_code, res.message))
  }
}

/** 选择要删除的 article 并打开二次弹窗 */
const selectDeleteItem = (article: ArticleData) => {
  deleteDialog.value = true
  curDeleteArticleId.value = article.id
}

/** 删除文章 */
const deleteItem = async () => {
  const res = await articleStore.deleteArticle(Number(curDeleteArticleId.value))
  if (res && res.result_code === 'success') {
    deleteDialog.value = false
    curDeleteArticleId.value = ''
    ElMessage.success('删除成功')
    pageNo.value = 1
    await getArticlesData()
  } else {
    ElMessage(errorCodeMap(res.result_code, res.message))
  }
}
</script>
