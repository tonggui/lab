<template>
  <div class="diff-item" v-if="config">
    <div class="item-container">
      <div class="label">{{ data.name }}</div>
      <div class="item">
        <component :is="config.diffComponent" :value="oldVal" v-bind="props" disabled />
      </div>
    </div>
    <div class="item-container">
      <div class="label">变更为</div>
      <div class="item">
        <component :is="config.diffComponent" :value="newVal" v-bind="props" disabled />
      </div>
    </div>
  </div>
</template>

<script>
  import { categoryAttrMap } from '../map'
  export default {
    name: 'CateogryAttrDiffItem',
    props: {
      data: {
        type: Object,
        required: true
      }
    },
    computed: {
      config () {
        return categoryAttrMap[this.data.render.type]
      },
      props () {
        if (this.config && this.config.propsConvert) {
          return this.config.propsConvert(this.data)
        }
        return {}
      },
      newVal () {
        if (this.config && this.config.valueConvert) {
          return this.config.valueConvert(this.data.newValue, this.data)
        }
        return this.data.newValue
      },
      oldVal () {
        if (this.config && this.config.valueConvert) {
          return this.config.valueConvert(this.data.oldValue, this.data)
        }
        return this.data.oldValue
      }
    }
  }
</script>

<style scoped lang="less">
  .diff-item {
    display: flex;
    flex-direction: row;
    .item-container {
      flex: 1;
      display: flex;
      margin: 8px 0;
      line-height: 1.4;
    }
    .label {
      color: @text-description-color;
      margin-right: 10px;
      width: 80px;
      text-align: right;
      font-size: @font-size-small;
      padding-top: 10px;
    }
    .item {
      flex: 1;
      margin-right: 5px;
    }
  }
</style>
