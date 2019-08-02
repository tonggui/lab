import Client from '../factory'
import { BASE_URL } from '../config'

export default Client({
  baseURL: BASE_URL.MERCHANT,
  headers: {
    post: { 'Content-Type': 'application/json' },
    get: { 'Content-Type': 'application/json' }
  }
})
