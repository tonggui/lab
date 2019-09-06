<template>
  <div class="diff-item">
    <div class="item-container">
      <div class="label">{{config.label}}</div>
      <div class="item">
        <component :is="config.component" :value="oldVal" />
      </div>
    </div>
    <div class="item-container">
      <div class="label">变更为</div>
      <div class="item">
        <component :is="config.component" :value="newVal" />
      </div>
    </div>
  </div>
</template>

<script>
  import configMap from './map'
  export default {
    name: 'DiffItem',
    props: {
      context: {
        type: Object,
        default: () => {}
      },
      type: String,
      oldValue: [String, Number, Array, Object],
      newValue: [String, Number, Array, Object]
    },
    computed: {
      config () {
        return configMap[this.type]
      },
      newVal () {
        if (this.config && this.config.convertor) {
          return this.config.convertor(this.newValue, this.context)
        }
        return this.newValue
      },
      oldVal () {
        if (this.config && this.config.convertor) {
          return this.config.convertor(this.oldValue, this.context)
        }
        return this.oldValue
      }
    }
  }
</script>

<style scoped lang="less">
  .diff-item {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    .item-container {
      flex: 1;
      display: flex;
      margin: 8px 0;
      line-height: 1.4;
    }
    .label {
      color: @text-description-color;
      margin-right: 10px;
      min-width: 60px;
      text-align: right;
    }
    .item {
      flex: 1;
      margin-right: 5px;
    }
  }
</style>
