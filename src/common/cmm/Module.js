/*
 * @description
 *   Please write the Module script's description
 * @author rdshoep(rdshoep@126.com)
 *   http://www.rdshoep.com/
 * @version
 *   1.0.0(2019-04-14)
 */
import { isFunction } from 'lodash'

export const getModuleState = (module, ctx) => {
  if (isFunction(module.tester)) {
    return module.tester(ctx)
  } else {
    return module.tester
  }
}

export const combineWithIntersectionMode = (values) => values.every(v => !!v)

export const combineWithUnionMode = (values) => values.some(v => !!v)

/**
 * 创建一个功能模块
 * @param name 功能名称
 * @param tester {Any|Function} 获取功能对应的状态值
 * @param defaultValue 功能的默认配置
 * @param combine 合并方法，多模块合并时的处理 combine(values, module, contexts)
 * @return {{defaultValue: boolean, name: *, tester: *, combine: (function(*): *)}}
 */
export const createModule = (name, tester, defaultValue = true, combine = combineWithIntersectionMode) => {
  return {
    name,
    tester,
    defaultValue,
    combine
  }
}

export default createModule
