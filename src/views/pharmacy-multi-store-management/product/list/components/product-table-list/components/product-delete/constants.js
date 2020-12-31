export const TYPE = {
  MERCHANT: 0,
  ALL_POI: 1,
  SELECT_POI: 2
}

export const defaultOptions = [{
  value: TYPE.MERCHANT,
  label: '总部商品'
}, {
  value: TYPE.ALL_POI,
  label: '所有门店商品'
}]

export const optionsWithPoi = [...defaultOptions, {
  value: TYPE.SELECT_POI,
  label: '指定门店商品'
}]

export const defaultType = TYPE.MERCHANT
