<template functional>
  <Spin size="large" fix v-if="props.loading">
    <Icon type="loading" size=18 class="demo-spin-icon-load"></Icon>
    <div><slot>Loading</slot></div>
  </Spin>
</template>
