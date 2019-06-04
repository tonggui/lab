import Axios from 'axios'
import { isPlainObject } from 'lodash'
import { stringify } from 'qs'
import apiLogInterceptor from './logInterceptor'

const isLocal = process.env.NODE_ENV === 'development'
const baseURL = isLocal ? '/api/reuse/sc/product/' : '/reuse/sc/product/'

const axiosInstance = Axios.create({
  baseURL,
  timeout: 20000,
  withCredentials: true,
  validateStatus: status => status >= 200 && status <= 299,
  transformResponse: [(response) => response.data || {}]
})

axiosInstance.interceptors.response.use(
  apiLogInterceptor,
  (error) => {
    if (error.response) apiLogInterceptor(error.response)
    return Promise.reject(error)
  }
)

// TODO 对齐content-type
const transform = (params, type) => {
  type = type || 'urlencoded'
  if (type === 'urlencoded') {
    return stringify(params)
  }
  if (type === 'form') {
    return Object.entries(params).reduce((form, [key, value]) => {
      form.append(key, value)
      return form
    }, new FormData())
  }
  return params
}

const combineArguments = (method, params = {}, options = {}) => {
  // 纯数据节点需要做空值过滤，避免后端接口无法处理的问题
  if (isPlainObject(params)) {
    params = Object.entries(params)
      .filter(arr => arr[1] !== undefined && arr[1] !== null)
      .reduce((map, arr) => {
        map[arr[0]] = arr[1]
        return map
      }, {})
  }
  if (['GET', 'HEAD', 'DELETE'].indexOf(method.toUpperCase()) > -1) {
    return [{ params, ...options }]
  } else {
    const { type, ...rest } = options
    return [transform(params, type), rest]
  }
}

// 请求函数
const request = async (method = 'post', url = '', params = {}, options = {}) => {
  try {
    const args = combineArguments(method, { ...params }, options)
    const data = await axiosInstance[method](url, ...args)
    const { code, msg } = data
    if (code === 0) {
      return data.data
    }
    if (code !== undefined) {
      throw Object({ code, message: msg })
    }
    return data
  } catch (err) {
    if (err.code === undefined) {
      console.error('ajaxError:', err.message || err)
      throw Object({ code: 'unknown', message: '网络错误，请重试！' })
    }
    throw err
  }
}

const apiClient = Object.create(null);

['get', 'post', 'put', 'patch', 'delete', 'head'].forEach(method => {
  apiClient[method] = function (...rest) {
    return request(method, ...rest)
  }
})

export default apiClient
