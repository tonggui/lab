<template>
  <ul class="double-columns-table-list-container">
    <li v-for="item in source" :key="item.name">
      {{item.name}}
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'double-columns-table-list',
    data () {
      return {
        source: [{
          name: '1'
        }, {
          name: '2'
        }, {
          name: '3'
        }]
      }
    }
  }
</script>

<style lang="less" scoped>
  .double-columns-table-list-container {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    > li {
      width: 50%;
      height: 128px;
      border-bottom: 1px solid #F0F2F6;
      &:nth-child(n) {
        border-right: 1px solid #F0F2F6;
      }
    }
  }
</style>
