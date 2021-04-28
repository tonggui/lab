<template>
  <TooltipBtn
    v-bind="$attrs"
    v-on="$listeners"
    :disabled="disabled"
    desc="总部不允许分店使用此功能，如有疑问请您联系贵公司的总部工作人员"
    :havePermission="havePermission"
  >
    <slot></slot>
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
      disabled: Boolean
    },
    data () {
      return {
        havePermission: true
      }
    },
    async created () {
      this.havePermission = await getPermission(this.btnType)
    }
  }
</script>

<style scoped>

</style>
