<template>
  <Drawer
    :width="631"
    :value="value"
    :mask-closable="false"
    closable
    @on-close="handleClose"
    class="product-selected-drawer-container"
  >
    <h2>已选商品({{ total }})</h2>
    <div style="margin-top: 20px; font-size: 14px">
      <span>
        按关联分店筛选
      </span>
      <Select label="按关联分店筛选" style="width:200px; margin:0px 10px" line
              v-model="currentScope.cityId"
              filterable clearable
              @on-change="handleSelectedCity" placeholder="Select your city">
        <Option v-for="item in scopeList" :value="item.cityId" :key="item.cityId" >{{item.cityName}}</Option>
      </Select>
      <Select style="width:200px" v-model="currentScope.poiId" :disabled="shopDisabled" placeholder="Select your shop" filterable clearable line>
        <Option v-for="item in shopList" :value="item.id" :key="item.id">{{item.name}}</Option>
      </Select>
    </div>
    <div class="header">
      <span class="content-span" style="width: 70%;">商品信息</span>
      <Divider type="vertical" />
      <span class="content-span" style="width: 20%;">关联分店</span>
      <Divider type="vertical" />
      <span class="content-span">操作</span>
    </div>
    <Icon type="closed" slot="close" color="#666" />
    <ul class="classify-table-list" v-if="value && showDataSourceList.length">
      <template v-for="item in showDataSourceList">
        <li
          v-if="item[1].productList.length"
          is="SelectedClassifyProductList"
          :key="item[0]"
          :title="item[1].name"
          :children="item[1].productList"
          @on-unselect="handleItemUnselect"
        />
      </template>
    </ul>
    <div v-else class="load-fail">
      加载失败，请点击<a href="#">重试</a>
    </div>
    <div slot="footer" class="classify-table-list-footer">
      <a class="empty-selected" @click.prevent="handleEmptySelected"
      >清空已选</a
      >
      <Button type="primary" @click="handleCreate" :disabled="total <= 0">确定创建</Button>
    </div>
  </Drawer>
</template>

<script>
  import SelectedClassifyProductList from '../components/selected-classify-product-list'
  import { helper } from '../../../store'
  import { covertObjectToSequenceArr } from '../../../utils'
  const { mapActions, mapState } = helper()

  export default {
    name: 'product-selected-drawer',
    props: {
      total: Number,
      value: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        shopDisabled: false,
        currentScope: {
          cityId: '',
          poiId: ''
        }
      }
    },
    computed: {
      ...mapState({
        currentScopeId: state => state.multiCubeList.currentScope,
        scopeList: state => state.multiCubeList.scopeList,
        currentPoiIds: state => state.multiCubeList.currentPoiIds,
        dataSourceList: 'classifySelectedProducts'
      }),
      showDataSourceList () {
        return covertObjectToSequenceArr(this.dataSourceList)
      },
      shopList () {
        let tmp = this.scopeList.filter(item => {
          if (item.cityId === this.currentScope.cityId) {
            return item.poiList
          }
        })
        return tmp && tmp[0] ? tmp[0].poiList : []
      }
    },
    components: {
      SelectedClassifyProductList
    },
    watch: {
      total (val) {
        if (val <= 0) this.handleClose()
      },
      'currentScope.cityId': {
        immediate: true,
        handler (v) {
          if (typeof v === 'undefined') {
            this.shopDisabled = true
          } else this.shopDisabled = false
        }
      },
      'currentScopeId.cityId': {
        immediate: true,
        handler (v) {
          if (v !== '' && typeof v !== 'undefined') {
            this.currentScope = {
              cityId: this.currentScopeId.cityId,
              poiId: this.currentScopeId.poiId
            }
          }
        }
      }
    },
    methods: {
      ...mapActions(['deSelectProduct', 'clearSelected']),
      handleSelectedCity (v) {
        console.log(v)
      },
      handleClose () {
        this.$emit('on-drawer-close')
      },
      handleItemUnselect (title, item) {
        this.deSelectProduct([item])
      },
      handleEmptySelected () {
        this.$Modal.open({
          closable: true,
          centerLayout: true,
          maskClosable: false,
          width: 377,
          okText: '确定',
          renderHeader: () => {
            return (
              <div class="selected-drawer-async-confirm-header">
                确定清空已选商品
              </div>
            )
          },
          render: h => {
            return (
              <div class="selected-drawer-async-confirm-content">
                清空后，需要重新选择，确定清空当前所有已选商品？
              </div>
            )
          },
          onOk: () => {
            this.clearSelected()
            this.handleClose()
          }
        })
      },
      handleCreate () {
        if (this.total > 0) this.$emit('on-click-create')
      }
    }
  }
</script>

<style lang="less" scoped>
.product-selected-drawer-container {
  overflow: hidden;
  /deep/ .drawer-content.with-footer {
    padding-bottom: 58px;
  }
  .header {
    margin-top: 20px;
    height: 42px;
    background: #F7F8FA;
    border: 1px solid #E9EAF2;
    font-size: 14px;
    color: #A2A4B3;
    letter-spacing: 0;
    line-height: 42px;
    padding-left: 14px;
    font-family: PingFangSC-Regular;
    .content-span{
      display: inline-block;
    }
    .boo-divider, .boo-divider-vertical {
      display: inline-block;
      height: 3.1em;
      margin: 0;
    }
  }
  .classify-table-list {
    list-style: none;
    border-top: 1px solid #e9eaf2;
    height: calc(100% - 49px);
    overflow: auto;
  }
  .load-fail {
    display: flex;
    height: calc(100% - 49px);
    align-items: center;
    justify-content: center;
  }
  /deep/ .drawer-footer {
    justify-content: center;
  }
  .classify-table-list-footer {
    .empty-selected {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #676a78;
      line-height: 14px;
      text-decoration: underline;
      margin-right: 16px;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
.selected-drawer-async-confirm {
  &-header {
    text-align: center;
    font-family: PingFangSC-Medium;
    font-size: 20px;
    color: #36394d;
    text-align: center;
    line-height: 20px;
    border-bottom: 1px solid #e8e8e8;
    padding-bottom: 18px;
  }
  &-content {
    font-size: 14px;
    color: #36394d;
    line-height: 22px;
  }
}
</style>
