import { isArray } from 'lodash'

const defaultHandler = (data) => data

class Felid {
  constructor ({ source, handler, defaultValue, needSourceLoaded }) {
    this.handler = handler || defaultHandler
    this.source = source
    this.value = defaultValue
    this.needSourceLoaded = needSourceLoaded // 是否需要source全部加载完成之后再计算
    if (isArray(source)) {
      source.forEach(s => s.addListener(this.update))
    } else {
      source.addListener(this.update)
    }
    this.listeners = []
    this.hasUsed = false
  }
  update = () => {
    if (!this.hasUsed) {
      return
    }
    let data
    if (isArray(this.source)) {
      data = this.source.map(s => s.getState())
    } else {
      data = this.source.getState()
    }
    if (this.needSourceLoaded && !this.sourceLoaded) {
      return
    }
    const newValue = this.handler(data)
    if (newValue !== this.value) {
      this.value = newValue
      this.listeners.forEach(l => l(this.value))
    }
  }
  getValue = () => {
    this.hasUsed = true
    this.update()
    return this.value
  }
  get sourceLoaded () {
    if (Array.isArray(this.source)) {
      return this.source.every(s => s.loaded)
    }
    return this.source.loaded
  }
  get sourceError () {
    if (Array.isArray(this.source)) {
      return this.source.some(s => s.error)
    }
    return this.source.error
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
