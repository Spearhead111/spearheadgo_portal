import { type Directive, type VNode } from 'vue'

// 配合animate.css使用这个自定义指令
const customDirective: Directive<HTMLElement, string> = {
  beforeMount(el, binding) {
    // 指令被绑定到元素时调用
    const animateClassName = binding.value
    window.addEventListener('scroll', () => {
      // // 滚动距离
      // const scrollTop = document.documentElement.scrollTop
      // 页面窗口高度
      const pageHeight = window.innerHeight
      // 元素距离页面顶部的距离
      const elPositionTop = el.getBoundingClientRect().top
      if (elPositionTop < pageHeight) {
        // 有 animate__animated 类 才能触发animate.css的动画
        el.classList.add('animate__animated', animateClassName)
      }
    })
  },

  updated(el, binding) {
    // 元素更新时调用
    const animateClassName = binding.value
    // ...
  },
  beforeUnmount(el) {
    // 元素被卸载时调用
  }
}

export default customDirective
