<template>
  <div>
    <check-button
      v-for="option in optionSelf"
      :key="option.value"
      :size="size"
      :disabled="'disabled' in option ? option.disabled : disabled"
      :checked="valueSelf.indexOf(option.value) !== -1"
      @change="() => toggleOption(option)"
    >
      {{ option.label }}
    </check-button>
    <slot v-if="!optionSelf.length"></slot>
  </div>
</template>

<script>
  import CheckButton from './check-button'
  export default {
    props: {
      value: {
        type: Array,
        default: () => []
      },
      options: {
        required: true,
        type: Array
      },
      size: String,
      disabled: null
    },
    data () {
      return {
        valueSelf: [],
        optionSelf: []
      }
    },
    watch: {
      value: {
        immediate: true,
        handler (val) {
          this.valueSelf = val || []
        }
      },
      options: {
        immediate: true,
        handler (val) {
          this.optionSelf = val.map(option => {
            if (typeof option === 'string') {
              return {
                label: option,
                value: option
              }
            }
            return option
          })
        }
      }
    },
    methods: {
      toggleOption (option) {
        const optionIndex = this.valueSelf.indexOf(option.value)
        const value = [...this.valueSelf]
        if (optionIndex === -1) {
          value.push(option.value)
        } else {
          value.splice(optionIndex, 1)
        }
        if (!('value' in this.$options.propsData)) {
          this.valueSelf = value
          this.$forceUpdate()
        }
        this.$emit('change', value)
      }
    },
    components: {
      CheckButton
    }
  }
</script>
<style scoped lang="less">
.check-button-group {
  display: flex;
  flex-wrap: wrap;

  :global {
    .ant-btn {
      margin-right: 6px;
      margin-top: 6px;
    }
  }
}
</style>
