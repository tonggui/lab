/*
 * @description
 *   Please write the ValidateInput script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2020/3/15)
 */
import { assign } from 'lodash'
import { forwardComponent } from '@/common/vnode'
import ProInput from './index'

// 数字字符串，类似用于UPC基础校验
const REGEXP_DIGIT = /^\d+$/
// 整数
const REGEXP_INTEGER = /^(-?[1-9]\d*|0)$/
// 自然数/非负整数
const REGEXP_NATURE_INTEGER = /^([1-9]\d*|0)$/
// 正整数
const REGEXP_POSITIVE_INTEGER = /^[1-9]\d*$/
/**
 * 默认浮点数格式
 * @param decimalLength
 * @param onlyPositive
 * @return {RegExp}
 */
const normalizeFloatRegExp = (decimalLength = 2, onlyPositive = false) => {
  return new RegExp(
    `^${onlyPositive ? '' : '-?'}([1-9]\\d*|0)\\.?(\\d{0,${decimalLength}})?$`
  )
}

const createValidatorByExp = exp => v => exp.test(v)

const ValidatorMap = {
  number: v => /^\d*$/.test(v),
  digit: createValidatorByExp(REGEXP_DIGIT),
  integer: createValidatorByExp(REGEXP_INTEGER),
  positive_integer: createValidatorByExp(REGEXP_NATURE_INTEGER),
  nature_integer: createValidatorByExp(REGEXP_POSITIVE_INTEGER),
  positive_float_1: createValidatorByExp(normalizeFloatRegExp(1, true)),
  positive_float_2: createValidatorByExp(normalizeFloatRegExp(2, true)),
  positive_float_3: createValidatorByExp(normalizeFloatRegExp(3, true))
}

export default {
  name: 'ValidateInput',
  props: {
    value: [String, Number],
    validate: Function,
    validateType: String
  },
  data () {
    return {
      val: ''
    }
  },
  computed: {
    validator () {
      if (typeof this.validate === 'function') return this.validate
      if (this.validateType && ValidatorMap[this.validateType]) { return ValidatorMap[this.validateType] }
      return () => true
    }
  },
  watch: {
    value: {
      handler (v) {
        this.val = v && !this.validator(v) ? '' : v
      },
      immediate: true
    }
  },
  methods: {
    handleValueChanged (v) {
      const oldValue = this.val
      this.val = v
      if (v && !this.validator(v)) {
        // 解决不受控的场景，先更新后重置
        this.$nextTick(() => {
          this.val = oldValue
        })
      } else {
        this.$emit('input', v)
        this.$emit('change', v)
      }
    }
  },
  render () {
    return forwardComponent(this, ProInput, {
      props: {
        value: this.val
      },
      on: assign({}, this.$listeners, {
        input: this.handleValueChanged,
        change: this.handleValueChanged
      })
    })
  }
}
