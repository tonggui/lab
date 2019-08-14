<template>
  <div class="choose-product">
    <Tabs v-model="tabValue" :animated="false">
      <TabPane :label="(h) => renderLabel(h, true)" name="upc">
        <Tooltip placement="right" always :content="error" :disabled="!error">
          <Input
            style="width:460px"
            v-model="val"
            clearable
            :disabled="disabled"
            :placeholder="placeholder"
            @on-change="handleChange"
            @on-focus="handleFocusEvent"
            @on-blur="handleBlurEvent"
            @on-keyup.enter="triggerSearch"
          >
            <Icon slot="suffix" local="with-upc-1" class="boo-input-icon-scan" />
          </Input>
        </Tooltip>
      </TabPane>
      <TabPane :label="(h) => renderLabel(h, false)" name="noUpc">
        <div class="no-upc-content">
          <Button type="primary" @click="modalVisible = true">从商品库选择</Button>
          通过商品库可快速获取商品信息（标题、图片、属性等）
          <Modal
            class="sp-list-modal"
            v-model="modalVisible"
            title="商品库"
            footer-hide
            width="80%"
            minWidth="600"
          >
            <SpList
              :batch="batch"
              v-onlyone="modalVisible"
              modal
              @on-select-product="triggerSelectProduct"
            />
          </Modal>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
  import SpList from '@/views/components/sp-list'
  import onlyone from '@/directives/onlyone'
  import withOnlyone from '@/hoc/withOnlyone'
  import layerTableResizeMixin from '@/mixins/layerTableResize'
  import { fetchGetSpInfoByUpc } from '@/data/repos/standardProduct'
  import Icon from '@/components/icon/icon'

  const UPC_NOT_FOUND_FAIL = '条码暂未收录，请直接录入商品信息'
  export default {
    name: 'ChooseProduct',
    mixins: [layerTableResizeMixin],
    components: {
      SpList: withOnlyone(SpList)
    },
    directives: { onlyone },
    props: {
      batch: {
        type: Boolean,
        default: false
      },
      noUpc: Boolean,
      value: String,
      disabled: Boolean,
      placeholder: {
        type: String,
        default: '输入商品条码可快速从商品库获取商品信息（标题、图片、属性等）'
      }
    },
    data () {
      return {
        val: this.value,
        tabValue: 'upc',
        error: null,
        modalVisible: false
      }
    },
    watch: {
      modalVisible (v) {
        this.tableResize(v)
      },
      noUpc: {
        immediate: true,
        handler (noUpc) {
          this.tabValue = noUpc ? 'noUpc' : 'upc'
        }
      },
      value (value) {
        this.val = value
      },
      val () {
        this.error = null
      }
    },
    methods: {
      renderLabel (h, isUpc) {
        const text = isUpc ? '条码商品' : '无条码商品'
        const type = isUpc ? 'with-upc' : 'without-upc'
        const active = this.tabValue === 'upc' ? isUpc : !isUpc
        return (
          <span style={{ fontWeight: active ? 'bold' : 'normal' }}>
            <Icon style={{ color: active ? '#F89800' : '#585A6E' }} local={type} />
            <span style="vertical-align: middle">{ text }</span>
          </span>
        )
      },
      handleChange (event) {
        this.val = event.target.value
        this.$emit('input', this.val)
        this.$emit('on-change', this.val)
      },
      triggerSearch () {
        const upcCode = this.val
        // 如果和缓存的最后一次查询结果相同，避免请求
        if (this.lastSearchUpc === upcCode) return
        this.lastSearchUpc = upcCode
        // 如果为空，避免请求
        if (!upcCode) return
        return fetchGetSpInfoByUpc(upcCode)
          .then(product => {
            this.error = null
            this.triggerSelectProduct(product)
          })
          .catch(err => {
            let error = null

            if (err.code === 6000) {
              error = UPC_NOT_FOUND_FAIL
            } else if (err.code === 6001) {
              error = err.message
            } else {
              // 未知错误场景下，清空选择状态，支持下次查询
              this.lastSearchUpc = ''
            }
            this.error = error
          })
      },
      triggerSelectProduct (product) {
        this.modalVisible = false
        if (product && product.isSp) {
          this.tabValue = 'upc'
        }
        this.$emit('on-select-product', product)
      },
      // 记录foucs之前的value，避免未修改value导致的第一次默认查询，容易修改类目属性的信息
      handleFocusEvent () {
        this.preValue = this.val
      },
      handleBlurEvent () {
        if (this.val !== this.preValue) {
          this.triggerSearch()
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .choose-product {
    /deep/ .boo-tabs-bar {
      margin-bottom: 20px;
    }
  }
  .no-upc-content {
    height: 36px;
    display: flex;
    align-items: center;
    color: @text-tip-color;

    .boo-btn {
      margin-right: 12px;
    }
  }

  .boo-input-icon-scan {
    font-size: @font-size-base;
    height: 36px;
  }

  .sp-list-modal {
    /deep/ .boo-modal-body {
      padding: 20px;
    }
  }
</style>
