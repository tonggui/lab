import memoize from 'memoize-one'
import { isEqual } from 'lodash'

class Source {
  constructor (fetch, { context = {}, defaultValue } = {}) {
    this.context = context
    this.sourceFetch = fetch
    this.fetch = memoize(fetch)
    this.state = defaultValue
    this.listeners = []
    this.error = false
    this.loaded = false
  }
  setContext (context) {
    const newContext = { ...this.context, ...context }
    if (!isEqual(newContext, this.context)) {
      this.context = newContext
      if (this.loaded) {
        this.getData()
      }
    }
  }
  update () {
    this.loaded = true
    this.listeners.forEach(l => l(this.state))
  }
  addListener (l) {
    if (!this.listeners.includes(l)) {
      this.listeners.push(l)
    }
  }
  removeListener (l) {
    const index = this.listeners.findIndex(l)
    if (index >= 0) {
      this.listeners.splice(index, 1)
    }
  }
  getData () {
    if (this.loaded) {
      return
    }
    const result = this.fetch(this.context)
    if (result && result.then) {
      result.then(data => {
        this.error = false
        if (data !== this.state || !this.loaded) {
          this.state = data
          this.update()
        }
      }).catch(err => { // TODO 错误重试问题
        console.error(err)
        this.error = true
        this.update()
        this.fetch = memoize(this.sourceFetch)
      })
      return
    }
    if (result !== this.state) {
      this.state = result
      this.update()
    }
  }
  getState () {
    this.getData()
    return this.state
  }
}

export default Source
