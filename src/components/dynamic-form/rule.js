import { isFunction } from 'lodash'
import { exec } from './util'
import Dep from './dep'

class Rule {
  constructor ({
    match,
    watch,
    result
  } = {}, controller) {
    this.match = match
    this.watch = watch
    this.result = result
    this.controller = controller
    this.execContext = controller.getExecContext()
    this.init()
  }

  init () {
    Object.keys(this.result || {}).forEach((r) => {
      const watcher = () => {
        const isMatched = this.match ? exec(this.match, this.execContext) : true
        if (!isMatched) return // 不匹配条件则返回
        const target = this.result[r]
        const resultPromise = isFunction(target) ? Promise.resolve(target.apply(this.execContext)) : Promise.resolve(target)
        resultPromise.then((resultVal) => {
          this.controller.setResultVal(r, resultVal)
        }).catch(console.error)
      }
      Dep.watch(watcher)
    })
  }
}

export default Rule
