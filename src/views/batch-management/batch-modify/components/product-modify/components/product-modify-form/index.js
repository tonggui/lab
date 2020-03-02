import ProductModifyForm from './product-modify-form'
import { createRule } from '@/views/batch-management/components/match-rule-form'
import { createModifyData } from './modify-feild-form'

let id = 0

export const createValue = (context) => {
  return {
    rule: createRule(context),
    modifyValue: createModifyData(context),
    id: id++
  }
}

export default ProductModifyForm
