/* eslint-disable no-new-func */
export function exec (code, context) {
  return new Function(`'use strict' return (${code})`).apply(context)
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
