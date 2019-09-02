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
  }
  update = () => {
    let data
    if (isArray(this.source)) {
      data = this.source.map(s => s.getState())
    } else {
      data = this.source.getState()
    }
    this.value = this.handler(data)
  }
  getValue = () => {
    this.update()
    return this.value
  }
}

export default Felid
