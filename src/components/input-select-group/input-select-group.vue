<template>
  <div class="container">
    <component v-bind="$attrs" :disabled="disabled" :value="inputValue" @on-change="handleInputChange" class="input" :is="inputComponent" />
    <span class="separtor" v-if="separtor">{{ separtor }}</span>
    <Select :disabled="disabled" transfer :value="selectValue" @on-change="handleSelectChange" class="select">
      <Option v-for="item in options" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
  </div>
</template>
<script>
  export default {
    name: 'input-select-group',
    props: {
      value: Object,
      inputType: {
        type: String,
        default: 'string',
        validator: (v) => ['string', 'number'].includes(v)
      },
      inputKey: {
        type: String,
        required: true
      },
      selectKey: {
        type: String,
        required: true
      },
      options: Array,
      separtor: String,
      disabled: Boolean
    },
    computed: {
      inputValue () {
        return this.value[this.inputKey]
      },
      selectValue () {
        return this.value[this.selectKey]
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
      }
    }
  }
</script>
<style lang="less" scoped>
  .container {
    display: flex;
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
        background: transparent;
      }
    }
  }
</style>
