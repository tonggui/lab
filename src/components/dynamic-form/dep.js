import { isFunction } from 'lodash'

class Dep {
  static watch (target) {
    if (!target) return
    Dep.target = target
    if (isFunction(target)) target()
    Dep.target = null
  }

  constructor () {
    this.listenerPool = {}
  }

  depend (key) {
    if (!key) return
    if (!this.listenerPool[key]) {
      this.listenerPool[key] = []
    }
    // 有target并且没在对应key的listeners里
    if (Dep.target && this.listenerPool[key].indexOf(Dep.target) < 0) {
      this.listenerPool[key].push(Dep.target)
    }
  }

  notify (key) {
    if (!key) return
    const listeners = this.listenerPool[key] || []
    listeners.forEach(l => Dep.watch(l))
  }
}
Dep.target = null

export default Dep
