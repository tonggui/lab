import validator from '../../validate'
import { SPU_FIELD } from '../../field'

// 参考：src/views/components/medicine-apply-form/config.js
export default [{
  key: SPU_FIELD.PICTURE_CONTENT,
  validate ({ key, value = [], options }) {
    return validator(key)(value, options)
  }
}, {
  key: SPU_FIELD.CATEGORY,
  validate ({ key, value, required }) {
    return validator(key)(value, { required })
  }
}, {
  key: SPU_FIELD.SKU_LIST,
  validate ({ key, value, options }) {
    return validator(key)(value, options)
  }
}]