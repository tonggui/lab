import { stringify } from 'qs'
import Client from '../factory'
import { BASE_URL } from '../config'

export default Client({
  baseURL: BASE_URL.MERCHANT,
  headers: {
    // post: { 'Content-Type': 'application/json' },
    // get: { 'Content-Type': 'application/json' }
  },
  transformRequest: [(data, headers) => {
    if (typeof data === 'object') {
      if (!(data instanceof FormData)) {
        return stringify({ hqccParams: JSON.stringify(data) })
      }
    }
    return data
  }]
})
