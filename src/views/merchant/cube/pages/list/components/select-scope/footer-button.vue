<template>
  <div class="footer-button">
    <Button type="text" class="foot-btn-cancel" size="large" @click="$emit('cancel')">取消</Button>
    <Button type="primary" class="foot-btn-confirm" size="large" @click="$emit('confirm')">确定</Button>
  </div>
</template>

<script>
  export default {
    name: 'footer-button'
  }
</script>

<style lang="less"  scoped>
.footer-button{
  line-height: 25px;
  font-weight: normal;
  color: #222222;
  .foot-btn-cancel{
    border-color: #666666;
    border-radius: 25px;
    font-size: 14px !important;
  }
  .foot-btn-confirm{
    font-size: 14px !important;
    color: #222222;
    border-color: antiquewhite;
    background-image: linear-gradient(-45deg, #FFC34D 0%, #FFE14D 100%);
    border-radius: 25px;
  }
}
</style>
