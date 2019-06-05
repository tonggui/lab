<template>
  <Spin size="large" class="loading">加载中...</Spin>
</template>

<script>
export default {
  name: 'loading',
  data () {}
}
</script>

<style scoped>
.loading {
  height: "100vh";
  display: "flex";
  flex-direction: "column";
  align-items: "center";
  justify-content: "center";
}
</style>
