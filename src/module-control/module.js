import { names as source } from './source'

export const TYPES = {
  EDITABLE: 'test-editable',
  REQUIRED: 'test-required'
}

const createModule = (source, defaultValue, handler) => ({
  source,
  defaultValue,
  handler
})

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
