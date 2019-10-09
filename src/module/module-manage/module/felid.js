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
    const newValue = this.handler(data)
    if (newValue !== this.value) {
      this.value = newValue
      this.listeners.forEach(l => l(this.value))
    }
  }
  getValue = () => {
    this.update()
    return this.value
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

export default Felid
