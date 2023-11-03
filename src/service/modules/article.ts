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
}

export default new articleService()
