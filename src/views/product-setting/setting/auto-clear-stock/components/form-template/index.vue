<template>
  <div class="sample-container">
    <template v-for="config in configs">
      <div :key="config.id" v-if="showComponent(config.show)" :gutter="20" class="row-style">
        <div class="col-style">
          <div v-if="config.label">{{config.label}}</div>
          <div v-else style="visibility: hidden">&nbsp;</div>
        </div>
        <div>
          <template v-if="!config.component && config.data">
            <RadioGroup v-model="data[config.id]" @on-change="handleDataChange($event, config.id)">
              <Radio :label="label.label" v-for="label in config.data" :key="label.label">
                <span>{{label.name}}</span>
                <Tooltip v-if="label.tip" v-bind="computedValue(label.tip)">
                  <Icon type="help-outline" />
                </Tooltip>
              </Radio>
            </RadioGroup>
          </template>
          <component
            :is="config.component"
            v-bind="handleData(config.data)"
            @data-change="handleDataChange(arguments[0], config.id, arguments[1])"
          />
        </div>
      </div>
    </template>
    <slot v-bind:handleValidate="handleValidate"></slot>
  </div>
</template>

<script>
  import { isFunction } from 'lodash'
  import storage, { KEYS } from '@/common/local-storage'
  export default {
    name: 'light-form',
    props: {
      data: {
        type: Object,
        default: () => {}
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
        console.log('data', this.data)
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
