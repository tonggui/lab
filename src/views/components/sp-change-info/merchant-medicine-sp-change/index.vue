<template>
  <Modal
    title="字段更新提示"
    :value="value"
    @on-cancel="handleCancel"
    width="700"
  >
    <div class="sp-change-content">
        <SpChangeInfo
          v-for="item in products" :key="item.id"
          :changes="item"
          :product="item.product"
        ></SpChangeInfo>
        <Pagination
          className="sp-change-pagination"
          :pagination="pagination"
          @on-change="handlePageChange"
        />
    </div>
    <div
      class="sp-change-footer"
      slot="footer"
    >
      <Button @click="handleCancel">暂不替换</Button>
      <Button type="primary" @click="handleConfirm(1)">同意替换</Button>
    </div>
  </Modal>
</template>

<script>
  import SpChangeInfo from './sp-change-info'
  import Pagination from '@/components/pagination'

  export default {
    name: 'MedicineSpChangeInfoModal',
    components: { SpChangeInfo, Pagination },
    props: {
      products: {
        type: Array,
        default: () => [{
          changeProductDetailVo: {},
          changDetailVo: {}
        }]
      },
      pagination: {
        type: Object,
        default: () => ({})
      },
      value: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
      }
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    methods: {
      handleConfirm (type = 3) {
        this.$emit('confirm', this.product)
      },
      handleCancel () {
        // this.handleConfirm(3)
        this.$emit('change', false)
      },
      handlePageChange (...args) {
        this.$emit('page-change', ...args)
      }
    }
  }
</script>

<style scoped lang="less">
  .sp-change-content {
    max-height: 600px;
    overflow: auto;
  }
  .sp-change-footer {
    .boo-btn {
      margin-left: 10px;
    }
  }
  .title {
    margin: 6px 0;
    font-weight: normal;
    font-size: @font-size-base;
    color: @text-color;
  }
  .diffs {
    background: #F7F8FA;
    padding: 10px;
  }
</style>
<style lang="less">
  .sp-change-pagination {
    text-align: right;
  }
</style>
