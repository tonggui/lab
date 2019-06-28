import { isFunction } from 'lodash'
import Rule from './rule'

class RuleController {
  constructor ({
    config,
    execContext,
    configChangeHandler
  }) {
    this.config = config
    this.execContext = execContext
    this.bindEvents()
    this.configChangeHandler = configChangeHandler
    if (this.config.rules) this.config.rules.forEach(rule => new Rule(rule, this))
  }

  bindEvents () {
    Object.keys(this.config.events || {}).forEach((eventName) => {
      this.config.events[eventName] = this.config.events[eventName].bind(this.execContext)
    })
    // 将options中的方法的this指向execContext
    Object.keys(this.config.options || {}).forEach((k) => {
      if (isFunction(this.config.options[k])) {
        this.config.options[k] = this.config.options[k].bind(this.execContext)
      }
    })
  }

  getExecContext () {
    return this.execContext
  }

  setResultVal (key, value) {
    if (!key) return
    // 如果目标是value，则同时更新formData对应的值
    if (key === 'value' && (this.config.key in this.execContext.formData)) {
      this.execContext.formData[this.config.key] = value
    }
    this.configChangeHandler(key, value)
  }
}

export default RuleController
