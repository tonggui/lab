<template>
  <TooltipBtn
    v-bind="$attrs"
    v-on="$listeners"
    desc="总部不允许分店使用此功能，如有疑问请您联系贵公司的总部工作人员"
    :havePermission="havePermission"
  >
    <slot>新建</slot>
  </TooltipBtn>
</template>

<script>
  import TooltipBtn from '@components/tooltip-btn'
  import { PERMISSION_TYPE_MAP } from '@/views/components/permission-bth/const'

  export default {
    name: 'PermissionBtn',
    components: { TooltipBtn },
    props: {
      btnType: String,
      permissionIdList: Array
    },
    computed: {
      havePermission () {
        return this.permissionIdList && this.permissionIdList.includes(PERMISSION_TYPE_MAP[this.btnType])
      }
    }
  }
</script>

<style scoped>

</style>
