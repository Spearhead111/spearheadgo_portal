import articleService from '@/service/modules/article'
import { defineStore } from 'pinia'

const useArticleStore = defineStore('article', {
  state: () => ({}),
  actions: {
    /** 获取文章列表，页面展示用 */
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

    /** 恢复文章 */
    async recoverArticle(id: number) {
      const params = { articleId: id }
      const res = await articleService.recoverArticle(params)
      return res
    },

    /** 获取上传权限 */
    async uploadArticleImgPermission(params: any) {
      const res = await articleService.uploadArticleImgPermission(params)
      return res
    },

    /** 获取文章标签 */
    async getArticleTagList() {
      const res = await articleService.getArticleTagList()
      return res
    },

    /** 创建新文章 */
    async createArticle(params: any) {
      const res = await articleService.createArticle(params)
      return res
    },

    /** 更新新文章 */
    async updateArticle(params: any) {
      const res = await articleService.updateArticle(params)
      return res
    },

    /** 获取文章列表，管理页面用 */
    async getAdminArticleList(params: any) {
      const res = await articleService.getAdminArticleList(params)
      return res
    },

    /** 新建文章标签 */
    async createArticleTag(params: any) {
      const res = await articleService.createArticleTag(params)
      return res
    },

    /** 更新文章标签 */
    async updateArticleTag(params: any) {
      const res = await articleService.updateArticleTag(params)
      return res
    },

    /** 删除文章标签 */
    async deleteArticleTag(params: any) {
      const res = await articleService.deleteArticleTag(params)
      return res
    },

    /** 获取最新发布的文章 */
    async getLatestArticle(params: any) {
      const res = await articleService.getLatestArticle(params)
      return res
    },

    /** 获取文章评论 */
    async getArticleComment(params: any) {
      const res = await articleService.getArticleComment(params)
      return res
    },

    /** 发表文章评论 */
    async sendArticleComment(params: any) {
      const res = await articleService.sendArticleComment(params)
      return res
    },

    /** 发表文章评论的回复 */
    async sendArticleCommentReply(params: any) {
      const res = await articleService.sendArticleCommentReply(params)
      return res
    }
  }
})

export default useArticleStore
