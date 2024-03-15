<template>
  <div :class="[{ 'show-location-icon': isAboveSelf }]">
    <v-chip
      ref="dimChipRef"
      class="variable-chip"
      label
      :color="color"
      size="small"
      draggable
      @dragstart="initDragDim"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      @dragend="handleDragEnd"
    >
      <v-icon
        class="mr-1 pre-icon"
        size="14"
        color="#0097A7"
        :icon="`mdi-roman-numeral-${(dim.fileIndex ?? 0) + 1}`"
      ></v-icon>
      <span class="variable-name" :title="dim.variableName">{{ dim.variableName }}</span>
      <v-icon class="close-icon" color="#000" icon="mdi-close" @click.stop="deleteDim"></v-icon>
    </v-chip>
    <!-- 下拉菜单 -->
    <v-menu :activator="dimChipRef">
      <v-list class="chip-menu flex flex-column">
        <v-btn class="sub-menu-btn" v-if="showDimSettingBtn()"
          >设置字段信息
          <v-dialog v-model="dimSettingVisable" persistent width="400" activator="parent">
            <v-card>
              <v-card-title class="font-18 font-bold">设置字段信息</v-card-title>
              <v-card-text>
                <v-form ref="dimInfoFormRef">
                  <v-row>
                    <v-col cols="12">
                      <span>字段显示名称</span>
                      <v-text-field
                        counter="20"
                        density="compact"
                        hide-details="auto"
                        variant="outlined"
                        v-model="dimInfoForm.desc"
                        :rules="rules.desc"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <span>字段类型</span>
                      <v-select
                        density="compact"
                        hide-details
                        variant="outlined"
                        v-model="dimInfoForm.dimType"
                        :items="['Number', 'String', 'Date']"
                      ></v-select>
                    </v-col>
                    <v-col cols="6">
                      <span>单位</span>
                      <v-text-field
                        density="compact"
                        hide-details
                        variant="outlined"
                        v-model="dimInfoForm.unit"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="4" offset="1">
                      <span>保留小数位</span>
                      <v-text-field
                        density="compact"
                        type="number"
                        hide-details
                        variant="outlined"
                        v-model="dimInfoForm.decimalDigits"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text="取消" @click="cancelChangeDimInfo"></v-btn>
                <v-btn
                  color="var(--primary-selected-color)"
                  text="确定"
                  variant="tonal"
                  @click="changeDimInfo"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-btn>
        <v-btn class="sub-menu-btn" v-if="showDimColorBtn()"
          >设置颜色
          <div class="color-show" :style="{ backgroundColor: dim.color }"></div>
          <v-dialog
            v-model="dimColorPickerShow"
            activator="parent"
            max-width="300"
            style="overflow: hidden"
          >
            <v-card>
              <v-color-picker
                elevation="0"
                v-model="originColor"
                show-swatches
                :swatches="SWATCHES"
              ></v-color-picker>
              <div style="text-align: end" class="mb-1">
                <v-btn variant="text" class="mr-5" @click="cancelChangeColor">取消</v-btn>
                <v-btn variant="text" class="mr-5" color="purple-darken-4" @click="changeColor"
                  >确定</v-btn
                >
              </div>
            </v-card>
          </v-dialog>
        </v-btn>
        <!-- <v-btn class="sub-menu-btn"
          >有子菜单
          <v-icon class="expand-icon" icon="mdi-chevron-right"></v-icon>
          <v-menu activator="parent" location="end" open-on-hover :open-delay="0">
            <v-list class="chip-menu flex flex-column">
              <v-btn class="sub-menu-btn">二级菜单1</v-btn>
              <v-btn class="sub-menu-btn">二级菜单2 </v-btn>
            </v-list>
          </v-menu>
        </v-btn> -->
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { type AxisDimType } from '../types'
import { type DimType, CHART_TYPES } from '../../../constants/chartConfig'
import { ElMessage } from 'element-plus'
import { SWATCHES } from '@/constants'

const props = withDefaults(
  defineProps<{
    /** 字段属于的维度类型 */
    type: DimType
    /** 维度字段信息 */
    dim: AxisDimType
    /** chip标签的颜色 */
    color?: string
    /** 字段在对应维度内的索引 */
    index?: number
    /** 其他维度字段desc列表 */
    otherDimDescList?: string[]
    /** 添加dim回调 */
    addDim?: () => void
    /** 删除dim回调 */
    deleteDim?: () => void
    /** 初始化拖拽字段信息 */
    initDragDimInfo?: (e: DragEvent, dragDimInfo: any) => void
  }>(),
  { color: '#00B8D4' }
)

const emit = defineEmits(['deleteDim', 'addDim', 'initDragDimInfo'])

/** 拖拽字段是否在自己上方 */
const isAboveSelf = ref(false)
const dimChipRef = ref()
/** 字段设置信息的弹窗是否显示 */
const dimSettingVisable = ref(false)
const dimInfoFormRef = ref()
const dimInfoForm = ref<AxisDimType>({ ...props.dim })
/** 字段颜色选择器是否显示 */
const dimColorPickerShow = ref(false)
/** 字段颜色选择器的原始颜色 */
const originColor = ref('')

const rules = ref<any>({
  desc: [
    (v: string) => !!v || '请输字段显示名称',
    (v: string) => (v && v.length <= 20) || '字段显示名称长度不能超过20个字符',
    (v: string) =>
      (v && !props.otherDimDescList?.some((desc) => desc === v)) || '字段显示名称与已有字段重复'
  ]
})

/** 删除维度 */
const deleteDim = () => {
  emit('deleteDim', props.index)
}

/** 初始化拖拽的维度字段 */
const initDragDim = (event: DragEvent) => {
  // event.preventDefault()
  emit('initDragDimInfo', event, { ...props.dim, type: props.type, index: props.index })
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()
  isAboveSelf.value = true
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()
  isAboveSelf.value = false
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  event.stopPropagation()
  isAboveSelf.value = false
  emit('addDim', event, props.index)
}

const handleDragEnd = (event: DragEvent) => {
  document.querySelectorAll('.dim-content')?.forEach((ele) => {
    ele.setAttribute('style', 'background-color: transparent;')
  })
}

const cancelChangeDimInfo = () => {
  dimSettingVisable.value = false
  dimInfoForm.value = { ...props.dim }
}

const changeDimInfo = async () => {
  const { valid } = await dimInfoFormRef.value.validate()
  if (!valid) {
    return ElMessage.error('请完善填选项')
  }
  dimSettingVisable.value = false
  props.dim.desc = dimInfoForm.value.desc
  props.dim.dimType = dimInfoForm.value.dimType
  props.dim.unit = dimInfoForm.value.unit
  props.dim.decimalDigits = dimInfoForm.value.decimalDigits
}

/** 取消修改颜色 */
const cancelChangeColor = () => {
  dimColorPickerShow.value = false
  originColor.value = props.dim.color
}

const changeColor = () => {
  dimColorPickerShow.value = false
  props.dim.color = originColor.value
}

/** 是否显示字段设置按钮 */
const showDimSettingBtn = () => {
  return ![CHART_TYPES.SANKEY].includes(props.dim.chartType)
}

/** 是否显示字段颜色按钮 */
const showDimColorBtn = () => {
  return ![CHART_TYPES.SANKEY].includes(props.dim.chartType)
}
</script>

<style lang="scss" scoped>
.show-location-icon {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    left: -2px;
    display: block;
    height: 28px;
    width: 2px;
    background-color: var(--primary-selected-color);
  }
}

.chip-menu {
  width: fit-content;
  .sub-menu-btn {
    position: relative;
    font-size: 12px;
    height: 32px;
    padding: 0 15px;
    box-shadow: none;
    border-radius: 0;
    .expand-icon {
      position: absolute;
      right: 0px;
    }

    .color-show {
      margin-left: 5px;
      width: 20px;
      height: 15px;
      border-radius: 4px;
    }
  }
}
</style>
