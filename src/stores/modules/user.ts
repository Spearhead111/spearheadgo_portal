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
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}')
  }),

  getters: {
    getRole: (state) => state.userInfo?.role || USER_ROLE_MAP.GUEST,
    getUserId: (state) => state.userInfo?.id || ''
  },

  actions: {
    /** 校验token信息是否变更 */
    async verify() {
      // try {
      //   const response = await userService.verify()
      //   if (response) {
      //     const data = response
      //     return data
      //   }
      // } catch (e) {
      //   return e
      // }
      if (this.token) {
        const res = await userService.verify()
      }
    },

    // 登录
    async login(params: any) {
      // try {
      //   const response = await userService.login(params)
      //   if (response) {
      //     const data = response
      //     return data
      //   }
      // } catch (e) {
      //   return e
      // }
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
      // try {
      // const response = await userService.register(params)
      // if (response) {
      //   const data = response
      //   return data
      // }
      // } catch (e) {
      //   return e
      // }
      return await userService.register(params)
    },

    // 注销
    logOut() {
      this.token = ''
      this.userInfo = {}
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userInfo')
    }
  }
})
export default useUserStore
