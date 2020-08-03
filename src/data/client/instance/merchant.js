import { stringify, parse } from 'qs'
import Client from '../factory'
import { BASE_URL } from '../config'

const merchantId = parse(location.search, { ignoreQueryPrefix: true }).merchantId

export default Client({
  baseURL: BASE_URL.MERCHANT,
  headers: {
    merchantId
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
