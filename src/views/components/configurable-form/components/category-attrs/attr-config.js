import { Message } from '@roo-design/roo-vue'
import validator, { regMap } from './validator'
import { REG_TYPE, VALUE_TYPE, RENDER_TYPE } from '@/data/enums/category'
import { newCustomValuePrefix } from '@/data/helper/category/operation'
import TimeCounters from '@/common/lx/lxReport/lxTime'

// 参考：src/views/components/product-form/components/category-attrs/config.js
function getRegTip (regTypes) {
  if (regTypes && regTypes.length) {
    const supportLabels = []
    let reverse = false
    regTypes.forEach(type => {
      if (regMap[type]) {
        supportLabels.push(regMap[type].label)
      }
      if (type === REG_TYPE.SYM) {
        reverse = true
      }
    })
    return `仅支持输入${supportLabels.join('、')}${reverse ? '、标点符号(含表情)' : ''}`
  }
  return ''
}

const createInput = (attr, components) => {
  const { name, maxLength = 0, regTypes } = attr
  const regTip = getRegTip(regTypes)
  const validate = validator()
  const formatter = { template: `${name}%error` }
  if (attr.required) {
    validate.add({ type: 'textEmpty', formatter })
  }
  validate.add({ type: 'text', options: { regTypes }, formatter })
  validate.add({ type: 'textLength', options: { maxLength }, formatter })
  return {
    type: components['CategoryAttrText'],
    binding: {
      event: 'on-change'
    },
    options: {
      type: 'textarea',
      maxLength,
      attr,
      placeholder: regTip ? `${name}${regTip}` : '',
      rows: Math.min(1 + Math.ceil(attr.maxLength / 20), 3)
    },
    validate (config) {
      const { disabled, value } = config
      if (disabled) {
        return
      }
      const error = validate.run(value, config)
      if (error) {
        throw new Error(error)
      }
    },
    events: {
      'on-blur' ($event) {
        this.self.required && TimeCounters.setEndTime(this.self.key, +new Date())
        const val = $event.target.value.trim()
        if (!val) {
          return
        }
        const error = validate.run(val)
        if (error) {
          Message.warning(`${name}${error}`)
        }
      },
      'on-focus' ($event) {
        console.log(this)
        this.self.required && TimeCounters.setTime('categoryAttrs', +new Date(), 's2e', { id: this.self.key, label: this.self.label })
      }
    }
  }
}

const createSelect = (attr, components) => {
  const { extensible, maxCount } = attr
  const validate = validator()
  const formatter = { template: `${attr.name}%error` }
  if (attr.required) {
    validate.add({ type: 'selectEmpty', formatter })
  }
  validate.add({ type: 'selectLength', options: { maxCount }, formatter })
  return {
    type: components['CategoryAttrSelect'],
    binding: {
      event: 'change'
    },
    validate (config) {
      const { disabled, value } = config
      if (disabled) {
        return
      }
      const error = validate.run(value, config)
      if (error) {
        throw new Error(error)
      }
    },
    options: {
      valueKey: 'id',
      labelKey: 'name',
      group: ['自定义'],
      extensible,
      maxCount,
      customValueKeyPrefix: newCustomValuePrefix,
      attr,
      source: attr.options,
      multiple: attr.valueType === VALUE_TYPE.MULTI_SELECT
    },
    events: {
      'blur' () {
        this.self.required && TimeCounters.setEndTime(this.self.key, +new Date())
      },
      'focus' () {
        this.self.required && TimeCounters.setTime('categoryAttrs', +new Date(), 's2e', { id: this.self.key, label: this.self.label })
      }
    }
  }
}

const createCascade = (attr, components) => {
  const { attribute = {} } = attr.render
  const validate = validator()
  const formatter = { template: `${attr.name}%error` }
  if (attr.required) {
    validate.add({ type: 'selectEmpty', formatter })
  }
  return {
    type: components['CategoryAttrCascader'], // 药品的没有级联选择，使用文本
    binding: {
      event: 'change'
    },
    validate (config) {
      const { disabled, value } = config
      if (disabled) {
        return
      }
      const error = validate.run(value, config)
      if (error) {
        throw new Error(error)
      }
    },
    options: {
      maxCount: attribute.maxCount || 1,
      showSearch: !!attribute.search,
      cascader: !!attribute.cascade,
      source: attr.options,
      attr,
      multiple: attr.valueType === VALUE_TYPE.MULTI_SELECT
    },
    events: {
      'focus' ($event) {
        this.self.required && TimeCounters.setTime('categoryAttrs', +new Date(), 's2e', { id: this.self.key, label: this.self.label })
      },
      'close' ($event) {
        this.self.required && TimeCounters.setEndTime(this.self.key, +new Date())
      }
    }
  }
}

const createBrand = (attr, components) => {
  const validate = validator()
  const formatter = { template: `${attr.name}%error` }
  if (attr.required) {
    validate.add({ type: 'selectEmpty', formatter })
  }
  return {
    type: components['CategoryAttrBrand'], // 药品品牌使用文本展示
    binding: {
      event: 'change'
    },
    options: {
      maxCount: 1,
      showSearch: true,
      source: attr.options,
      attr,
      multiple: attr.valueType === VALUE_TYPE.MULTI_SELECT
    },
    validate (config) {
      const { disabled, value } = config
      if (disabled) {
        return
      }
      const error = validate.run(value, config)
      if (error) {
        throw new Error(error)
      }
    },
    rules: [{
      result: {
        'options.allowApply' () {
          return !!this.getContext('allowBrandApply')
        }
      }
    }],
    events: {
      'focus' ($event) {
        this.self.required && TimeCounters.setTime('categoryAttrs', +new Date(), 's2e', { id: this.self.key, label: this.self.label })
      },
      'close' ($event) {
        this.self.required && TimeCounters.setEndTime(this.self.key, +new Date())
      }
    }
  }
}

const map = {
  [RENDER_TYPE.INPUT]: createInput,
  [RENDER_TYPE.SELECT]: createSelect,
  [RENDER_TYPE.CASCADE]: createCascade,
  [RENDER_TYPE.BRAND]: createBrand
}

export default (attr, components = {}) => {
  const render = map[attr.render.type]
  if (render) {
    return render(attr, components)
  }
}
