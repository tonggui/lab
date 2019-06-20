import Client from '../factory'
import { BASE_URL } from '../config'

export default Client({
  baseURL: BASE_URL.PRODUCT,
  transformResponse: [function (response) {
    let { data } = response
    data = {
      ...data,
      message: data.msg
    }
    return data
  }]
})
