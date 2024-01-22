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
        <v-btn class="sub-menu-btn"
          >设置字段信息
          <v-dialog v-model="dimSettingVisable" persistent width="400" activator="parent">
            <v-card>
              <v-card-title class="font-18">设置字段信息</v-card-title>
              <!-- <v-card-text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </v-card-text> -->

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text="取消" @click="dimSettingVisable = false"></v-btn>
                <v-btn
                  color="var(--primary-selected-color)"
                  text="确定"
                  variant="tonal"
                  @click="dimSettingVisable = false"
                ></v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-btn>
        <v-btn class="sub-menu-btn"
          >有子菜单
          <v-icon class="expand-icon" icon="mdi-chevron-right"></v-icon>
          <v-menu activator="parent" location="end" open-on-hover :open-delay="0">
            <v-list class="chip-menu flex flex-column">
              <v-btn class="sub-menu-btn">二级菜单1</v-btn>
              <v-btn class="sub-menu-btn">二级菜单2 </v-btn>
            </v-list>
          </v-menu>
        </v-btn>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { type AxisDimType } from '../types'
import { type DimType } from '../../../constants/chartConfig'

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

/** 删除维度 */
const deleteDim = () => {
  console.log(props.index)
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
  }
}
</style>
