import Vue from 'vue'
import { getFuncName } from '@/views/assemble-page/utils'

class Domain {
  constructor ({ data, services, api }) {
    this.services = {}
    this.data = {}
    this.api = {}
    this.init({ data, services, api })
  }

  init ({ data, services, api }) {
    this.data = Vue.observable({ ...data })
    this.api = { ...api }
    this.addService(services)
  }

  addService (services) {
    if (typeof services === 'function') {
      this.services = Object.assign({}, {
        ...this.services,
        [getFuncName(services)]: services.bind(this.api)
      })
    } else if (typeof services === 'object') {
      this.services = Object.assign({}, { ...this.services }, {
        ...services.map(s => s.bind(this.api))
      })
    }
  }
}
export default Domain
