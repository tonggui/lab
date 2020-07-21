import validate from '../../validate'
import { SPU_FELID } from '../../felid'
import { noop } from 'lodash'

export default [{
  key: SPU_FELID.PICTURE_CONTENT,
  validate ({ value = [], options }) {
    const validator = validate[SPU_FELID.PICTURE_CONTENT] || noop
    return validator(value, options)
  }
}, {
  key: SPU_FELID.SKU_LIST,
  validate ({ value, options }) {
    const validator = validate[SPU_FELID.SKU_LIST] || noop
    return validator(value, options)
  }
}]
