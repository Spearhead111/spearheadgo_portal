<template>
  <div class="admin-users-wrapper">
    <div class="width-100 admin-header-banner">
      <img src="https://file.spearheadgo.com/img/banner/admin-user-banner.jpg" alt="" />
    </div>
    <v-container class="admin-users-content">
      <v-form ref="formRef">
        <v-container style="max-width: none">
          <v-row align="center">
            <v-col cols="3">
              <v-text-field
                v-model="form.search"
                density="compact"
                placeholder="请输入用户账号/昵称"
                prepend-inner-icon="mdi-laptop-account"
                color="blue-grey-lighten-2"
                variant="underlined"
                clearable
                label="请输入用户账号/昵称"
              ></v-text-field>
            </v-col>

            <v-col cols="3">
              <UserRoleSelect
                v-model="form.role"
                :multiple="true"
                :collapse-tags="true"
                clearable
              ></UserRoleSelect>
            </v-col>

            <v-col cols="3">
              <v-select
                label="用户状态"
                v-model="form.status"
                :items="USER_STATUS_LIST"
                prepend-inner-icon="mdi-power-plug-outline"
                density="compact"
                item-title="label"
                item-value="value"
                clearable
                color="blue-grey-lighten-2"
                variant="underlined"
              >
                <!-- select框中的tag样式 -->
                <template v-slot:chip="{ props, item }">
                  <v-chip
                    elevation="0"
                    v-bind="props"
                    :prepend-icon="
                      item.raw.value === 1 ? 'mdi-map-marker-account' : 'mdi-block-helper'
                    "
                    size="small"
                    variant="elevated"
                    :color="item.raw.value === 1 ? 'teal-lighten-1' : 'brown-lighten-2'"
                  >
                    {{ item.raw.value === 1 ? '正常' : '下线' }}
                  </v-chip>
                </template>
                <!-- select下拉框中的tag样式 -->
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props">
                    <v-chip
                      elevation="0"
                      :prepend-icon="
                        item.raw.value === 1 ? 'mdi-map-marker-account' : 'mdi-block-helper'
                      "
                      size="small"
                      variant="elevated"
                      :color="item.raw.value === 1 ? 'teal-lighten-1' : 'brown-lighten-2'"
                    >
                      {{ item.raw.value === 1 ? '正常' : '下线' }}
                    </v-chip>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>

            <v-col cols="3" align-self="center" class="pl-8">
              <v-btn
                prepend-icon="mdi-magnify"
                color="deep-purple-accent-4"
                :loading="loading"
                @click="getUserList"
                >搜索</v-btn
              >
              <v-btn prepend-icon="mdi-refresh" class="ml-5" @click="resetForm">重置</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>

      <!-- 用户列表 -->
      <el-table
        v-loading="loading"
        :data="userList"
        tooltip-effect="dark"
        class="article-table"
        :header-cell-style="{ background: '#eef1f6', color: '#606266', fontWeight: 'bold' }"
        stripe
        highlight-current-row
        style="width: 100%"
        height="480"
      >
        <el-table-column prop="id" label="用户ID" min-width="200" show-overflow-tooltip>
          <template #default="scope">
            <span @click="copy(scope.row.id)" style="cursor: pointer">{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户账号" min-width="150" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ scope.row.username }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="用户昵称" min-width="150" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ scope.row.nickname }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="用户邮箱" min-width="150" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ scope.row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isActivated" label="用户状态" width="100" show-overflow-tooltip>
          <template #default="scope">
            <v-chip
              elevation="0"
              :prepend-icon="
                scope.row.isActivated === 1 ? 'mdi-map-marker-account' : 'mdi-block-helper'
              "
              size="small"
              variant="elevated"
              :color="scope.row.isActivated === 1 ? 'teal-lighten-1' : 'brown-lighten-2'"
            >
              {{ scope.row.isActivated === 1 ? '正常' : '下线' }}
            </v-chip>
          </template>
        </el-table-column>
        <el-table-column prop="role" label="用户角色" width="130" show-overflow-tooltip>
          <template #default="scope">
            <v-chip
              elevation="0"
              :color="USER_ROLE_ICON_MAP[scope.row.role].chipColor"
              size="small"
              variant="elevated"
              label
            >
              <v-icon
                start
                :color="USER_ROLE_ICON_MAP[scope.row.role].iconColor"
                :icon="USER_ROLE_ICON_MAP[scope.row.role].icon"
              />
              <span class="tag-label">{{ USER_ROLE_ICON_MAP[scope.row.role].desc }}</span>
            </v-chip>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="165" show-overflow-tooltip>
          <template #default="scope">
            <span> {{ formatDate(scope.row.createTime) }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="165" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ formatDate(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="articlesCount" label="文章数" width="80" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ scope.row.articlesCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="100" fixed="right">
          <template #default="scope">
            <div class="flex align-center">
              <v-tooltip text="编辑">
                <template v-slot:activator="{ props }">
                  <v-icon
                    v-auth="USER_ROLE_MAP.ADMIN"
                    v-bind="props"
                    size="small"
                    color="light-blue-darken-2"
                    class="me-2"
                    @click="openChangeUserInfoDialog(scope.row)"
                    icon="mdi-pencil"
                  />
                </template>
              </v-tooltip>

              <v-tooltip :text="scope.row.isActivated === 1 ? '下线' : '上线'">
                <template v-slot:activator="{ props }">
                  <v-icon
                    v-auth="USER_ROLE_MAP.ADMIN"
                    v-bind="props"
                    size="small"
                    :color="scope.row.isActivated === 1 ? 'red-darken-1' : 'green-darken-1'"
                    style="position: relative; top: -1px"
                    @click="openChangeUserStatusDialog(scope.row)"
                    :icon="scope.row.isActivated === 1 ? 'mdi-delete' : 'mdi-upload'"
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
        :total="userTotal"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </v-container>
    <v-dialog v-if="changeUserStatusDialog" v-model="changeUserStatusDialog" width="auto">
      <v-card>
        <v-card-text class="font-weight-bold">
          <tips theme="filled" size="18" fill="#fcd53f" :strokeWidth="2" />
          {{ `确定${curHandelUser?.isActivated ? '下线' : '恢复'}此用户吗？` }}
        </v-card-text>
        <v-card-subtitle> 此操作会影响用户登录和使用 </v-card-subtitle>
        <v-card-actions>
          <div class="flex width-100 justify-end">
            <v-btn size="small" variant="text" class="flex-1-1" @click="cancelChangeUserStatus">取消</v-btn>
            <v-btn class="flex-1-1" size="small" variant="tonal" @click="changeUserStatus"
              >确认</v-btn
            >
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-if="changeUserInfoDialog" v-model="changeUserInfoDialog" width="auto">
      <v-card :width="400">
        <v-card-text class="font-weight-bold">
          <tips theme="filled" size="18" fill="#fcd53f" :strokeWidth="2" />
           更改用户信息 
        </v-card-text>
        <v-card-item>
          <v-form class="py-3">
            <UserRoleSelect
              v-model="(curHandelUser as UserInfo).role"
            ></UserRoleSelect>
          </v-form>
        </v-card-item>

        <v-card-actions>
          <div class="flex width-100 justify-end">
            <v-btn size="small" variant="text" @click="cancelChangeUserInfo">取消</v-btn>
            <v-btn size="small" variant="tonal" @click="changeUserInfo"
              >确认</v-btn
            >
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import './style.scss'
import {
  USER_ROLE_MAP,
  USER_ROLE_MAP_LIST,
  USER_STATUS_LIST,
  USER_ROLE_ICON_MAP
} from '@/constants'
import { ElMessage } from 'element-plus'
import useUserStore from '@/stores/modules/user'
import { formatDate, errorCodeMap, checkAuthLT, checkAuthLE } from '@/utils'
import { type UserInfo } from '../Admin-Articles/ArticlesList.vue'
import useClipboard from 'vue-clipboard3'
import { storeToRefs } from 'pinia'
import { Tips } from '@icon-park/vue-next'
import UserRoleSelect from '@/components/UserRoleSelect/UserRoleSelect.vue'

const { toClipboard } = useClipboard()
const userStore = useUserStore()
const { getRole } = storeToRefs(userStore)

const formRef = ref()
/** 搜索用户的表单数据 */
const form = ref<{
  search: string
  role: string[]
  status: number | null
}>({
  search: '',
  role: [],
  status: null
})
const loading = ref(false)
const pageNo = ref(1)
const pageSize = ref(10)
const userList = ref<UserInfo[]>([])
const userTotal = ref(0)
/** 更改用户状态弹窗visible */
const changeUserStatusDialog = ref(false)
/** 当前在操作的用户对象 */
const curHandelUser = ref<UserInfo | null>(null)
/** 更改用户信息弹窗visible */
const changeUserInfoDialog = ref(false)

onMounted(async () => {
  await getUserList()
})

/** 复制 */
const copy = (content: any) => {
  toClipboard(content)
  ElMessage.success('复制成功')
}

/** 重置搜索表单 */
const resetForm = () => {
  formRef.value.reset()
}

/** 获取用户列表 */
const getUserList = async () => {
  const params = {
    pageNo: pageNo.value,
    pageSize: pageSize.value,
    search: form.value?.search || '',
    status: form.value?.status,
    role: (form.value?.role || []).join(',')
  }
  const res = await userStore.getAllUserList(params)
  if (res && res.result_code === 'success') {
    userList.value = (res.data as any).list
    userTotal.value = (res.data as any).total
  } else {
    ElMessage(errorCodeMap(res.result_code, res.message))
  }
}

/** pageNo 改变 */
const handleCurrentChange = (val: number) => {
  pageNo.value = val
  getUserList()
}

/** pageSize 改变 */
const handleSizeChange = (val: number) => {
  pageSize.value = val
  getUserList()
}

/** 打开更改用户状态二次确认弹窗 */
const openChangeUserStatusDialog = async (user: UserInfo) => {
  // 操作用户必须是管理员及以上权限，且操作用户权限需大于操作的对象的权限
  if(!checkAuthLE(getRole.value, USER_ROLE_MAP.ADMIN) || !checkAuthLT(getRole.value, user.role)) {
    return ElMessage.warning('无权操作')
  }
  changeUserStatusDialog.value = true
  curHandelUser.value = { ...user }
}

/** 取消更改用户状态 */
const cancelChangeUserStatus = () => {
  changeUserStatusDialog.value = false
  curHandelUser.value = null
}

/**更改用户状态 */
const changeUserStatus = async () => {
  const params = {
    id: curHandelUser.value?.id,
    isActivated: curHandelUser.value?.isActivated ? 0 : 1
  }
  const res = await userStore.changeUserStatus(params)
  if (res && res.result_code === 'success') {
    cancelChangeUserStatus()
    ElMessage.success('修改成功')
    getUserList()
  } else {
    ElMessage(errorCodeMap(res.result_code, res.message || '操作失败'))
  }
}

/** 打开编辑用户信息弹窗 */
const openChangeUserInfoDialog = (user: UserInfo) => {
  // 操作用户必须是管理员及以上权限，且操作用户权限需大于操作的对象的权限
  if (!checkAuthLE(getRole.value, USER_ROLE_MAP.ADMIN) || !checkAuthLT(getRole.value, user.role)) {
    return ElMessage.warning('无权操作')
  }
  changeUserInfoDialog.value = true
  curHandelUser.value = { ...user }
}

/** 取消更改用户信息 */
const cancelChangeUserInfo = () => {
  changeUserInfoDialog.value = false
  curHandelUser.value = null
}

/** 更改用户信息 */
const changeUserInfo = async () => {
  const params = { ...curHandelUser.value }
  const res = await userStore.changeUserInfo(params)
  if (res && res.result_code === 'success') {
    cancelChangeUserInfo()
    ElMessage.success('修改成功')
    getUserList()
  } else {
    ElMessage(errorCodeMap(res.result_code, res.message || '操作失败'))
  }
}
</script>
