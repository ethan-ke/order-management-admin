import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getAccessToken } from '@/utils/auth'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.access_token) {
      config.headers['Authorization'] = 'Bearer ' + getAccessToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    return response.data
  },
  error => {
    console.log(error)
    if (error.response.status === 422) {
      Object.entries(error.response.data.errors).forEach(res => {
        setTimeout(() => {
          Message({
            message: res[1][0] ?? null,
            type: 'error',
            duration: 5 * 1000
          })
        }, 0)
      })
    } else {
      Message({
        message: error.response.data.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
