<template>
  <Modal
    :width="600"
    :value="value"
    title="购物袋设置"
    @on-ok="handleSubmit"
    @on-cancel="closeModal"
    :loading="submitting"
  >
    <RadioGroup
      @on-change="handleChange"
      :value="price"
      type="button"
      class="radio-button-group"
    >
      <Radio v-for="(item, index) in itemList" :key="index" :label="item.value">
        {{ item.label }}
      </Radio>
    </RadioGroup>
    <Spin fix v-if="loading" />
  </Modal>
</template>
<script>
  import {
    fetchGetPackageBagPrice,
    fetchSubmitPackageBagPrice
  } from '@/data/repos/poi'

  export default {
    name: 'shopping-bag-setting-modal',
    props: {
      value: Boolean
    },
    data () {
      return {
        itemList: [],
        price: 0,
        loading: false,
        submitting: false
      }
    },
    watch: {
      value: {
        immediate: true,
        handler (value) {
          if (value) {
            this.getInitData()
          }
        }
      }
    },
    methods: {
      async getInitData () {
        try {
          this.loading = true
          const { price, range } = await fetchGetPackageBagPrice()
          this.itemList = range
          this.price = price
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message || err)
        } finally {
          this.loading = false
        }
      },
      async handleSubmit () {
        try {
          this.submitting = true
          await fetchSubmitPackageBagPrice(this.price)
          this.$Message.success('购物袋设置成功')
          this.closeModal()
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message || err)
        } finally {
          this.submitting = false
        }
      },
      handleChange (price) {
        this.price = price
      },
      closeModal () {
        this.$emit('input', false)
        this.$emit('visible-change', false)
      }
    }
  }
</script>
<style scoped lang="less">
  .radio-button-group {
    /deep/ .boo-radio-wrapper.boo-radio-default .boo-radio {
      margin-right: 0;
    }
  }
</style>
