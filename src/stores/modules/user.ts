import { defineStore } from 'pinia'

const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('spearheadToken') ?? null,
    avatarBase64: localStorage.getItem('spearheadAvatar') ?? null,
    userInfo: null
  }),
  actions: {}
})
export default useUserStore
