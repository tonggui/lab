import { isFunction, isPlainObject } from 'lodash'
/* eslint-disable no-new-func */
export function exec (code, context) {
  return new Function(`'use strict'; return (${code})`).apply(context)
}

export const assignToSealObject = (sealTarget, ...sources) => {
  const keys = Object.keys(sealTarget)
  sources.forEach((source) => {
    Object.entries(source).forEach(([key, value]) => {
      if (keys.indexOf(key) > -1) {
        sealTarget[key] = value
      }
    })
  })
  return sealTarget
}

export function traverse (formConfig = [], fn) {
  for (let i = 0; i < formConfig.length; i++) {
    const config = formConfig[i]
    if (Array.isArray(config)) {
      return traverse(config, fn)
    }
    if (isFunction(fn) && fn(config)) {
      return config
    }
    if (config.children) {
      if (Array.isArray(config.children)) {
        const result = traverse(config.children, fn)
        if (result) return result
      } else if (isPlainObject(config.children)) {
        const result = traverse(Object.values(config.children), fn)
        if (result) return result
      }
    }
  }
}

export const createConfigKey = (config, component) =>
  `${config.key || (Date.now() + Math.ceil(Math.random() * 100000))}_${(component && component.name) || component}`
