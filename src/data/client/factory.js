import Axios from 'axios'
import { isPlainObject, mergeWith, pick, isArray, merge } from 'lodash'
import { parse } from 'qs'
import apiLogInterceptor from './interceptor/logInterceptor'
import { createError } from './helper/error'

const baseConfig = {
  timeout: 20000,
  withCredentials: true,
  validateStatus: status => status >= 200 && status <= 299,
  transformResponse: [function (data) {
    /* eslint no-param-reassign:0 */
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data)
      } catch (e) { /* Ignore */ }
    }
    return data
  }]
}

Axios.interceptors.response.use(
  apiLogInterceptor,
  (error) => {
    if (error.response) apiLogInterceptor(error.response)
    return Promise.reject(error)
  }
)

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
    let config = options
    if (method.toUpperCase() === 'UPLOAD') {
      config = merge(config, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000
      })
      params = Object.entries(params).reduce((form, [key, value]) => {
        form.append(key, value)
        return form
      }, new FormData())
    }
    return [params, config]
  }
}

const defaultSuccessHandler = data => data.data

// 请求函数
const request = (axiosInstance) => async (method = 'post', url = '', params = {}, options = { successHandler: defaultSuccessHandler }) => {
  try {
    const searchParams = parse(window.location.search, {
      ignoreQueryPrefix: true
    })
    const baseParams = pick(searchParams, 'wmPoiId')
    let query = params
    if ('wmPoiId' in params) {
      query = { ...baseParams, ...query }
    }
    const { successHandler, ...restOptions } = options
    const args = combineArguments(method, query, restOptions)
    const requestMethod = method.toUpperCase() === 'UPLOAD' ? 'post' : method
    const response = await axiosInstance[requestMethod](url, ...args)
    const { data } = response
    const { code, message } = data
    if (code === 0) {
      return successHandler(data)
    }
    if (code !== undefined) {
      throw createError({ code, message })
    } else {
      throw data
    }
  } catch (err) {
    console.error(`${url} method error:`, err)
    if (err.code === undefined) {
      console.error(`${url} ajaxError:`, err.message || err)
      throw createError({ code: 'unknown', message: '网络错误，请重试！' })
    }
    throw err
  }
}

const customizer = (objValue, srcValue) => {
  if (isArray(objValue)) {
    return srcValue.concat(objValue)
  }
}

export default ({ baseURL, ...rest }) => {
  const isLocal = process.env.NODE_ENV === 'development'
  const fullBaseURL = isLocal ? `/api${baseURL}` : baseURL
  const config = mergeWith(rest, baseConfig, customizer)
  const axiosInstance = Axios.create({ baseURL: fullBaseURL, ...config })
  const apiInstance = request(axiosInstance)
  const apiClient = Object.create(null);
  ['get', 'post', 'put', 'patch', 'delete', 'head', 'upload'].forEach(method => {
    apiClient[method] = function (...rest) {
      return apiInstance(method, ...rest)
    }
  })
  return apiClient
}