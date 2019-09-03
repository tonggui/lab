import SourceManage from './source'
import Module from './module'

class ModuleManage {
  constructor (context = {}, source = {}, module = {}) {
    this.context = context || {}
    this.sourceManage = new SourceManage(source)
    this.module = this.createModule(module)
  }
  createModule (module) {
    const args = Object.entries(module).reduce((prev, [key, options]) => {
      const { source, ...rest } = options
      prev[key] = { ...rest, source: this.getSource(source) }
      return prev
    }, {})
    return new Module(args)
  }
  getSource (name) {
    return this.sourceManage.getSource(name)
  }
}

export default ModuleManage
