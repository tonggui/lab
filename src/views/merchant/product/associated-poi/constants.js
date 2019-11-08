export const EXIST_TYPE = {
  ALL: 2,
  INCLUDE: 0,
  EXCLUDE: 1
}

export const existOptions = [{
  label: '全部',
  value: EXIST_TYPE.ALL
}, {
  label: '有此商品',
  value: EXIST_TYPE.INCLUDE
}, {
  label: '无此商品',
  value: EXIST_TYPE.EXCLUDE
}]
