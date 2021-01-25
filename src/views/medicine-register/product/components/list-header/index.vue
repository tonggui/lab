<template>
  <div class="header">
    <div class="m-title">疫情药品设置</div>
    <Alert class="tip warning" type="warning">
      <a :href="link" target="_blank">疫情药品配置须知</a>
    </Alert>
    <NavigatorBar />
  </div>
</template>
<script>
  import NavigatorBar from './components/navigator-bar'
  import { MEDICIN_REGISTER_ALERT_URL } from '@/data/constants/medicine/register'
  export default {
    name: 'medicine-register-list-header',
    components: {
      NavigatorBar
    },
    computed: {
      link () {
        return MEDICIN_REGISTER_ALERT_URL
      }
    }
  }
</script>
<style lang="less" scoped>
  .header {
    margin-bottom: 10px;
  }
  .m-title {
    display: flex;
    justify-content: space-between;
    color: @text-color-secondary;
    margin: 10px 0;
  }
</style>
