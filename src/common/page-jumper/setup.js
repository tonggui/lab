/*
 * @description
 *   Please write the setup script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2020/5/27)
 */
import { isPlainObject } from 'lodash'
import bridgeJumper from '@/components/link/bridge-jump'
import PageJumperPlugin from './plugin'

export default (Vue, router) => {
  // 装配PageJumperPlugin
  Vue.use(PageJumperPlugin, {
    jumpTo (url) {
      let baseUrl = new URL(location.href)
      let appBasePath = '/'
      if (router) {
        appBasePath = router.base || '/'
      }

      if (router && isPlainObject(url)) {
        url = router.resolve(url).href
      }

      const targetUrl = new URL(url, baseUrl)
      if (
        router &&
        targetUrl.origin === location.origin &&
        (appBasePath === '/' || targetUrl.pathname.indexOf(appBasePath) === 0)
      ) {
        let resolvedPathName = targetUrl.pathname
        if (appBasePath && appBasePath !== '/') {
          resolvedPathName = resolvedPathName.replace(appBasePath, '')
        }
        router.push({
          path: resolvedPathName,
          query: Array.from(targetUrl.searchParams.entries()).reduce((map, [key, value]) => {
            map[key] = encodeURIComponent(value)
            return map
          }, {})
        })
        return
      }

      // 应用外路由
      // bridgeJumper
      bridgeJumper(targetUrl.toString())
    }
  })
}
