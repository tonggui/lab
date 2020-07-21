<template>
  <component class="footer" :is="component" :offset-bottom="offsetBottom">
    <slot></slot>
  </component>
</template>
<script>
  export default {
    name: 'form-footer',
    props: {
      sticky: Boolean,
      offsetBottom: {
        type: Number,
        default: 0
      }
    },
    computed: {
      component () {
        return this.sticky ? 'Affix' : 'div'
      }
    }
  }
</script>
<style lang="less" scoped>
  .footer {
    &,
    /deep/ .boo-affix {
      height: 56px;
      padding: 0 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #fff;
      box-shadow: 0 -4px 5px 0 #f7f8fa;
      border-radius: 2px;
    }

    /deep/ .boo-affix {
      margin: 0 auto;
    }

    /deep/ .boo-btn {
      height: 36px;
      min-width: 90px;
      margin-right: 10px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
</style>
