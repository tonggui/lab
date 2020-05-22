<template>
  <div class="double-columns-table-list-container">
    <slot name="header" />
    <ul class="double-columns-table-list">
      <li v-for="item in dataSource" :key="item.key">
        {{item.name}}
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'double-columns-table-list',
    props: {
      dataSource: {
        type: Array,
        default: () => ([])
      }
    },
    data () {
      return {
      }
    }
  }
</script>

<style lang="less" scoped>
  .double-columns-table-list-container {
    .double-columns-table-list {
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
  }
</style>
