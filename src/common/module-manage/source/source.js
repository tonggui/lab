import memoize from 'memoize-one'

class Source {
  constructor (fetch, args) {
    this.args = args
    this.fetch = memoize(fetch)
    this.state = null
    this.listeners = []
  }
  getData () {
    const data = this.fetch(this.args)
    this.state = data
    this.update()
  }
  getState () {
    if (this.state) {
      return this.state
    }
    this.getData()
  }
  update () {
    this.listeners.forEach(listener => listener(this.state))
  }
  addListener (listener) {
    if (this.listeners.includes(listener)) {
      return
    }
    this.listeners.push(listener)
  }
  removeListener (listener) {
    const index = this.listeners.findIndex(listener)
    if (index >= 0) {
      this.listeners.splice(index, 1)
    }
  }
}

export default Source
