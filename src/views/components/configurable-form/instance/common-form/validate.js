import validator from '../../validate'
import { SPU_FELID } from '../../felid'

export default [{
  key: SPU_FELID.NAME,
  validate ({ key, value, required }) {
    return validator(key)(value, { required })
  }
}, {
  key: SPU_FELID.CATEGORY,
  validate ({ key, value, required }) {
    return validator(key)(value, { required })
  }
}, {
  key: SPU_FELID.TAG_LIST,
  validate ({ key, value, required, label }) {
    return validator(key)(value, { required, label })
  }
}, {
  key: SPU_FELID.PICTURE_LIST,
  validate ({ key, value, required }) {
    return validator(key)(value, { required })
  }
}, {
  key: SPU_FELID.PRODUCT_VIDEO,
  validate ({ key, value }) {
    return validator(key)(value)
  }
}, {
  key: SPU_FELID.SKU_LIST,
  validate ({ key, value, options }) {
    return validator(key)(value, options)
  }
}, {
  key: SPU_FELID.LIMIT_SALE,
  validate ({ key, value, options }) {
    return validator(key)(value, options)
  }
}, {
  key: SPU_FELID.PICTURE_CONTENT,
  validate ({ key, value = [], options }) {
    return validator(key)(value, options)
  }
}]
