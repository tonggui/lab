<template>
  <Modal
    :title="title"
    :transfer="false"
    :value="visible"
    @on-cancel="handleHide"
  >
    <div class="product-info">
      <span class="picture"><img :src="picture" /></span>
      <span>{{ product.name }}</span>
    </div>
    <Table :columns="columns" :data="skuList" bordered />
    <div slot="footer">
      <Button type="primary" @click="handleHide">完成</Button>
    </div>
  </Modal>
</template>
<script>
  import defaultImage from '@/assets/icons/picture-broken.svg'
  import config from '../config'

  export default {
    name: 'product-sku-edit-modal',
    props: {
      felid: {
        type: [Number, String],
        required: true
      },
      product: {
        type: Object,
        required: true
      },
      skuList: {
        type: Array,
        required: true
      },
      visible: Boolean
    },
    computed: {
      picture () {
        return this.product.picture || defaultImage
      },
      info () {
        return config[this.felid] || {}
      },
      title () {
        return this.info.title
      },
      columns () {
        return [{
          title: '属性',
          key: 'specName',
          align: 'center',
          render: (h, { row, index }) => {
            return <div>{ index === 0 && this.product.name }{ row.specName }</div>
          }
        }, {
          title: this.info.headerTitle,
          key: this.felid,
          align: 'left',
          width: 260,
          render: (h, { row }) => {
            console.log('aassss:', this.info, config, this.felid)
            const onChange = (value) => this.$emit('change', row, value)
            return this.info.editRender(h, { sku: row, onChange })
          }
        }]
      }
    },
    methods: {
      handleHide () {
        this.$emit('close')
      }
    }
  }
</script>
<style lang="less">
  .product-info {
    display: flex;
    align-items: center;
    font-size: @font-size-base;
    color: @text-color;
    line-height: 22px;
    padding-right: 10px;
    margin-bottom: 20px;
    .picture {
      width: 48px;
      height: 36px;
      border: 1px solid @border-color-base;
      font-size: @font-size-small;
      margin-right: 26px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
