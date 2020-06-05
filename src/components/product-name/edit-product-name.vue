<template>
  <div class="edit-product-name" :class="{ error: selfShowErrorTip && error, 'with-error-tip': showErrorTip }">
    <div class="edit-product-name-input">
      <Input :placeholder="placeholder" ref="input" :clearable="clearable" :value="selfValue" @on-change="handleChange" :size="size" :type="type" v-bind="$attrs" @on-focus="$emit('on-focus')" @on-blur="handleBlur" />
    </div>
    <template v-if="selfShowErrorTip">
      <div class="error" v-show="error">{{ error }}</div>
    </template>
    <slot></slot>
  </div>
</template>
<script>
  import {
    PRODUCT_NAME_MAX_LENGTH
  } from '@/data/constants/product'

  export default {
    name: 'edit-product-name',
    props: {
      value: String,
      validator: {
        type: Function,
        default: () => ''
      },
      size: {
        type: String,
        default: 'default',
        validator: (size) => ['default', 'small', 'large'].includes(size)
      },
      showErrorTip: {
        type: Boolean,
        default: true
      },
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: PRODUCT_NAME_MAX_LENGTH
      },
      clearable: Boolean,
      type: String,
      placeholder: String
    },
    data () {
      return {
        selfShowErrorTip: this.showErrorTip,
        error: '',
        selfValue: this.value || ''
      }
    },
    watch: {
      showErrorTip (showErrorTip) {
        this.selfShowErrorTip = showErrorTip
      },
      value (value) {
        if (value !== this.selfValue) {
          this.selfValue = value || ''
        }
      }
    },
    methods: {
      setInputRefValue (value) {
        const $input = this.$refs.input
        if (!$input) {
          return
        }
        $input.currentValue = value
        if (this.type === 'textarea') {
          this.$nextTick(() => {
            $input.resizeTextarea()
          })
        }
      },
      triggerChange (value) {
        value = value || ''
        this.$emit('input', value)
        this.$emit('change', value)
      },
      setValue (newValue) {
        if (newValue === this.selfValue) {
          return
        }
        this.selfShowErrorTip = false
        // 空值处理
        if (!newValue) {
          this.error = '标题不能为空'
          this.selfValue = newValue
          // this.$emit('on-error', this.error)
          this.triggerChange(newValue)
          return
        }

        const emojiReg = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/

        // 存在非法字符
        if (emojiReg.test(newValue)) {
          this.error = '标题不支持表情符号'
          this.$emit('on-error', this.error)
          this.setInputRefValue(this.selfValue)
          return
        }

        if (newValue.length > this.max) {
          const str = newValue.slice(0, this.max)
          this.error = `标题最多${this.max}个字`
          if (this.selfValue === str) {
            this.setInputRefValue(str)
          }
          this.selfValue = str
        } else {
          this.error = this.validator(newValue) || ''
          this.selfValue = newValue
        }

        this.$emit('on-error', this.error)
        this.triggerChange(this.selfValue)
      },
      handleChange (e) {
        const newValue = e.target.value
        this.setValue(newValue)
      },
      handleBlur () {
        if (!this.selfValue) {
          this.error = '标题不能为空'
          this.selfShowErrorTip = true
        }
        if (this.selfValue) {
          const formatValue = this.selfValue.trim()
          this.setValue(formatValue)
        }
        this.$emit('on-blur')
      }
    }
  }
</script>
<style lang="less" scoped>
  .edit-product-name {
    position: relative;
    &.with-error-tip {
      padding-bottom: 20px;
    }
    .edit-product-name-input /deep/ textarea {
      resize: none;
    }
    &.error {
      /deep/ .boo-input {
        border: 1px solid @error-color;
      }
    }
    .error {
      position: absolute;
      color: @error-color;
      font-size: @font-size-small;
      line-height: 1;
      margin-top: 4px;
    }
  }
</style>
