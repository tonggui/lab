<template>
  <Cascader
    v-bind="$attrs"
    v-on="$listeners"
    :source="undefined"
  />
</template>

<script>
  // TODO 实现品牌申报
  import Cascader from './cascader'
  export default {
    name: 'CategoryAttributeBrand',
    components: {
      Cascader
    }
  }
</script>
