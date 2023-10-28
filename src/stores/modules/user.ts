import userService from '@/service/modules/user'
import { defineStore } from 'pinia'
import jwt_decode from 'jwt-decode'

const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('accessToken') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || '') || ''
  }),
  actions: {
    // 登录
    async login(params: any) {
      try {
        const response: any = await userService.login(params)
        if (response) {
          const data = response
          return data
        }
      } catch (e) {
        return e
      }
    },

    saveUserInfo(token: string) {
      this.token = token
      this.userInfo = jwt_decode(this.token)
      localStorage.setItem('accessToken', token)
      localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
    },

    // 注册
    async register(params: any) {
      try {
        const response: any = await userService.register(params)
        if (response) {
          const data = response
          return data
        }
      } catch (e) {
        return e
      }
    },

    // 注销
    logOut() {
      this.token = ''
      this.userInfo = ''
      localStorage.removeItem('accessToken')
      localStorage.removeItem('userInfo')
    }
  }
})
export default useUserStore
