<template>
  <canvas id="canvas" ref="canvas"></canvas>
</template>

<script lang="ts" setup>
import { type PropType, computed, onMounted, ref } from 'vue'

const props = defineProps({
  width: {
    type: Number as PropType<number>, // 使用类型约束
    required: true, // 表示 message 是必需的
    default: 200 // 默认值
  },
  height: {
    type: Number as PropType<number>, // 使用类型约束
    required: true, // 表示 message 是必需的
    default: 200 // 默认值
  }
})
// 定义星星的颜色
const STAR_COLOR = '#fff'
// 定义星星的大小
const STAR_SIZE = 3
// 定义星星的最小缩放比例
const STAR_MIN_SCALE = 0.2
// 定义溢出阈值
const OVERFLOW_THRESHOLD = 40
// 定义星星的数量
let STAR_COUNT = 0
// const STAR_COUNT = (window.innerWidth + window.innerHeight) / 8
// 获取canvas元素
const canvas = ref()
// 获取canvas的绘图上下文
const context = computed(() => canvas.value.getContext('2d'))
// 定义缩放比例
const scale = ref(1) // device pixel ratio
// 定义宽度和高度
const width = computed(() => props.width)
const height = computed(() => props.height)
// 定义星星数组
const stars = ref<any[]>([])
// 定义鼠标指针的位置
const pointerX = ref<number | null>(null)
const pointerY = ref<number | null>(null)
// 定义速度对象
const velocity = ref({ x: 0, y: 0, tx: 0, ty: 0, z: 0.0009 })
// 定义触摸输入标志
const touchInput = ref(false)

onMounted(() => {
  STAR_COUNT = (width.value + height.value) / 6
  // 生成星星
  generate()
  // 调整大小
  // resize()
  // 运行动画
  step()
  // // 当窗口大小改变时，重新调整大小
  // window.onresize = resize
  // 当鼠标在canvas上移动时，更新鼠标指针位置
  canvas.value.onmousemove = onMouseMove
  // 当触摸屏在canvas上移动时，更新鼠标指针位置
  canvas.value.ontouchmove = onTouchMove
  // 当触摸屏离开canvas时，更新鼠标指针位置
  canvas.value.ontouchend = onMouseLeave
  // 当鼠标离开文档时，更新鼠标指针位置
  // document.onmouseleave = onMouseLeave
})

// 生成星星
const generate = () => {
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.value.push({
      x: 0,
      y: 0,
      z: STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE)
    })
  }
}
// 将星星放置到随机位置
const placeStar = (star) => {
  star.x = Math.random() * width.value
  star.y = Math.random() * height.value
}
// 回收星星并重新放置到新的位置
const recycleStar = (star) => {
  // 初始化方向为 'z'
  let direction = 'z'
  // 获取速度的绝对值
  let vx = Math.abs(velocity.value.x)
  let vy = Math.abs(velocity.value.y)
  // 如果速度的绝对值大于1，则根据速度的大小随机确定方向
  if (vx > 1 || vy > 1) {
    let axis: any = null
    // 如果水平速度大于垂直速度，则根据水平速度的比例随机确定水平或垂直方向
    if (vx > vy) {
      axis = Math.random() < vx / (vx + vy) ? 'h' : 'v'
    } else {
      axis = Math.random() < vy / (vx + vy) ? 'v' : 'h'
    }
    // 根据方向确定具体的移动方向
    if (axis === 'h') {
      direction = velocity.value.x > 0 ? 'l' : 'r'
    } else {
      direction = velocity.value.y > 0 ? 't' : 'b'
    }
  }
  // 随机设置星星的缩放比例
  star.z = STAR_MIN_SCALE + Math.random() * (1 - STAR_MIN_SCALE)
  // 根据方向设置星星的位置
  if (direction === 'z') {
    // 如果方向为 'z'，则将星星放置在屏幕中心
    star.z = 0.1
    star.x = Math.random() * width.value
    star.y = Math.random() * height.value
  } else if (direction === 'l') {
    // 如果方向为 'l'，则将星星放置在屏幕左侧
    star.x = -OVERFLOW_THRESHOLD
    star.y = height.value * Math.random()
  } else if (direction === 'r') {
    // 如果方向为 'r'，则将星星放置在屏幕右侧
    star.x = width.value + OVERFLOW_THRESHOLD
    star.y = height.value * Math.random()
  } else if (direction === 't') {
    // 如果方向为 't'，则将星星放置在屏幕顶部
    star.x = width.value * Math.random()
    star.y = -OVERFLOW_THRESHOLD
  } else if (direction === 'b') {
    // 如果方向为 'b'，则将星星放置在屏幕底部
    star.x = width.value * Math.random()
    star.y = height.value + OVERFLOW_THRESHOLD
  }
}
// 调整大小
const resize = () => {
  // 获取设备像素比例
  scale.value = window.devicePixelRatio || 1
  // 设置画布的宽度和高度
  // width.value = window.innerWidth * scale.value
  // height.value = window.innerHeight * scale.value
  // canvas.value.width = width
  // canvas.value.height = height
  canvas.value.width = width.value * scale.value
  canvas.value.height = height.value * scale.value
  // 将所有星星重新放置到屏幕上
  stars.value.forEach(placeStar)
}
// 动画的每一帧
const step = () => {
  // 清空画布
  context.value.clearRect(0, 0, width.value, height.value)
  // 更新星星的位置和速度
  update()
  // 绘制星星
  render()
  // 请求下一帧动画
  requestAnimationFrame(step)
}
// 更新星星的位置和速度
const update = () => {
  // 缓动速度
  velocity.value.tx *= 0.96
  velocity.value.ty *= 0.96
  // 更新速度
  velocity.value.x += (velocity.value.tx - velocity.value.x) * 0.8
  velocity.value.y += (velocity.value.ty - velocity.value.y) * 0.8
  // 遍历所有星星
  stars.value.forEach((star) => {
    // 根据速度和缩放比例更新星星的位置
    star.x += velocity.value.x * star.z
    star.y += velocity.value.y * star.z
    // 根据速度和缩放比例更新星星的位置（使星星围绕屏幕中心旋转）
    star.x += (star.x - width.value / 2) * velocity.value.z * star.z
    star.y += (star.y - height.value / 2) * velocity.value.z * star.z
    // 更新星星的缩放比例
    star.z += velocity.value.z
    // 如果星星超出屏幕范围，则重新放置到屏幕上
    if (
      star.x < -OVERFLOW_THRESHOLD ||
      star.x > width.value + OVERFLOW_THRESHOLD ||
      star.y < -OVERFLOW_THRESHOLD ||
      star.y > height.value + OVERFLOW_THRESHOLD
    ) {
      recycleStar(star)
    }
  })
}
// 绘制星星
const render = () => {
  // 遍历所有星星
  stars.value.forEach((star) => {
    // 设置绘制星星的样式
    context.value.beginPath()
    context.value.lineCap = 'round'
    context.value.lineWidth = STAR_SIZE * star.z * scale.value
    context.value.globalAlpha = 0.5 + 0.5 * Math.random()
    context.value.strokeStyle = STAR_COLOR
    // 绘制星星的路径
    context.value.beginPath()
    context.value.moveTo(star.x, star.y)
    // 计算星星的尾巴坐标
    let tailX = velocity.value.x * 2
    let tailY = velocity.value.y * 2
    // 如果尾巴坐标的绝对值小于0.1，则设置为0.5
    if (Math.abs(tailX) < 0.1) tailX = 0.5
    if (Math.abs(tailY) < 0.1) tailY = 0.5
    // 绘制星星的尾巴
    context.value.lineTo(star.x + tailX, star.y + tailY)
    context.value.stroke()
  })
}
// 移动鼠标指针
const movePointer = (x: number, y: number) => {
  // 如果之前有记录鼠标指针的位置，则计算鼠标指针的移动距离，并更新速度
  if (typeof pointerX.value === 'number' && typeof pointerY.value === 'number') {
    let ox = x - pointerX.value
    let oy = y - pointerY.value
    velocity.value.tx = velocity.value.tx + (ox / 8) * scale.value * (touchInput.value ? 1 : -1)
    velocity.value.ty = velocity.value.ty + (oy / 8) * scale.value * (touchInput.value ? 1 : -1)
  }
  // 更新鼠标指针的位置
  pointerX.value = x
  pointerY.value = y
}
// 当鼠标在canvas上移动时的事件处理函数
const onMouseMove = (event) => {
  touchInput.value = false
  movePointer(event.clientX, event.clientY)
}
// 当触摸屏在canvas上移动时的事件处理函数
const onTouchMove = (event) => {
  touchInput.value = true
  movePointer(event.touches[0].clientX, event.touches[0].clientY)
  event.preventDefault()
}
// 当鼠标离开canvas时的事件处理函数
const onMouseLeave = () => {
  pointerX.value = null
  pointerY.value = null
}
</script>

<style lang="scss" scoped>
#canvas {
  width: 100%;
  height: 100%;
}
</style>
