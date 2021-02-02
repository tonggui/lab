import { stringify } from 'qs'
import Client from '../factory'
import { BASE_URL } from '../config'

export default Client({
  baseURL: BASE_URL.MEDICINE_SAlERUL,
  // headers: {
  //   'Content-Type': 'application/json; charset=UTF-8'
  // },
  transformRequest: [(data, headers) => {
    if (typeof data === 'object') {
      if (!(data instanceof FormData)) {
        console.log(data)
        return stringify(data, { allowDots: true })
      }
    }
    return data
  }],
  transformResponse: [(data) => {
    if (typeof data === 'object') {
      const { msg, ...rest } = data
      const newData = {
        ...rest,
        message: data.msg
      }
      return newData
    }
    return data
  }]
})
