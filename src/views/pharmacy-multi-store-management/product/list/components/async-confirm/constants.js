export const POI_TYPE = {
  ALL_POI: 1,
  SELECT_POI: 2
}

export const options = [{
  value: POI_TYPE.ALL_POI,
  label: '所有门店'
}, {
  value: POI_TYPE.SELECT_POI,
  label: '指定门店'
}]

export const ASYNC_TYPE = {
  PRODUCT: 0,
  TAG: 1
}

export const asyncInfo = {
  [ASYNC_TYPE.PRODUCT]: (tagName) => ({
    title: '同步商品排序',
    content: `确认同步“${tagName}”分类下的商品排序`,
    confirmTitle: '确认同步所有门店商品排序',
    confirmContent: `确认同步“${tagName}”分类下的商品排序至所有门店`,
    success: '同步商品排序成功，请前往[任务进度]查看进度~',
    error: '同步商品排序失败，请重试！'
  }),
  [ASYNC_TYPE.TAG]: () => ({
    title: '同步分类排序',
    content: '确认同步分类排序',
    confirmTitle: '确认同步所有门店分类排序',
    confirmContent: '确认同步分类排序至所有门店',
    success: '同步分类排序成功，请前往[任务进度]查看进度~',
    error: '同步分类排序失败，请重试！'
  })
}
