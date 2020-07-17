<template>
  <component :is="container" label="选择要修改的商品" :index="index + 1" class="batch-product-modify">
    <CardGroup :deletable="deletable" @delete="handleDelete">
      <ProductModifyForm v-for="(item, index) in list" :key="item.id" :value="item" :index="index" @change="handleChange" :context="context" ref="form" />
    </CardGroup>
    <div class="footer">
      <Button @click="handleAdd" :disabled="overLimit">添加要修改的商品</Button>
      <Button @click="handleSubmit" type="primary" v-mc="{ bid: 'b_2i2tndai' }" :loading="submitting">确认修改</Button>
    </div>
  </component>
</template>
<script>
  import CardGroup from '@/views/batch-management/components/card/group'
  import OrderFormItem from '@components/order-form-item'
  import ProductModifyForm, { createValue } from './components/product-modify-form'
  import { fetchSubmitBatchModifyByProduct } from '@/data/repos/batch'
  import { QUALIFICATION_STATUS } from '@/data/enums/product'
  import qualificationModal from '@/components/qualification-modal'
  import { BATCH_MODIFY_MAX } from '@/data/constants/batch'
  import lx from '@/common/lx/lxReport'

  export default {
    name: 'batch-product-modify',
    props: {
      index: {
        type: Number,
        default: 0
      },
      isSinglePoi: Boolean,
      poiIdList: Array,
      context: {
        type: Object,
        default: () => ({})
      }
    },
    data () {
      return {
        list: [this.createItem()],
        submitting: false
      }
    },
    components: {
      ProductModifyForm,
      CardGroup
    },
    computed: {
      container () {
        return this.isSinglePoi ? 'div' : OrderFormItem
      },
      deletable () {
        return this.list.length > 1
      },
      overLimit () {
        return this.list.length >= BATCH_MODIFY_MAX
      }
    },
    methods: {
      createItem () {
        return createValue(this.context)
      },
      handleChange (value, index) {
        this.list.splice(index, 1, value)
      },
      handleAdd () {
        this.list.push(this.createItem())
      },
      handleDelete (index) {
        this.list.splice(index, 1)
      },
      async handleSubmit () {
        if (!this.isSinglePoi && this.poiIdList.length <= 0) {
          this.$Message.error('请先选择目标门店')
          return
        }
        const $formList = this.$refs.form
        for (let i = 0, l = $formList.length; i < l; i++) {
          const $form = $formList[i]
          const error = await $form.validate()
          if (error) {
            this.$Message.error(error)
            return
          }
        }
        try {
          this.submitting = true
          const poiIdList = this.isSinglePoi ? [this.$route.query.wmPoiId] : this.poiIdList
          await fetchSubmitBatchModifyByProduct({
            matchRuleList: this.list,
            poiIdList
          })
          lx.mc({ bid: 'b_shangou_online_e_yrpx02zk_mc' })
          this.$Message.success('批量修改成功')
          setTimeout(() => {
            this.$emit('submit')
          }, 2000)
        } catch (err) {
          console.log(err)
          if (err.code === QUALIFICATION_STATUS.EXP || err.code === QUALIFICATION_STATUS.NO) {
            qualificationModal(err.message)
          } else {
            this.$Message.error(err.message)
          }
        } finally {
          this.submitting = false
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .batch-product-modify {
    .footer {
      display: flex;
      justify-content: space-between;
    }
  }
</style>
