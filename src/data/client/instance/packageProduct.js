import Client from '../factory'
import { BASE_URL } from '../config'

export default Client({
  baseURL: BASE_URL.PRODUCT,
  headers: {}
})
