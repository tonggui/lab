<script>
import omit from 'lodash/omit'
import CategoryTree from './category-tree'
import SortCategoryTree from './sort-category-tree'
export default {
  name: 'category-tree-index',
  props: {
    sorting: {
      required: true,
      type: Boolean
    }
  },
  components: {
    CategoryTree,
    SortCategoryTree
  },
  render (h) {
    const { sorting } = this.$options.propsData
    const props = omit(this.$options.propsData, 'sorting')
    return sorting
      ? h('sort-category-tree', {
        props,
        on: this.$listeners
      })
      : h('category-tree', {
        props,
        on: this.$listeners
      })
  }
}
</script>

<style scoped></style>
