<template>
  <div>
    <Alert type="warning" class="product-relate-alert" closable v-if="unRelateNum">
      <div class="left">
        <Icon type="error" size="17" color="red" />&nbsp;
        检测到有{{unRelateNum}}个总部商品未关联门店。需商品与分店建立关联，才可实现“总部商品修改、已建立关联分店的商品自动更新”。
      </div>
      <div class="right" slot="close">
        <Button type="primary" @click="handleRelate">立即关联</Button>&nbsp;
        <Icon type="closed-thin"></Icon>
      </div>
    </Alert>
    <Modal :value="visible" closable>
      <div slot="header">
        请将总部商品与分店关联
      </div>
      <div slot="default">
        总部商品与分店建⽴关联后，才可实现“总部商品修改后，已建⽴关联分店的商品⾃动更新”
      </div>
      <div slot="footer">
        <Button @click="visible = false">取消</Button>
        <Button type="primary" @click="handleRelate">立即关联</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import LocalStorage, { KEYS } from '@/common/local-storage'

  export default {
    name: 'product-relate',
    data () {
      return {
        visible: false,
        unRelateNum: 0
      }
    },
    methods: {
      handleRelate () {
        this.$router.push({ name: 'newBatchRel' })
      }
    },
    mounted () {
      if (LocalStorage[KEYS.MERCHANT_OPEN_STATUS] === false) {
        this.$Message.success('欢迎使用，请尽快创建总部商品~')
        this.visible = true
        LocalStorage[KEYS.MERCHANT_OPEN_STATUS] = true
      }
    }
  }
</script>

<style lang="less" scoped>
  .product-relate-alert {
    display: flex;
    height: 50px;
    .left, .right {
      height: 100%;
      display: flex;
      align-items: center;
    }
  }
</style>
