<template>
  <div class="category-attrs-form">
    <slot name="attrs"></slot>
    <div class="apply" v-if="allowApply">
      <small>想要填写的信息这里没有？<a @click="applyModalVisible = true">申请商品信息</a></small>
    </div>
    <Drawer
      title="申请商品信息"
      width="50%"
      v-model="applyModalVisible"
      :mask-closable="false"
    >
      <div class="category-attrs-apply">
        <DynamicForm
          ref="form"
          :data="applyInfo"
        />
      </div>
      <template slot="footer">
        <Button size="large" @click="cancel" style="margin-right: 10px;">取消</Button>
        <Button size="large" type="primary" @click="confirm" :loading="submitting">提交</Button>
      </template>
    </Drawer>
  </div>
</template>

<script>
  import DynamicFormCreator from './components/apply/dynamic-form'
  import formConfig from './components/apply/category-attrs-apply'
  import { fetchSubmitApplyProductInfo } from '@/data/repos/product'
  import { poiId } from '@/common/constants'

  export default {
    name: 'CategoryAttrsForm',
    components: { DynamicForm: DynamicFormCreator(formConfig) },
    props: {
      allowApply: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        applyModalVisible: false,
        applyInfo: {},
        submitting: false
      }
    },
    methods: {
      cancel () {
        this.applyModalVisible = false
      },
      async confirm () {
        let error = null
        try {
          error = await this.$refs.form.validate({
            breakWhenErrorOccur: false
          })
        } catch (err) {
          error = err.message
        }
        if (error && error.length) {
          console.log(error)
          return
        }
        try {
          this.submitting = true
          const { pic, attrName, attrValue } = this.applyInfo
          await fetchSubmitApplyProductInfo({ wmPoiId: poiId, pictureList: pic, name: attrName, value: attrValue })
          this.submitting = false
          this.applyModalVisible = false
          this.$Message.success('商品信息已申请')
        } catch (err) {
          this.submitting = false
          this.$Message.error(err.message)
        }
      }
    }
  }
</script>

<style lang="less">
  @item-width: 100%;

  .category-attrs-form {
    & > div {
      display: flex;
      flex-wrap: wrap;
      .form-item-layout {
        flex-shrink: 0;
        margin-right: 20px;

        .boo-input-wrapper
        , .boo-select {
          width: @item-width;
        }
      }
      &.row-mode {
        flex-direction: row;
        .form-item-layout {
          width: 410px;
        }
      }
      &.column-mode {
        flex-direction: column;
        .form-item-layout {
          width: 550px;
        }
      }
    }
    .apply {
      margin: 10px 0 0 20px;
    }
  }
  .category-attrs-apply {
    padding: 0 2px;
  }
</style>
