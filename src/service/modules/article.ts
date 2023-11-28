import MyRequest from '../request/index'

const baseURL = '/api/v1'

class articleService {
  /** 获取文章列表 */
  public getArticleList<T>(params: any) {
    const url = baseURL + '/article/get-article-list'
    return MyRequest.get<T>(url, params)
  }

  /** 获取文章详情 */
  public getArticleDetail<T>(params: any) {
    const url = baseURL + `/article/${params.articleId}/get-article-detail`
    return MyRequest.get<T>(url, params)
  }

  /** 删除文章 */
  public deleteArticle<T>(params: any) {
    const url = baseURL + `/article/${params.articleId}/delete-article`
    return MyRequest.get<T>(url, params)
  }

  /** 删除文章 */
  public recoverArticle<T>(params: any) {
    const url = baseURL + `/article/${params.articleId}/recover-article`
    return MyRequest.get<T>(url, params)
  }

  /** 校验上传权限 */
  public uploadArticleImgPermission<T>(params: any) {
    const url = baseURL + `/auth/cos/article-sign`
    return MyRequest.get<T>(url, params)
  }

  /** 获取文章标签 */
  public getArticleTagList<T>() {
    const url = baseURL + '/article/get-article-categories'
    return MyRequest.get<T>(url)
  }

  /** 发布文章 */
  public createArticle<T>(params: any) {
    const url = baseURL + '/article/create-article'
    return MyRequest.post<T>(url, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  /** 更新文章 */
  public updateArticle<T>(params: any) {
    const url = baseURL + `/article/${params.articleId}/update-article`
    return MyRequest.post<T>(url, params.body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  /** 获取文章列表, 管理页面调用 */
  public getAdminArticleList<T>(params: any) {
    const url = baseURL + '/article/admin-article-list'
    return MyRequest.get<T>(url, params)
  }

  /** 新建文章标签 */
  public createArticleTag<T>(params: any) {
    const url = baseURL + '/article/create-category'
    return MyRequest.post<T>(url, params)
  }

  /** 更新文章标签 */
  public updateArticleTag<T>(params: any) {
    const url = baseURL + '/article/update-category'
    return MyRequest.post<T>(url, params)
  }

  /** 删除文章标签 */
  public deleteArticleTag<T>(params: any) {
    const url = baseURL + `/article/${params.tagCode}/delete-category`
    return MyRequest.post<T>(url, params)
  }

  /** 获取最新发布的文章 */
  public getLatestArticle<T>(params: any) {
    const url = baseURL + `/article/get-latest-articles`
    return MyRequest.get<T>(url, params)
  }

  /** 获取文章评论 */
  public getArticleComment<T>(params: any) {
    const url = baseURL + `/article/${params.articleId}/get-article-comment`
    return MyRequest.get<T>(url, params)
  }

  /** 发表文章评论 */
  public sendArticleComment<T>(params: any) {
    const url = baseURL + `/article/${params.articleId}/comment-article`
    return MyRequest.post<T>(url, params)
  }

  /** 发表文章评论的回复 */
  public sendArticleCommentReply<T>(params: any) {
    const url = baseURL + `/article/${params.articleId}/reply-comment-article`
    return MyRequest.post<T>(url, params)
  }

  /** 删除文章评论 */
  public deleteArticleComment<T>(params: any) {
    const url = baseURL + `/article/${params.articleId}/delete-article-comment`
    return MyRequest.post<T>(url, params)
  }

  /** 点赞文章评论 */
  public likeArticleComment<T>(params: any) {
    const url = baseURL + `/article/digging-comments`
    return MyRequest.post<T>(url, params)
  }

  /** 获取文章关联的用户信息 */
  public getArticleUserInfo<T>(params: any) {
    const url = baseURL + `/article/${params.articleId}/get-article-user-info`
    return MyRequest.get<T>(url, params)
  }

  /** 点赞文章 */
  public likeArticle<T>(params: any) {
    const url = baseURL + `/article/${params.articleId}/digging-article`
    return MyRequest.get<T>(url, params)
  }
}

export default new articleService() as articleService
