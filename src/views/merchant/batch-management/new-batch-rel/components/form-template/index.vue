<template>
  <div class="sample-container">
    <template v-for="config in configs">
      <Row :key="config.id" v-if="showComponent(config.show)" :gutter="20" class="row-style">
        <Col span="5" class="col-style">
          <div v-if="config.label">{{config.label}}</div>
          <div v-else style="visibility: hidden">&nbsp;</div>
        </Col>
        <Col span="19">
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
    <slot></slot>
  </div>
</template>

<script>
  import { isFunction } from 'lodash'
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
      showComponent (show) {
        return isFunction(show) ? show(this.data) : show
      },
      handleDataChange (data, key) {
        this.$emit('data-change', key, data)
      },
      handleData (data) {
        return isFunction(data) ? data(this.data) : data
      }
    }
  }
</script>

<style lang="less" scoped>
  .sample-container {
    .row-style {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
    }
    .col-style {
      text-align: right;
    }
  }
</style>
