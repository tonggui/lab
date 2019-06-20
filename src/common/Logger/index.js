/*
 * @description
 *   Please write the index script's description
 * @author rdshoep(rdshoep@126.com)
 *   http://www.rdshoep.com/
 * @version
 *   1.0.0(2018/4/16)
 */
import { LEVELS } from './level'
import Logger, { convertToLevel } from './logger'

import engineConsole from './engines/console'
import enginePerf from './engines/perf'
import engineCat from './engines/cat'

const logger = new Logger()
// 当前ENV表明构建环境，跟NODE_ENV没实际关联意义
const env = process.env.ENV
const loggerLevel = process.env.LOG_LEVEL

// 线上环境设置为WARN级别，并只保留perf和cat记录
if (env === 'prod') {
  logger.level = LEVELS.WARN
  logger.engines.push(enginePerf)
  logger.engines.push(engineCat)
} else {
  // 线下环境默认开启console输出
  logger.engines.push(engineConsole)

  // 开发环境，默认level为debug
  if (env === 'dev') {
    logger.level = LEVELS.DEBUG
  } else {
    logger.level = LEVELS.INFO
    logger.engines.push(enginePerf)
    logger.engines.push(engineCat)
  }
}

// 如果设置了logLevel，已设置的为准
if (loggerLevel) {
  logger.level = convertToLevel(loggerLevel, logger.level)
}

export default logger

export {
  logger,
  Logger,
  LEVELS
}
