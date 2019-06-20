/*
 * @description
 *   Please write the level script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2017/6/28)
 */
class Level {
  constructor (value, name) {
    this.value = value
    this.name = name
  }
}

const LEVELS = {
  DEBUG: new Level(1, 'debug'),
  INFO: new Level(2, 'info'),
  WARN: new Level(3, 'warn'),
  ERROR: new Level(4, 'error')
}

const findLevelByValue = val => Object.values(LEVELS).find(level => level.value === val)
const findLevelByName = name => Object.values(LEVELS).find(level => level.name === name)

export default Level
export {
  Level,
  LEVELS,
  findLevelByValue,
  findLevelByName
}
