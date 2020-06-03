<template>
  <div class="alert-tip-container">
    <Alert
      class="alert"
      :show-icon="showIcon"
      :banner="fixed"
      :type="type"
      :closable="closable"
      @on-close="handleClose"
    >
      <div class="content">
        <slot></slot>
        <RouteLink tag="a" v-if="link && operationText" :to="link">{{ operationText }}</RouteLink>
      </div>
      <Icon v-if="!!icon" slot="icon" :type="icon"></Icon>
    </Alert>
  </div>
</template>
<script>
  import RouteLink from '@components/link/link'

  export default {
    name: 'alert-tip',
    props: {
      showIcon: {
        type: Boolean,
        default: true
      },
      fixed: Boolean,
      type: {
        type: String,
        default: 'warning',
        validator: function (value) {
          return ['warning', 'success', 'error'].indexOf(value) !== -1
        }
      },
      closable: {
        type: Boolean,
        default: false
      },
      operationText: String,
      link: [String, Object],
      icon: {
        type: String,
        default: ''
      }
    },
    components: {
      RouteLink
    },
    methods: {
      handleClose () {
        this.$emit('close')
      }
    }
  }
</script>
<style lang="less" scoped>
.alert-tip-container {
  background: @component-bg;
}
.content a {
  margin-left: 20px;
  color: @link-color;
  &:hover {
    color: @link-hover-color;
  }
}
</style>
