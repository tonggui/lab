<template>
   <footer class="footer">
     <slot></slot>
  </footer>
</template>

<script>
  export default {
    name: 'step-foot'
  }
</script>

<style lang="less" scoped>
  .footer {
    width: 100%;
    height: 56px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 30px;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1;
    background: #FFFFFF;
    box-shadow: 0 -4px 5px 0 #F7F8FA;
    border-radius: 0 0 2px 2px;
    .left-btn {
      margin-right: 16px;
    }
  }
</style>
