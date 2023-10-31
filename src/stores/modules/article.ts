import articleService from '@/service/modules/article'
import { defineStore } from 'pinia'

const useArticleStore = defineStore('article', {
  state: () => ({}),
  actions: {
    /** 获取文章列表 */
    async getArticleList(params: any) {
      const res = await articleService.getArticleList(params)
      return res
    },

    /** 获取文章详情 */
    async getArticleDetail(id: number) {
      const params = { articleId: id }
      const res = await articleService.getArticleDetail(params)
      return res
    },

    /** 删除文章 */
    async deleteArticle(id: number) {
      const params = { articleId: id }
      const res = await articleService.deleteArticle(params)
      return res
    },

    /** 获取上传权限 */
    async uploadArticleImgPermission(params: any) {
      const res = await articleService.uploadArticleImgPermission(params)
      return res
    }
  }
})

export default useArticleStore
