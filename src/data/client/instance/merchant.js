import Client from '../factory'
import { BASE_URL } from '../config'

export default Client({
  baseURL: BASE_URL.MERCHANT,
  transformResponse: [function (response) {
    let { data } = response
    return data
  }],
  headers: { 'Content-Type': 'application/json' }
})
