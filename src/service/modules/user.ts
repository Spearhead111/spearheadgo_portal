import MyRequest from '../request/index'

const baseURL = '/api/v1'

class userService {
  /* 注册账号 */
  public register<T>(params: any) {
    const url = baseURL + '/user/register'
    return MyRequest.post<T>(url, params)
  }

  /* 登录 */
  public login<T>(params: any) {
    const url = baseURL + '/auth/login'
    return MyRequest.post<T>(url, params)
  }

  /** 验证用户信息是否有变更 */
  public verify<T>() {
    const url = baseURL + '/auth/verify'
    return MyRequest.get<T>(url)
  }
}

export default new userService()
