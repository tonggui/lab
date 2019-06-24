<template>
  <div style="width: 200px; margin: 0 auto; position: relative;">
    <category-tree
      :onChange="onChange"
      :value="1"
      :fix="true"
      :dataSource="dataSource"
      :showAllButton="true"
      :totalProduct="10"
      :cateSetModalStatus="false"
      :setModalStatus="() => {}"
      :saveProductTag="() => {}"
      :deleteTag="() => {}"
      :deleteTagAndProduct="() => {}"
      :changeTagLevel="() => {}"
    >
      <div slot="header">header</div>
    </category-tree>
  </div>
</template>

<script>
import CategoryTree from './category-tree'
export default {
  name: 'category-tree-demo',
  data () {
    return {
      dataSource: [
        {
          id: 1,
          name: 'aaa',
          productCount: 10
        },
        {
          id: 2,
          name: 'bbb',
          productCount: 10,
          subTags: [
            {
              id: 21,
              name: 'bbbaaa',
              productCount: 10
            },
            {
              id: 22,
              name: 'bbbbbb',
              productCount: 10
            },
            {
              id: 23,
              name: 'bbbccc',
              productCount: 0
            }
          ]
        },
        {
          id: 3,
          name: 'ccc',
          productCount: 0
        }
      ]
    }
  },
  methods: {
    onChange () {}
  },
  components: {
    CategoryTree
  }
}
</script>

<style scoped></style>
