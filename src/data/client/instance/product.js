import { stringify } from 'qs'
import Client from '../factory'
import { BASE_URL } from '../config'

export default Client({
  baseURL: BASE_URL.PRODUCT,
  transformRequest: [(data, headers) => {
    if (typeof data === 'object') {
      if (!(data instanceof FormData)) {
        return stringify(data)
      }
    }
    return data
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
