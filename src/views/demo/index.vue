<template>
  <div id="demo">
    <AuditProcess
      status="wait"
      :current="1"
      :steps="steps"
    />
    <router-view />
  </div>
</template>

<script>
  import AuditProcess from '@/components/audit-process'
  export default {
    name: 'demo',
    components: {
      AuditProcess
    },
    data () {
      return {
        steps: [
          {
            title: '第一审核人',
            content: '审核中'
          },
          {
            title: '第二审核人',
            content: '等待审核'
          },
          {
            title: '商品审核成功'
          }
        ]
      }
    }
  }
</script>

<style scoped lang="less">
  h1 {
    color: #999;
  }
</style>
