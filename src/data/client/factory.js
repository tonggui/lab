import Axios from 'axios'
import { isPlainObject, mergeWith, isArray, merge } from 'lodash'
import { parse } from 'qs'
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

// const defaultSuccessHandler = data => ({ ...data.data, serverTime: data.serverTime })
const defaultSuccessHandler = data => {
  if (isPlainObject(data.data)) {
    return { ...data.data, serverTime: data.serverTime }
  } else {
    return data.data
  }
}

// 请求函数
const request = (axiosInstance) => async (method = 'post', url = '', params = {}, options) => {
  try {
    const searchParams = parse(window.location.search, {
      ignoreQueryPrefix: true
    })
    if (searchParams.wmPoiId && isArray(searchParams.wmPoiId)) {
      searchParams.wmPoiId = searchParams.wmPoiId[0]
      console.error(`wmPoiId重复${window.location.search}`)
      window.onerror && window.onerror(`wmPoiId重复${window.location.search}`, 'unknow', 0, 0)
    }
    const defaultPoiId = parseInt(searchParams.wmPoiId) || searchParams.wmPoiId
    let query = params
    if ('wmPoiId' in params) {
      query.wmPoiId = query.wmPoiId || defaultPoiId
    } else if ('wm_poi_id' in params) {
      query.wm_poi_id = query.wm_poi_id || defaultPoiId
    } else if ('scPoiId' in params) {
      query.scPoiId = query.scPoiId || defaultPoiId
    } else if ('poiId' in params) {
      query.poiId = query.poiId || defaultPoiId
    }

    options = Object.assign({ successHandler: defaultSuccessHandler }, options)
    const { successHandler, ...restOptions } = options
    const args = combineArguments(method, query, restOptions)
    const requestMethod = method.toUpperCase() === 'UPLOAD' ? 'post' : method
    const response = await axiosInstance[requestMethod](url, ...args)
    // ajax 没有返回值
    if (!response.data) {
      throw Error(response.data)
    }
    // ajax 返回的 data 不是个对象
    if (!isPlainObject(response.data)) {
      throw Error(response.data)
    }
    const { data, headers: { Date, date } } = response
    console.log(response, date, Date)
    const { code, message } = data
    if (code === 0) {
      console.log(data, { ...data, serverTime: (date || Date) })
      return successHandler({ ...data, serverTime: date || Date })
    }
    if (code !== undefined) {
      throw createError({ ...data, code, message, url })
    } else {
      throw data
    }
  } catch (err) {
    console.error(`${url} method error:`, err)
    if (err.code === undefined) {
      console.error(`${url} ajaxError:`, err.message || err)
      throw createError({ code: 'unknown', message: '网络错误，请重试！', url })
    }
    throw err
  }
}

const customizer = (objValue, srcValue) => {
  if (isArray(objValue)) {
    return objValue.concat(srcValue)
  }
}

export default ({ baseURL, ...rest }) => {
  const isLocal = process.env.NODE_ENV === 'development'
  let fullBaseURL = isLocal ? `/api${baseURL}` : baseURL
  const config = mergeWith({}, baseConfig, rest, customizer)
  const axiosInstance = Axios.create({ baseURL: fullBaseURL, ...config })
  /* eslint-disable-next-line */
  window.Akita && window.Akita.interceptors.axios.use(axiosInstance)
  const apiInstance = request(axiosInstance)
  const apiClient = Object.create(null);
  ['get', 'post', 'put', 'patch', 'delete', 'head', 'upload'].forEach(method => {
    apiClient[method] = function (...rest) {
      return apiInstance(method, ...rest)
    }
  })
  return apiClient
}
