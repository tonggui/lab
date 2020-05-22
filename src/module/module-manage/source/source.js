import memoize from 'memoize-one'
import { isEqual } from 'lodash'

class Source {
  constructor (fetch, { context = {}, defaultValue } = {}) {
    this.context = context
    this.fetch = memoize(fetch)
    this.state = defaultValue
    this.listeners = []
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
    const result = this.fetch(this.context)
    if (result && result.then) {
      result.then(data => {
        if (data !== this.state || !this.loaded) {
          this.state = data
          this.update()
        }
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
