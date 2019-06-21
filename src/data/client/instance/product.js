import Client from '../factory'
import { BASE_URL } from '../config'

export default Client({
  baseURL: BASE_URL.PRODUCT,
  transformResponse: [(data) => {
    const { msg, ...rest } = data
    const newData = {
      ...rest,
      message: data.msg
    }
    return newData
  }]
})
