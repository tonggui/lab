import { WEIGHT_UNIT } from '@/data/enums/product'

const weightTrans = {
  [WEIGHT_UNIT.G]: v => v,
  [WEIGHT_UNIT.ML]: v => v,
  [WEIGHT_UNIT.L]: v => v * 1000,
  [WEIGHT_UNIT.KG]: v => v * 1000,
  [WEIGHT_UNIT.P]: v => v * 454,
  [WEIGHT_UNIT.JIN]: v => v * 500,
  [WEIGHT_UNIT.LIANG]: v => v * 50
}

export const weightOverflow = (weight, maxWeight) => {
  if (!weightTrans[weight.unit]) return false
  return weightTrans[weight.unit](weight.value) > (maxWeight ? weightTrans[maxWeight.unit](maxWeight.value) : 10000) // 默认不能超过10000g
}
