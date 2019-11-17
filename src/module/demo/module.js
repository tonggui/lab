import { names as source } from './source'
import { names as globalSource } from '../source'
import createFeild from '@/module/helper/createFeild'

export const TYPES = {
  EDITABLE: 'test-editable',
  REQUIRED: 'test-required'
}

export default {
  [TYPES.EDITABLE]: createFeild([source.test, { name: globalSource.listPage, global: true }], false, ([res, res1]) => {
    console.log('test-editable:', res, res1)
    return res.editable
  }),
  [TYPES.REQUIRED]: createFeild(source.test, false, (res) => {
    console.log('test-required:', res)
    return res.required
  })
}
