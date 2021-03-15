<template>
  <div>
    <template v-for="config in configs">
      <Row :key="config.id" v-if="showComponent(config.show)">
        <Col span="4">
          <div v-if="config.label">{{config.label}}</div>
          <div v-else style="visibility: hidden">&nbsp;</div>
        </Col>
        <Col span="20">
          <template v-if="!config.component && config.data">
            <RadioGroup v-model="data[config.id]" @on-change="handleDataChange($event, config.id)">
              <Radio :label="label.label" v-for="label in config.data" :key="label.label">
                <span>{{label.name}}</span>
                <Tooltip v-if="label.tip" transfer :content="label.tip" max-width="300px" placement="top">
                  <Icon type="help-outline" />
                </Tooltip>
              </Radio>
            </RadioGroup>
          </template>
          <component
            :is="config.component"
            v-bind="handleData(config.data)"
            @data-change="handleDataChange($event, config.id)"
          />
        </Col>
      </Row>
    </template>
  </div>
</template>

<script>
  // import Configs from './step-product-config'
  import { isFunction } from 'lodash'
  export default {
    name: 'light-form',
    // data () {
    //   return {
    //     configs: Configs
    //   }
    // },
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
      showComponent (show) {
        return isFunction(show) ? show(this.data) : show
      },
      handleDataChange (data, key) {
        console.log('这里变了', data, key)
        this.$emit('data-change', key, data)
      },
      handleData (data) {
        console.log('这里的的data', this.data)
        return isFunction(data) ? data(this.data) : data
      }
    }
  }
</script>

<style lang="less" scoped>
</style>
