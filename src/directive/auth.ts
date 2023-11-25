import { type Directive, type VNode } from 'vue'
import useUserStore from '@/stores/modules/user'
import { storeToRefs } from 'pinia'
import { ROLE_AUTH_MAP, USER_ROLE_MAP } from '@/constants'

// 判断权限，用户不可见没有对应权限的模块
export const authDirective: Directive<HTMLElement, string> = {
  beforeMount(el, binding) {
    const { userInfo, getRole } = storeToRefs(useUserStore())
    const needAuthLevel = ROLE_AUTH_MAP[binding.value]
    if (needAuthLevel && ROLE_AUTH_MAP[getRole.value || USER_ROLE_MAP.GUEST] < needAuthLevel) {
      el.style.display = 'none'
    } else {
      el.style.display = 'block'
    }
  },

  updated(el, binding) {},
  beforeUnmount(el) {
    // 元素被卸载时调用
  }
}
// export const authDirective: Directive<HTMLElement, string> = (el, binding) => {
//   const { userInfo } = storeToRefs(useUserStore())

//   const needAuthLevel = ROLE_AUTH_MAP[binding.value]
//   if (needAuthLevel && ROLE_AUTH_MAP[userInfo.value?.role || 'guest'] < needAuthLevel) {
//     el.style.display = 'none'
//   } else {
//     el.style.display = 'block'
//   }
// }
