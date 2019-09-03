import { isArray } from 'lodash'

const defaultHandler = (data) => data

class Felid {
  constructor ({ source, handler, defaultValue }) {
    this.handler = handler || defaultHandler
    this.source = source
    this.value = defaultValue
    if (isArray(source)) {
      source.forEach(source => source.addListener(this.update))
    } else {
      source.addListener(this.update)
    }
    this.listeners = []
  }
  update = () => {
    let data
    if (isArray(this.source)) {
      data = this.source.map(s => s.getState())
    } else {
      data = this.source.getState()
    }
    this.value = this.handler(data)
    this.listeners.forEach(l => l(this.value))
  }
  getValue = () => {
    this.update()
    return this.value
  }
  addListener = (listener) => {
    if (this.listeners.includes(listener)) {
      return
    }
    this.listeners.push(listener)
  }
  removeListener = (listener) => {
    const index = this.listeners.findIndex(listener)
    if (index >= 0) {
      this.listeners.splice(index, 1)
    }
  }
}

export default Felid
