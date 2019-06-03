/*
 * @description
 *   Please write the Module script's description
 * @author rdshoep(rdshoep@126.com)
 *   http://www.rdshoep.com/
 * @version
 *   1.0.0(2019-04-14)
 */
import { isFunction } from 'lodash'

export const ModuleType = {
  INTERSECTION: 1,
  UNION: 2
}

export default class Module {
  constructor (name, type = ModuleType.INTERSECTION, tester, defaultValue = false) {
    this.name = name
    this.type = type
    this.tester = tester
    this.defaultValue = defaultValue
  }

  getState (ctx = {}) {
    if (isFunction(this.tester)) {
      return this.tester(ctx)
    } else {
      return !!this.tester
    }
  }
}
