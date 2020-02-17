<template>
  <div class="sku-weight">
    <Tooltip type="guide" content="重量超过10kg，请核实" placement="top-start" :max-width="300" :disabled="this.value.ignoreMax || !overflow">
      <InputSelectGroup
        v-bind="$attrs"
        :value="value"
        @input="handleInput"
      />
      <a class="ignore" slot="operation" @click.prevent="ignore">重量无误</a>
    </Tooltip>
  </div>
</template>

<script>
  import InputSelectGroup from '@components/input-select-group'
  import { weightOverflow } from '../../../../validate'

  export default {
    name: 'sku-weight',
    props: {
      value: Object
    },
    components: { InputSelectGroup },
    computed: {
      overflow () {
        return weightOverflow(this.value)
      }
    },
    methods: {
      handleInput (v) {
        this.$emit('input', v)
      },
      ignore () {
        this.handleInput({
          ...this.value,
          ignoreMax: true
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .ignore {
    display: inline-block;
    margin-top: 2px;
  }
</style>
