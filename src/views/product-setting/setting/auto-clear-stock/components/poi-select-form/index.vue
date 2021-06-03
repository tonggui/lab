<template>
  <div class="sample-container">
    <div key="poiList" :gutter="20" class="row-style">
      <div class="col-style">
        <div>选择关联门店</div>
      </div>
      <div>
        <PoiSelect
          :value="[...data]"
          @data-change="handleDataChange(arguments[0], 'poiList', arguments[1])"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { isFunction } from 'lodash'
  import PoiSelect from './poi-select'

  import storage, { KEYS } from '@/common/local-storage'
  export default {
    name: 'poi-select-form',
    components: {
      PoiSelect
    },
    props: {
      data: {
        type: Object,
        default: () => []
      },
      configs: {
        type: Array,
        default: () => [],
        required: true
      }
    },
    methods: {
      computedValue (tip) {
        if (!tip) return
        const { type, keyName, ...left } = tip
        return keyName && storage[KEYS[keyName]] ? left : tip
      },
      showComponent (show) {
        return isFunction(show) ? show(this.data) : show
      },
      handleDataChange (data, key, mykey) {
        this.$emit('data-change', mykey || key, data)
      },
      handleData (data) {
        return isFunction(data) ? data(this.data) : data
      },
      handleValidate () {
        let error = false
        for (let i = 0; i < this.configs.length; i++) {
          const item = this.configs[i]
          const validator = item.validator
          if (!validator || !isFunction(validator)) return
          const res = item.validator(this.data)
          if (typeof res === 'string') {
            this.$Message.error(res)
            error = true
            break
          }
        }
        return error
      }
    }
  }
</script>

<style lang="less" scoped>
  .sample-container {
    padding: 10px 20px 5px;
    /deep/ .boo-radio-wrapper {
      margin-right: 20px;
    }
    .row-style {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
    }
    .col-style {
      padding-right: 10px;
      width: 150px;
    }
  }
</style>
