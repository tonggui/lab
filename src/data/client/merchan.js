import Client from './index'
import { BASE_URL } from './config'

export default Client({
  baseURL: BASE_URL.PRODUCT,
  transformResponse: [function (response) {
    let { data } = response
    return data
  }],
  headers: { 'Content-Type': 'application/json' }
})
