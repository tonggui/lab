import validator from '../../validate'
import { SPU_FIELD } from '../../field'

// 参考：src/views/components/product-form/config.js
// 参考：src/views/components/product-form/validate.js
export default [{
  key: SPU_FIELD.NAME,
  validate ({ key, value, required, label, options }) {
    return validator(key)(value, { required, label, options })
  }
}, {
  key: SPU_FIELD.CATEGORY,
  validate ({ key, value, required }) {
    return validator(key)(value, { required })
  }
}, {
  key: SPU_FIELD.TAG_LIST,
  validate ({ key, value, required, label }) {
    return validator(key)(value, { required, label })
  }
}, {
  key: SPU_FIELD.PICTURE_LIST,
  validate ({ key, value, required }) {
    return validator(key)(value, { required })
  }
}, {
  key: SPU_FIELD.PRODUCT_VIDEO,
  validate ({ key, value }) {
    return validator(key)(value)
  }
}, {
  key: SPU_FIELD.SKU_LIST,
  validate ({ key, value, options }) {
    return validator(key)(value, options)
  }
}, {
  key: SPU_FIELD.LIMIT_SALE,
  validate ({ key, value, options }) {
    return validator(key)(value, options)
  }
}, {
  key: SPU_FIELD.PICTURE_CONTENT,
  validate ({ key, value = [], options }) {
    return validator(key)(value, options)
  }
}, {
  key: SPU_FIELD.DESCRIPTION,
  validate ({ key, value = '', options }) {
    return validator(key)(value, options)
  }
}, {
  key: SPU_FIELD.SALE_TYPE,
  validate ({ key, value = '', options }) {
    return validator(key)(value, options)
  }
}]
