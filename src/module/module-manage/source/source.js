import memoize from 'memoize-one'
import { isEqual } from 'lodash'

class Source {
  constructor (fetch, { context, defaultValue }) {
    this.context = context
    this.fetch = memoize(fetch)
    this.state = defaultValue
    this.listeners = []
    this.loaded = false
  }
  setContext (context) {
    if (!isEqual(context, this.context) && this.loaded) {
      this.update()
    }
    this.context = context
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
        if (data !== this.state) {
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
