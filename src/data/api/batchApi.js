import client from './client'

export const fetchRouterInfo = params => client.post('food/batch/r/multiRouterInfo', params).then(data => ({
  ...data,
  routerTagInfo: data.routerTagInfo || {}
}))
