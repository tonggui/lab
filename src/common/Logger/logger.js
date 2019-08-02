/*
 * @description
 *   Please write the logger script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2017/6/28)
 */
import isString from 'lodash/isString'
import isNumber from 'lodash/isNumber'
import {
  Level, LEVELS, findLevelByName, findLevelByValue
} from './level'

export const convertToLevel = (level, defaultLevel = LEVELS.INFO) => {
  if (isNumber(level)) {
    level = findLevelByValue(level)
  } else if (isString(level)) {
    level = findLevelByName(level)
  }

  return level instanceof Level ? level : defaultLevel
}

function Logger (level) {
  this.level = convertToLevel(level)
  this.engines = []
}

Logger.prototype.log = function (level, type, msg, meta) {
  level = convertToLevel(level)

  // 添加校验
  if (!msg) {
    msg = type
    type = 'default'
  }

  if (level.value >= this.level.value) {
    this.engines.forEach((engine) => {
      // eslint-disable-next-line
      try { engine(level, type, msg, meta) }
      catch (err) { console.log(err) }
    })
  }
}

Object.values(LEVELS).forEach((level) => {
  Logger.prototype[level.name] = function (...rest) {
    return Logger.prototype.log.apply(this,
      [level].concat(Array.prototype.slice.apply(rest)))
  }
})

export default Logger
