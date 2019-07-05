import Client from '../factory'
import { BASE_URL } from '../config'
import { stringify } from 'qs'

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

export default Client({
  baseURL: BASE_URL.PRODUCT,
  transformRequest: [(data, headers) => {
    const type = headers.post['Content-Type'] === 'multipart/form-data' ? 'form' : 'urlencoded'
    return transform(data, type)
  }],
  transformResponse: [(data) => {
    const { msg, ...rest } = data
    const newData = {
      ...rest,
      message: data.msg
    }
    return newData
  }]
})
