<template>
  <TooltipBtn
    v-bind="$attrs"
    v-on="$listeners"
    :disabled="disabled"
    :btnTheme="type"
    desc="总部不允许分店使用此功能，如有疑问请您联系贵公司的总部工作人员"
    :havePermission="havePermission"
    :style="!havePermission && isNativeTag && { filter: !notNeededGray ? 'grayscale(1)' : '', cursor: 'not-allowed' }"
  >
    <slot></slot>
    <div v-if="!havePermission" style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; background-color: transparent; cursor: not-allowed;" @click.stop></div>
  </TooltipBtn>
</template>

<script>
  import TooltipBtn from '@components/tooltip-btn'
  import { getPermission } from '@/views/components/permission-bth/util'

  export default {
    name: 'PermissionBtn',
    components: { TooltipBtn },
    props: {
      btnType: String,
      disabled: Boolean,
      isNativeTag: {
        type: Boolean,
        default: false
      },
      notNeededGray: {
        type: Boolean,
        default: false
      },
      needPermission: Boolean,
      type: String
    },
    data () {
      return {
        havePermission: true
      }
    },
    async created () {
      // 不需要权限校验的，默认拥有权限
      this.havePermission = !this.needPermission || await getPermission(this.btnType)
    }
  }
</script>

<style scoped>

</style>
