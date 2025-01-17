import axios from 'axios'
import { MessageBox } from 'element-ui'
import { message } from '../components/ResetMessage/index'
import store from '@/store'
import router from '@/router'
import { getToken } from '@/utils/auth'
import { getTenant } from '@/utils/tenant'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.BASE_API,
  // 超时
  timeout: 8000
})
// request拦截器
service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    if (getTenant()) {
      config.headers['TENANT_ID'] = getTenant() // 租户ID
    }
    return config
  },
  error => {
    console.log(error)
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(

  response => {
    const code = response.data.code
    if (code === 401) {
      MessageBox.confirm(
        '登录状态已过期，请重新登录',
        '系统提示',
        {
          confirmButtonText: '重新登录',
          type: 'warning'
        }
      ).then(() => {
        store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    } else if (code !== 200) {
      if (response.data.type === 'application/octet-stream') {
        return response
      } else {
        message.error(
          response.data.msg
        )
        return Promise.reject('error')
      }
    } else {
      return response
    }
  },
  error => {
    let code = 0
    try {
      code = error.response.status
    } catch (e) {
      if (error.toString().indexOf('Error: timeout') !== -1) {
        message.error('网络请求超时')
        return Promise.reject(error)
      }
      if (error.toString().indexOf('Error: Network Error') !== -1) {
        message.error('网络请求错误')
        return Promise.reject(error)
      }
    }
    if (code === 504) {
      message.error('服务器异常')
      return Promise.reject(error)
    }
    if (code === 401) {
      MessageBox.confirm(
        '登录状态已过期，是否重新登录?',
        '系统提示',
        {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    } else if (code === 403) {
      router.push({ path: '/401' })
    } else {
      const errorMsg = error.response.data.message
      if (errorMsg !== undefined) {
        Notification.error({
          title: errorMsg,
          duration: 1000
        })
      }
    }
    return Promise.reject(error)
  }
)

export default service
