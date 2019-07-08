<template>
  <Tabs v-model="tabValue" :animated="false">
    <TabPane label="条码商品" name="upc">
      <Tooltip placement="right" always :content="error" :disabled="!error">
        <Input
          v-model="val"
          clearable
          placeholder="输入商品条码可快速从商品库获取商品信息（标题、图片、属性等）"
          @change="handleChange"
          @blur="handleSearch"
          @keyup.enter="handleSearch"
        >
          <Icon slot="suffix" local="with-upc-1" class="boo-input-icon-scan"/>
        </Input>
      </Tooltip>
    </TabPane>
    <TabPane label="无条码商品" name="noUpc">
      <div class="no-upc-content">
        <Button type="primary">从商品库选择</Button>
        通过商品库可快速获取商品信息（标题、图片、属性等）
      </div>
    </TabPane>
  </Tabs>
</template>

<script>
import { fetchGetSpInfoByUpc } from '@/data/repos/standardProduct'
export default {
  name: 'ChooseProduct',
  props: {
    hasUpc: Boolean,
    value: String
  },
  data () {
    return {
      val: this.value,
      tabValue: 'upc',
      error: null
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
    handleSearch () {
      return fetchGetSpInfoByUpc(this.val)
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
