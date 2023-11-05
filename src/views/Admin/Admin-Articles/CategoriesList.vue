<template>
  <v-container style="max-width: none" class="categories-list-wrapper">
    <v-row align="start">
      <v-col cols="4">
        <v-text-field
          v-model="search"
          density="compact"
          placeholder="标签名/code"
          prepend-inner-icon="mdi-magnify"
          color="blue-grey-lighten-2"
          variant="underlined"
          hide-details
          hide-no-data
          clearable
          label="标签名/code"
        ></v-text-field>
      </v-col>
      <v-col cols="4" justify-center>
        <v-btn
          prepend-icon="mdi-plus"
          color="deep-purple-accent-4"
          style="position: absolute; top: 22px"
          @click="openEditTagDialog('add')"
        >
          创建新标签
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="mt-5 pa-4 pt-2" variant="tonal" color="brown-lighten-3">
      <v-card-title class="mb-2">
        <div class="flex justify-space-between">
          <span>文章标签列表</span>
          <span>共 {{ tagTotal }} 个，当前查询结果 {{ searchTagList.length }} 个</span>
        </div>
      </v-card-title>
      <div class="tag-list-content">
        <div class="tag-item-content" v-for="tag in searchTagList">
          <v-chip
            :color="tag.color"
            label
            variant="elevated"
            :style="{ animationDelay: `${Math.random()}s` }"
            @click="openEditTagDialog('edit', tag)"
          >
            <v-icon start :color="tag.iconColor" :icon="tag.icon" />
            <span class="tag-label">{{ tag.label }}</span>
          </v-chip>
        </div>
      </div>
    </v-card>
  </v-container>
  <v-dialog v-if="addTagDialog" v-model="addTagDialog" width="auto">
    <v-card width="400">
      <v-card-title> {{ `${opType === 'add' ? '新建' : '编辑'}标签` }} </v-card-title>
      <v-card-text>
        <v-form ref="formRef">
          <span>标签名</span>
          <v-text-field
            v-model="form.label"
            :rules="rules.label"
            density="compact"
            counter="10"
            placeholder="标签名，允许中文"
            clearable
            single-line
            hide-details="auto"
          ></v-text-field>
          <span>标签code</span>
          <v-text-field
            v-model="form.code"
            :rules="rules.code"
            density="compact"
            counter="20"
            placeholder="标签code，允许英文、数字、下划线"
            clearable
            single-line
            hide-details="auto"
          ></v-text-field>
          <span>标签icon</span>
          <v-text-field
            v-model="form.icon"
            :rules="rules.icon"
            density="compact"
            placeholder="标签icon"
            :hint="`目前标签icon只支持Material Design Icons`"
            clearable
            single-line
            hide-details="auto"
          >
            <template v-slot:append-inner>
              <v-tooltip location="bottom">
                <template v-slot:activator="{ props }">
                  <v-icon
                    @click="openIconWeb"
                    v-bind="props"
                    icon="mdi-help-circle-outline"
                  ></v-icon>
                </template>

                目前标签icon只支持Material Design Icons,<br />
                点击此icon跳转到Material Design Icons进行选择
              </v-tooltip>
            </template>
          </v-text-field>
          <v-row>
            <v-col>
              <div class="my-2">
                <span class="mr-7">标签颜色</span>
                <v-btn size="small" :color="form.color" @click="openTagColorPicker"> </v-btn>
                <v-dialog v-model="tagColorPickerShow" max-width="300" style="overflow: hidden">
                  <v-card>
                    <v-color-picker
                      elevation="0"
                      show-swatches
                      :swatches="SWATCHES"
                      v-model="form.color"
                      :rules="rules.color"
                    >
                    </v-color-picker>
                    <div style="text-align: end" class="mb-1">
                      <v-btn variant="text" class="mr-5" @click="cancelTagColor">取消</v-btn>
                      <v-btn
                        variant="text"
                        class="mr-5"
                        color="purple-darken-4"
                        @click="tagColorPickerShow = false"
                        >确定</v-btn
                      >
                    </div>
                  </v-card>
                </v-dialog>
              </div>
              <div class="my-2">
                <span>标签icon颜色</span>
                <v-btn size="small" :color="form.iconColor" @click="openTagIconColorPicker">
                </v-btn>
                <v-dialog v-model="tagIconColorPickerShow" max-width="300" style="overflow: hidden">
                  <v-card>
                    <v-color-picker
                      elevation="0"
                      show-swatches
                      :swatches="SWATCHES"
                      v-model="form.iconColor"
                      :rules="rules.iconColor"
                    ></v-color-picker>
                    <div style="text-align: end" class="mb-1">
                      <v-btn variant="text" class="mr-5" @click="cancelTagIconColor">取消</v-btn>
                      <v-btn
                        variant="text"
                        class="mr-5"
                        color="purple-darken-4"
                        @click="tagIconColorPickerShow = false"
                        >确定</v-btn
                      >
                    </div>
                  </v-card>
                </v-dialog>
              </div>
            </v-col>
            <v-col class="flex flex-column align-center justify-center">
              <span class="mb-2 font-weight-bold">预览效果</span>
              <v-chip :color="form.color" variant="elevated" size="small" label>
                <v-icon start :color="form.iconColor" :icon="form.icon"></v-icon>
                <span class="tag-label">{{ form.label }}</span>
              </v-chip>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="primary" @click="cancel">取消</v-btn>
        <v-btn color="deep-purple-accent-4" @click="addTag">
          {{ opType === 'add' ? '创建' : '保存' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import useArticleStore from '@/stores/modules/article'
import { type Tag } from '@/views/Home/Home.vue'
import { ElMessage } from 'element-plus'
import { SWATCHES } from '@/constants'

const articleStore = useArticleStore()
const tagList = ref<Tag[]>([]) // 文章类型标签
const tagTotal = ref(0) // 标签的个数
const search = ref('') // 标签名/code搜索
const addTagDialog = ref(false) // 新建标签的dialog
const opType = ref('add') // 新建 还是 编辑 标签信息
const formRef = ref()
const form = ref({
  label: 'tag_label',
  code: 'tag_code',
  icon: '',
  color: '#000000',
  iconColor: '#FFFFFF'
})
const tagIconColorPickerShow = ref(false) // 文章标签的icon的colorPicker是否展示
const preTagIconColor = ref('') // 记录打开弹窗更改颜色之前的tagicon颜色
const tagColorPickerShow = ref(false) // 文章标签的colorPicker是否展示
const preTagColor = ref('') // 记录打开弹窗更改颜色之前的tag颜色

const rules = ref<any>({
  label: [
    (v: string) => !!v || '请输入标签名',
    (v: string) => (v && v.length <= 10) || '标签名长度不能超过10个字符'
  ],
  code: [
    (v: string) => !!v || '请输入标签code',
    (v: string) => (v && v.length <= 20) || '标签code长度不能超过20个字符'
  ],
  icon: [(v: string) => !!v || '请输入标签icon'],
  color: [(v: string) => !!v || '请选择标签颜色'],
  iconColor: [(v: string) => !!v || '请选择标签icon颜色']
})

/** 通过标签名/code来模糊搜索(本地) */
const searchTagList = computed(() => {
  const res = search.value
    ? tagList.value.filter(
        (tag) => tag.label.indexOf(search.value) > -1 || tag.code.indexOf(search.value) > -1
      )
    : tagList.value
  return res
})

onMounted(async () => {
  await getArticleTagList()
})

/** 获取文章标签 */
const getArticleTagList = async () => {
  const res = await articleStore.getArticleTagList()
  if (res && res.result_code === 'success') {
    const { list, total } = res.data as { list: Tag[]; total: number }
    tagList.value = list
    tagTotal.value = total
  }
}

/** 新建/编辑标签 */
const openEditTagDialog = (type: string, tag?: Tag) => {
  opType.value = type
  addTagDialog.value = true
  if (type === 'edit') {
    form.value = { ...(tag as Tag) }
  }
}

/** 取消 新建/编辑 */
const cancel = () => {
  addTagDialog.value = false
  formRef.value.reset()
}

/** 新建/编辑 标签 */
const addTag = async () => {
  const { valid } = await formRef.value.validate()
  console.log(valid)
  if (!valid) {
    return ElMessage.error('请完善填选项')
  }
  const params = { ...form.value }
  console.log(params)
  if (opType.value === 'add') {
    const res = await articleStore.createArticleTag(params)
    if (res && res.result_code === 'success') {
      cancel()
      ElMessage.success('新建成功')
      getArticleTagList()
    } else {
    }
  } else {
    const res = await articleStore.updateArticleTag(params)
    if (res && res.result_code === 'success') {
      cancel()
      ElMessage.success('更新成功')
      getArticleTagList()
    } else {
    }
  }
}

/** 打开新页面选择icon */
const openIconWeb = () => {
  window.open('https://pictogrammers.com/library/mdi/', '_blank')
}

/** 打开标签icon颜色选择器 */
const openTagIconColorPicker = () => {
  tagIconColorPickerShow.value = true
  preTagIconColor.value = form.value.iconColor
}

/** 打开标签颜色选择器 */
const openTagColorPicker = () => {
  tagColorPickerShow.value = true
  preTagColor.value = form.value.color
}

/** 取消tagIcon颜色的选择，恢复原来的值 */
const cancelTagIconColor = () => {
  form.value.iconColor = preTagIconColor.value
  tagIconColorPickerShow.value = false
}

/** 取消tag颜色的选择，恢复原来的值 */
const cancelTagColor = () => {
  form.value.color = preTagColor.value
  tagColorPickerShow.value = false
}
</script>
