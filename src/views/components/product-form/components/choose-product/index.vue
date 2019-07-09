<template>
  <Tabs v-model="tabValue" :animated="false">
    <TabPane label="条码商品" name="upc">
      <Tooltip placement="right" always :content="error" :disabled="!error">
        <Input
          v-model="val"
          clearable
          placeholder="输入商品条码可快速从商品库获取商品信息（标题、图片、属性等）"
          @change="handleChange"
          @focus="handleFocusEvent"
          @blur="handleBlurEvent"
          @keyup.enter="triggerSearch"
        >
          <Icon slot="suffix" local="with-upc-1" class="boo-input-icon-scan"/>
        </Input>
      </Tooltip>
    </TabPane>
    <TabPane label="无条码商品" name="noUpc">
      <div class="no-upc-content">
        <Button type="primary" @click="modalVisible = true">从商品库选择</Button>
        通过商品库可快速获取商品信息（标题、图片、属性等）
        <Modal
          v-model="modalVisible"
          title="商品库"
          footer-hide
          width="80%"
          minWidth="600"
        >
          <SpList @on-select-product="triggerSelectProduct"/>
        </Modal>
      </div>
    </TabPane>
  </Tabs>
</template>

<script>
import SpList from '@/views/components/sp-list'
import { fetchGetSpInfoByUpc } from '@/data/repos/standardProduct'
const UPC_NOT_FOUND_FAIL = '条码暂未收录，请直接录入商品信息'
export default {
  name: 'ChooseProduct',
  components: {
    SpList
  },
  props: {
    hasUpc: Boolean,
    value: String
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
    hasUpc (hasUpc) {
      this.tabValue = hasUpc ? 'upc' : 'noUpc'
    },
    value (value) {
      this.val = value
    }
  },
  methods: {
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
  .no-upc-content {
    height: 36px;
    display: flex;
    align-items: center;
    color: @text-description-color;

    .boo-btn {
      margin-right: 12px;
    }
  }
  .boo-input-icon-scan {
    font-size: @font-size-base;
    height: 36px;
  }
</style>
