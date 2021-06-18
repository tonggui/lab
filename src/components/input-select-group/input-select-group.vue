<template>
  <div class="container">
    <slot name="prefix"></slot>
    <div
      id="div1" tabindex="0" @mouseleave="asideBlur()" @focus="$emit('on-div-focus')" outline=0
      hidefocus="true" style="outline:none"
    >
      <component
        v-bind="$attrs"
        :precision="precision"
        :disabled="inputDisabled"
        :value="inputValue"
        @on-change="handleInputChange"
        class="input"
        :is="inputComponent"
        @on-focus="$emit('on-focus')"
        @on-blur="$emit('on-blur')"
      />
    </div>
    <template v-if="needUnit">
      <span class="separtor" v-if="separtor">{{ separtor }}</span>
      <Select :disabled="selectDisabled" transfer :value="selectValue" @on-change="handleSelectChange" class="select">
        <Option v-for="item in options" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </template>
  </div>
</template>
<script>
  export default {
    name: 'input-select-group',
    props: {
      value: Object,
      needUnit: {
        type: Boolean,
        default: true
      },
      inputType: {
        type: String,
        default: 'string',
        validator: (v) => ['string', 'number'].includes(v)
      },
      inputKey: {
        type: String,
        required: true
      },
      precision: Number,
      selectKey: {
        type: String,
        required: true
      },
      options: Array,
      separtor: String,
      disabled: {
        type: [Boolean, Object],
        default: false
      }
    },
    computed: {
      inputValue () {
        return this.value[this.inputKey]
      },
      selectValue () {
        return this.value[this.selectKey]
      },
      inputDisabled () {
        return typeof this.disabled === 'object' ? this.disabled.input : this.disabled
      },
      selectDisabled () {
        return typeof this.disabled === 'object' ? this.disabled.select : this.disabled
      },
      inputComponent () {
        if (this.inputType === 'number') {
          return 'InputNumber'
        }
        return 'Input'
      }
    },
    methods: {
      handleInputChange (e) {
        let v = e
        if (this.inputComponent === 'Input') {
          v = e.target.value
        }
        this.triggerChange({
          ...this.value,
          [this.inputKey]: v
        })
      },
      handleSelectChange (v) {
        this.triggerChange({
          ...this.value,
          [this.selectKey]: v
        })
      },
      triggerChange (v) {
        this.$emit('on-change', v)
        this.$emit('input', v)
      },
      asideBlur () {
        document.getElementById('div1').blur()
        this.$emit('on-div-blur')
      }
    }
  }
</script>
<style lang="less" scoped>
  .container {
    display: flex;
    align-items: center;
    .input {
      flex: 1;
      max-width: 60%;
      min-width: 70px;
    }
    .separtor {
      margin-left: 10px;
    }
    .select {
      width: inherit;
      /deep/ .boo-select-selection {
        border: none;
        height: auto;
        background: transparent;
      }
    }
  }
</style>
