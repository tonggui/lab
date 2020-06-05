import Felid from './felid'

class Module {
  constructor (felids = {}) {
    this.felids = {}
    this.states = {}
    this.felidListener = {}
    this.listeners = []
    Object.entries(felids).forEach(([key, options]) => {
      this.addFelid(key, options)
    })
  }
  update (key, value) {
    this.states[key] = value
    this.listeners.forEach(l => l(key, value, this.states))
  }
  addFelid (key, options) {
    if (this.felids[key]) {
      return
    }
    const felid = new Felid(options)
    this.felids[key] = felid
    this.felidListener[key] = (value) => this.update(key, value)
    this.felids[key].addListener(this.felidListener[key])
    this.states[key] = felid.value
  }
  getFelidInstance (key) {
    if (!this.felids[key]) {
      throw Error(`查找的felid: ${key} 不存在`)
    }
    return this.felids[key]
  }
  getFelid (key) {
    return this.felids[key].getValue()
  }
  removeFelid (key) {
    const felid = this.modules[key]
    felid.removeListener(this.felidListener[key])
    delete this.felidListener[key]
    delete this.modules[key]
    delete this.states[key]
  }
  addListener = (listener) => {
    const index = this.listeners.findIndex(l => l === listener)
    if (index < 0) {
      this.listeners.push(listener)
    }
  }
  removeListener = (listener) => {
    const index = this.listeners.findIndex(l => l === listener)
    if (index >= 0) {
      this.listeners.splice(index, 1)
    }
  }
}

export default Module
