import userService from '@/service/modules/user'
import { defineStore } from 'pinia'
import jwt_decode from 'jwt-decode'
import { USER_ROLE_MAP } from '@/constants'
import type { ResultData } from '@/service/request'

interface LoginResponseData {
  token: string
}

const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('accessToken') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}'),
    selectedSubMenu: sessionStorage.getItem('selectedSubMenu') || ''
  }),

  getters: {
    getRole: (state): string => state.userInfo?.role || USER_ROLE_MAP.GUEST,
    getUserId: (state) => (state.userInfo?.id as string) || ''
  },

  actions: {
    /** 校验token信息是否变更 */
    async verify() {
      if (this.token) {
        const res = await userService.verify()
      }
    },

    // 登录
    async login(params: any) {
      return await userService.login<LoginResponseData>(params)
    },

    saveUserInfo(token: string) {
      this.token = token
      this.userInfo = jwt_decode(this.token)
      localStorage.setItem('accessToken', token)
      localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
    },

    // 注册
    async register(params: any) {
      return await userService.register(params)
    },

    /** 获取用户 */
    async getAllUserList(params: any) {
      return await userService.getAllUserList(params)
    },

    // 注销
    logOut() {
      this.token = ''
      this.userInfo = {}
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userInfo')
    },

    /** 更改用户状态 */
    async changeUserStatus(params: any) {
      return await userService.changeUserStatus(params)
    },

    /** 更改用户信息 */
    async changeUserInfo(params: any) {
      return await userService.changeUserInfo(params)
    }
  }
})
export default useUserStore
