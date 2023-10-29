import axios, {
  type AxiosInstance,
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse
} from 'axios'
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'

import RequestConfig from './config'
import useUserStore from '@/stores/modules/user'
import { decodeToken } from '@/utils'

// request interface，包含 data
export class ResultData<T = any> {
  result_code?: string
  message?: string
  data?: T
  // valid() {
  //   return this.result_code === 'success'
  // }
}

// axios 基础配置
const config = {
  // 默认地址，可以使用 process Node内置的，项目根目录下新建 .env.development
  baseURL: RequestConfig.BASE_URL,
  timeout: RequestConfig.TIMEOUT // 请求超时时间
  // withCredentials: true, // 跨越的时候允许携带凭证
}

class Request {
  service: AxiosInstance
  constructor(config: AxiosRequestConfig) {
    // 实例化 serice
    this.service = axios.create(config)

    /**
     * 请求拦截器
     * request -> { 请求拦截器 } -> server
     */
    this.service.interceptors.request.use(
      (config: any) => {
        const token = useUserStore().token ?? ''
        return {
          ...config,
          headers: {
            Authorization: 'Bearer ' + token,
            'user-id': useUserStore().getUserId
          }
        }
      },
      (error: AxiosError) => {
        // 请求报错
        Promise.reject(error)
      }
    )

    /**
     * 响应拦截器
     * response -> { 响应拦截器 } -> client
     */
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data, config } = response
        if (data?.data?.token) {
          const token = data?.data?.token
          localStorage.setItem('accessToken', token)
          // 解析一下token并存储用户的信息
          decodeToken(token)
        }
        return data
      },
      (error: AxiosError | any) => {
        const { response } = error
        console.log(response)
        if (response) {
          const message = response.data?.message
          this.handleCode(response.status, message)
        }
        if (!window.navigator.onLine) {
          ElMessage.error('网络连接失败，请检查网络')
          location.href = '/404'
        }
      }
    )
  }

  /* 验证失败提示提示(401) */
  public reLogin = (message: string = ''): void => {
    // ElMessageBox.alert(message, '系统提示', {
    //   confirmButtonText: '重新登陆',
    //   type: 'warning'
    // })
    //   .then(() => {
    //     location.href = '/login'
    //   })
    //   .finally(() => {
    //     useUserStore().logOut()
    //   })
    if (!useUserStore().token) {
      // 如果之前没登陆
      ElMessage.warning(message + '请先登录')
    } else {
      ElMessage.error('用户信息有所变更，请重新登录')
      useUserStore().logOut()
    }
  }

  public handleCode = (code: number, message?: string): void => {
    switch (code) {
      case 401:
        this.reLogin(message)
        break
      case 500:
        ElMessage.error('请求异常，请联系管理员')
        break
      default:
        ElMessage.error('请求失败')
        break
    }
  }
  // 通用方法封装
  get<T>(url: string, params?: object, config?: object): Promise<ResultData<T>> {
    return this.service.get(url, { params, ...config })
  }

  post<T>(url: string, params?: object, config?: object): Promise<ResultData<T>> {
    return this.service.post(url, params, config)
  }
  put<T>(url: string, params?: object): Promise<ResultData<T>> {
    return this.service.put(url, params)
  }
  delete<T>(url: string, params?: object): Promise<ResultData<T>> {
    return this.service.delete(url, { params })
  }
}

export default new Request(config)
