import validator from '../../validate'
import { SPU_FELID } from '../../felid'

export default [{
  key: SPU_FELID.PICTURE_CONTENT,
  validate ({ key, value = [], options }) {
    return validator(key)(value, options)
  }
}, {
  key: SPU_FELID.CATEGORY,
  validate ({ key, value, required }) {
    return validator(key)(value, { required })
  }
}, {
  key: SPU_FELID.SKU_LIST,
  validate ({ key, value, options }) {
    return validator(key)(value, options)
  }
}]
