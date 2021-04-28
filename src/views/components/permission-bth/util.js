import { PERMISSION_TYPE_MAP } from '@/views/components/permission-bth/const'
import { getProductPermissionId } from '@/data/api/product'

let productPermissionIdCache = []
let loading = false
// 基于都是拥有权限的假设，默认不需要请求权限列表，但是当权限请求成功时表示需要使用权限列表
let needReqPermission = false

const awaitReq = () => new Promise(resolve => {
  const loop = () => {
    window.requestAnimationFrame(() => {
      if (loading) {
        return loop()
      }
      resolve(productPermissionIdCache)
    })
  }
  loop()
})

const getProductPermissionIdCache = async () => {
  console.log('##productPermissionIdCache ', productPermissionIdCache)
  if (productPermissionIdCache.length) {
    return productPermissionIdCache
  }
  if (loading) {
    const res = await awaitReq()
    return res
  }
  loading = true
  const { permissionIdList } = await getProductPermissionId({}) || {}
  productPermissionIdCache = permissionIdList || []
  loading = false
  needReqPermission = true
  return productPermissionIdCache
}

export const getPermission = async (type) => {
  const list = await getProductPermissionIdCache()
  // 权限列表请求失败，默认都拥有权限
  if (!needReqPermission) {
    return true
  }
  console.log('##list1 ', list)
  return list.includes(PERMISSION_TYPE_MAP[type])
}
