import Felid from './felid'

class Module {
  constructor (felids = {}) {
    this.modules = {}
    this.states = {}
    this.felidListener = {}
    this.listeners = []
    Object.entries(felids).forEach(([key, options]) => {
      this.addFelid(key, options)
    })
  }
  update (key, value) {
    this.states[key] = value
    this.listeners.forEach(l => l(key, this.states))
  }
  addFelid (key, options) {
    if (this.modules[key]) {
      return
    }
    const felid = new Felid(options)
    this.modules[key] = felid
    this.felidListener[key] = (value) => this.update(key, value)
    this.modules[key].addListener(this.felidListener[key])
    this.states[key] = felid.value
  }
  getFelid (key) {
    return this.modules[key].getValue()
  }
  removeFelid (key) {
    const felid = this.modules[key]
    felid.removeListener(this.felidListener[key])
    delete this.felidListener[key]
    delete this.modules[key]
    delete this.states[key]
  }
  addListener = (l) => {
    this.listeners.push(l)
  }
  removeListener = (listener) => {
    const index = this.listeners.findIndex(l => l === listener)
    if (index >= 0) {
      this.listeners.splice(index, 1)
    }
  }
}

export default Module
