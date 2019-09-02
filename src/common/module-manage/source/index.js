import Source from './source'

class SourceManage {
  constructor (source = {}) {
    this.source = Object.entries(source).reduce((prev, [key, fetch]) => {
      prev[key] = new Source(fetch)
      return prev
    }, {})
  }
  registerSource (key, fetch) {
    this.source[key] = new Source(fetch)
  }
  unRegisterSource (key) {
    delete this.source[key]
  }
  getSource (key) {
    const source = this.source[key]
    if (!source) {
      return
    }
    return source
  }
}

export default SourceManage
