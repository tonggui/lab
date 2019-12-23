<template>
  <div>
    <p>多选级联 本地数据</p>
    <MultiCascade :data-source="dataSource" show-all />
    <p>多选级联 远程数据</p>
    <MultiCascade :data-source="async" :get-data="getData" show-all />
  </div>
</template>
<script>
  import MultiCascade from './multi-cascade-remote'

  export default {
    name: 'multi-cascade-demo',
    data () {
      return {
        dataSource: [{
          id: 1,
          name: '分类1',
          children: [{
            id: 11,
            name: '分类11',
            children: [{
              id: 111,
              name: '分类111',
              children: [{
                id: 1111,
                name: '分类1111'
              }]
            }, {
              id: 112,
              name: '分类112'
            }]
          }, {
            id: 12,
            name: '分类12'
          }, {
            id: 13,
            name: '分类13'
          }]
        }, {
          id: 2,
          name: '分类2'
        }],
        async: [{
          id: 1,
          name: '店内分类1',
          children: [{
            name: '店内分类11',
            id: 11,
            total: 10
          }]
        }, {
          id: 2,
          name: '店内分类2',
          total: 40
        }]
      }
    },
    methods: {
      async getData (index, { pageSize, current }) {
        const data = await new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              list: Array.from(Array(pageSize), (_i, i) => ({
                id: `product${i}`,
                name: `商品${i}`
              })),
              pagination: {
                pageSize,
                current,
                total: pageSize * (current + 1)
              }
            })
          }, 2000)
        })
        return data
      }
    },
    components: {
      MultiCascade
    }
  }
</script>
<style lang="less" scoped>

</style>
