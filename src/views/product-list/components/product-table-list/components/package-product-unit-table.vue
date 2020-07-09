<template>
  <Table
    :columns="columns"
    :data="source"
    v-bind="$attrs"
  />
</template>

<script>
  export default {
    name: 'PackageProductUnitTable',
    props: {
      source: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      columns () {
        return [
          {
            title: '商品名称',
            key: 'name',
            align: 'center',
            minWidth: 200
          },
          {
            title: '规格名称',
            key: 'spec',
            align: 'center',
            minWidth: 180
          },
          {
            title: '库存',
            key: 'stock',
            align: 'center',
            width: 100,
            render: (h, { row }) => {
              return (
                <span>{row.stock === -1 ? '无限' : row.stock}</span>
              )
            }
          }
        ]
      }
    }
  }
</script>
