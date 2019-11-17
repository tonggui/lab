import { names as source } from './source'
import TYPES from './moduleTypes'
import createModule from '@/module/helper/createModule'

export default {
  [TYPES.EDITABLE]: createModule(source.test, false, (res) => {
    console.log('test-editable:', res)
    return res.editable
  }),
  [TYPES.REQUIRED]: createModule(source.test, false, (res) => {
    console.log('test-required:', res)
    return res.required
  })
}
