import { isFunction } from 'lodash'
import Source from './source'

class SourceManage {
  constructor (source = {}, context) {
    this.context = context
    this.source = {}
    Object.entries(source).forEach(([key, options]) => {
      this.registerSource(key, options)
    })
  }
  setContext (context) {
    this.context = context
    Object.entries(this.source).forEach(([k, s]) => s.setContext(context))
  }
  getContext () {
    return this.context
  }
  registerSource (key, options) {
    let fetch
    let defaultValue
    if (isFunction(options)) {
      fetch = options
    } else {
      fetch = options.fetch
      defaultValue = options.defaultValue
    }
    this.source[key] = new Source(fetch, { context: this.context, defaultValue })
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
