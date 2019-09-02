import Felid from './felid'

class Module {
  constructor (felids = {}) {
    this.module = Object.entries(felids).reduce((prev, [key, options]) => {
      prev[key] = new Felid(options)
      return prev
    }, {})
  }
  addFelids (key, options) {
    this.module[key] = new Felid(options)
  }
  removeFelid (key) {
    delete this.module[key]
  }
  getFelid (key) {
    const felid = this.module[key]
    if (!felid) {
      return
    }
    return felid.getValue()
  }
}

export default Module
