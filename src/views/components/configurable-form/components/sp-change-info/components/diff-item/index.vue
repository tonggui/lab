<template>
  <div class="diff-item" v-if="config">
    <div class="item-container">
      <div class="label">{{name}}</div>
      <div class="item">
        <component :is="config.diffComponent" :value="oldVal" v-bind="props" :disabled="attrType" />
      </div>
    </div>
    <div class="item-container">
      <div class="label">变更为</div>
      <div class="item">
        <component :is="config.diffComponent" :value="newVal" v-bind="props" :disabled="attrType" />
      </div>
    </div>
  </div>
</template>

<script>
  import configMap, { categoryAttrMap } from '../map'
  import { RENDER_TYPE } from '@/data/enums/category'
  export default {
    name: 'DiffItem',
    props: {
      context: {
        type: Object,
        default: () => {}
      },
      type: [String, Number]
    },
    computed: {
      attrType () {
        return Object.keys(RENDER_TYPE).filter(x => RENDER_TYPE[x]).includes(this.type)
      },
      config () {
        return this.attrType ? categoryAttrMap[this.type] : configMap[this.type]
      },
      name () {
        return this.attrType ? this.context.name : this.config.label
      },
      props () {
        if (this.attrType && this.config && this.config.propsConvert) {
          return this.config.propsConvert(this.context)
        }
        return {}
      },
      newVal () {
        if (!this.attrType && this.config && this.config.display) {
          return this.config.display(this.context.newValue, this.context)
        }
        if (this.attrType && this.config && this.config.valueConvert) {
          return this.config.valueConvert(this.context.newValue, this.context)
        }
        return this.context.newValue
      },
      oldVal () {
        if (!this.attrType && this.config && this.config.display) {
          return this.config.display(this.context.oldValue, this.context)
        }
        if (this.attrType && this.config && this.config.valueConvert) {
          return this.config.valueConvert(this.context.oldValue, this.context)
        }
        return this.context.oldValue
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
      width: 80px;
      text-align: right;
      font-size: @font-size-small;
      line-height: 36px;
    }
    .item {
      flex: 1;
      margin-right: 5px;
      align-self: center;
    }
  }
</style>
