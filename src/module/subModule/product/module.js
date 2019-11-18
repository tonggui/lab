import { names as source } from './source'
import TYPES from './moduleTypes'
import createFeild from '@/module/helper/createFeild'

export default {
  [TYPES.EDITABLE]: createFeild(source.test, false, (res) => {
    console.log('test-editable:', res)
    return res.editable
  }),
  [TYPES.REQUIRED]: createFeild(source.test, false, (res) => {
    console.log('test-required:', res)
    return res.required
  })
}
