<template>
  <div class="definition">
    <div class="title" @click="toggleDefinition">{{ title }}</div>
    <div :class="['desc', { 'folded': folded && !disabled }]"><slot></slot></div>
  </div>
</template>

<script>
  export default {
    name: 'definition',
    props: {
      title: { // 定义的名称、title
        type: String,
        required: true
      },
      disabled: { // 是否禁止点击title，展示/收起内容
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        folded: true // 解释是否收起
      }
    },
    methods: {
      toggleDefinition () {
        if (this.disabled) return
        this.folded = !this.folded
      }
    }
  }
</script>

<style lang='less' scoped>
.definition {
  .title {
    font-weight: bold;
    padding-left: 4px;
    border-left: 4px solid @highlight-color;
    margin: 1em 1em 1em 0;
    cursor: pointer;
  }
  .desc {
    font-weight: normal;
    margin: 1em;
    &.folded {
      display: none;
    }
  }
}
</style>
