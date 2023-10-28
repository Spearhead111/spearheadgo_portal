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
}

export default new userService()
