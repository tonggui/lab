<template>
  <div class="data-list-container" ref="data-list">
    <Loading v-if="loading" />
    <Empty v-if="!loading && !list.length"/>
    <Scroll :on-reach-bottom="handleReachBottom" :height="scrollHeight" class="scroll" v-else>
      <Card class="card-style searching" v-show="searching">
        搜索结果({{list.length}})
      </Card>
      <Card dis-hover v-for="item in list" :key="item.id" class="card-style">
        <Checkbox
          :key="item.id"
          @on-change="handleCheckBoxChange($event, item)"
          :value="isItemSelected(item)"
        />
        <ProductInfo :product="item" :searching="searching" />
      </Card>
    </Scroll>
  </div>
</template>

<script>
  import { helper } from '../../../store'
  import { get } from 'lodash'
  import ProductInfo from '../../../components/product-info'
  import { isProductSelect } from './model'
  import Loading from '@components/loading'

  const { mapState, mapActions } = helper('productList')

  export default {
    name: 'data-list',
    props: {
      selectedIdList: {
        type: Array,
        default: () => []
      },
      searching: {
        type: String,
        default: ''
      },
      checkBoxList: Object,
      tag: Object
    },
    data () {
      return {
        scrollHeight: 0,
        checkBox: this.checkBoxList || {}
      }
    },
    watch: {
      checkBoxList: {
        deep: true,
        handler (val) {
          this.checkBox = val
        }
      }
    },
    components: {
      ProductInfo,
      Loading
    },
    methods: {
      ...mapActions({
        handlePageChange: 'pageChange'
      }),
      isItemSelected (item) {
        return isProductSelect(item, this.tag, this.checkBox)
      },
      handleReachBottom () {
        if (this.list.length < this.pagination.total) {
          const pagination = this.pagination
          pagination.current = ++pagination.current
          this.handlePageChange(pagination)
        }
      },
      handleCheckBoxChange (checked, item) {
        checked ? this.$emit('on-select-product', [item]) : this.$emit('on-deselect-product', [item])
      }
    },
    computed: {
      ...mapState(['productCount', 'expandList', 'loading', 'error', 'list', 'pagination'])
    },
    mounted () {
      this.scrollHeight = get(this.$refs['data-list'], 'clientHeight') || 500
    }
  }
</script>

<style lang="less" scoped>
.data-list-container {
  flex: 1;
  border: 1px solid #EEE;
  border-left: none;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /deep/ .boo-scroll-wrapper .boo-scroll-container .boo-scroll-loader {
    height: 0;
  }
  .scroll {
    margin: 0;
  }
  .card-style {
    border: none;
    /deep/ .boo-card-body {
      display: flex;
      align-items: center;
      padding-bottom: 4px;
    }
    &.searching {
      font-size: 12px;
      color: #666666;
    }
  }
}
</style>
