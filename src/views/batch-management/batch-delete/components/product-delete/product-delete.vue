<template>
  <component :is="container" label="选择要匹配的商品" :index="index + 1" class="batch-product-delete">
    <CardGroup :deletable="deletable" @delete="handleDelete">
      <MatchRuleForm v-for="(item, index) in list" :key="item.id"  :value="item" :index="index" @change="handleChange($event, index)" :context="context" ref="form" />
    </CardGroup>
    <div class="footer">
      <div class="footer-left">
        <Button @click="handleAdd" :disabled="overLimit" class="footer-button">添加要删除的商品</Button>
        <Button @click="handleShowBatchModal" :disabled="overLimit" class="footer-button">批量添加匹配规则</Button>
      </div>
      <Button @click="handleSubmit" type="primary" v-mc="{ bid: 'b_a5oc9zzi' }" :loading="submitting">确认删除</Button>
    </div>
    <BatchRuleModal
      :value="modalVisible"
      :max="batchMax"
      :context="context"
      @submit="handleBatchAdd"
      @cancel="handleHideBatchModal"
    />
  </component>
</template>
<script>
  import CardGroup from '@/views/batch-management/components/card/group'
  import OrderFormItem from '@components/order-form-item'
  import { createRule, MatchRuleForm, BatchRuleModal } from '@/views/batch-management/components/match-rule-form'
  import { fetchSubmitBatchDelete } from '@/data/repos/batch'
  import { BATCH_DELETE_MAX } from '@/data/constants/batch'

  export default {
    name: 'batch-product-delete',
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
        modalVisible: false,
        submitting: false
      }
    },
    components: {
      MatchRuleForm,
      CardGroup,
      BatchRuleModal
    },
    computed: {
      container () {
        return this.isSinglePoi ? 'div' : OrderFormItem
      },
      deletable () {
        return this.list.length > 1
      },
      overLimit () {
        return this.list.length >= BATCH_DELETE_MAX
      },
      batchMax () {
        return BATCH_DELETE_MAX - this.list.length
      }
    },
    methods: {
      createItem () {
        return createRule(this.context)
      },
      handleShowBatchModal () {
        this.modalVisible = true
      },
      handleHideBatchModal () {
        this.modalVisible = false
      },
      handleChange (value, index) {
        this.list.splice(index, 1, value)
      },
      handleAdd () {
        this.list.push(this.createItem())
      },
      handleBatchAdd (list) {
        this.list = [...this.list, ...list]
        this.modalVisible = false
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
          await fetchSubmitBatchDelete({
            matchRuleList: this.list,
            poiIdList
          })
          this.$Message.success('批量删除成功')
          setTimeout(() => {
            this.$emit('submit')
          }, 2000)
        } catch (err) {
          console.log(err)
          this.$Message.error(err.message)
        } finally {
          this.submitting = false
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .batch-product-delete {
    .footer {
      display: flex;
      justify-content: space-between;
      &-left .footer-button {
        margin-right: 20px;
      }
    }
  }
</style>
