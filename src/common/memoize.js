import mem from 'mem'

const funcCache = new WeakMap()

const lockCacheKey = key => () => String(key)

/**
 * 与其他Memoize的差异：
 *   1. 基于封装方法创建缓存作用域，便于调用放简单的附加缓存能力
 *   2. 快速忽略无效参数导致的无效缓存问题
 * 引入的风险：
 *   基于封装方法的作用域，存在首次实例化和后续实例化参数不一致导致的风险
 * @param func
 * @param options https://github.com/sindresorhus/mem#options
 */
export default function memoize (func, options = {}) {
  const defaultCache = funcCache.get(func) || new Map()

  const {
    cache = defaultCache,
    ignoreParams = false,
    ...others
  } = options

  if (ignoreParams) {
    others.cacheKey = lockCacheKey('__withoutParamsKey')
  }

  const memoized = mem(func, {
    ...others,
    cache
  })

  if (cache === defaultCache && !funcCache.has(func)) {
    funcCache.set(func, cache)
  }

  return memoized
}
