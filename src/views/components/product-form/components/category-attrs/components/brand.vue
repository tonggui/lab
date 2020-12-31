<template>
  <div class="category-attrs-brand">
    <Cascader
      v-bind="$attrs"
      v-on="$listeners"
      :source="undefined"
    >
      <template slot="empty">
        <div class="brand-apply" v-if="allowApply">
          <div class="brand-apply-tip">未找到该品牌，可以申请品牌</div>
          <Button class="brand-apply-btn" type="primary" @click="applyModalVisible = true">申请商品品牌</Button>
        </div>
      </template>
    </Cascader>
    <Drawer
      title="申请商品品牌"
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
  import Cascader from './cascader'
  import DynamicFormCreator from './apply/dynamic-form'
  import formConfig from './apply/brand-apply'
  import PortalMixin from '@/mixins/portal'
  import { fetchSubmitApplyBrand } from '@/data/repos/common'
  import { poiId } from '@/common/constants'

  export default {
    name: 'CategoryAttributeBrand',
    components: { Cascader, DynamicForm: DynamicFormCreator(formConfig) },
    mixins: [PortalMixin],
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
    watch: {
      applyModalVisible (v) {
        // 为了跟cascader收起时的上报区分开，所以加setTimeout
        setTimeout(() => {
          this.$emit(v ? 'start' : 'end')
        })
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
          await fetchSubmitApplyBrand({ isMerchant: this.isMerchant, poiId, ...this.applyInfo })
          this.submitting = false
          this.applyModalVisible = false
          this.$Message.success('品牌已申请')
        } catch (err) {
          this.submitting = false
          this.$Message.error(err.message)
        }
      }
    }
  }
</script>

<!--修复vue 添加的data-*属性偶尔丢失问题-->
<style lang="less">
.brand-apply {
  padding: 20px 0;
  text-align: center;
}
</style>

<style lang="less" scoped>
  .brand-apply {
    padding: 20px 0;
    text-align: center;
    .brand-apply-tip {
      color: @text-tip-color;
      font-size: @font-size-small;
      margin-bottom: 10px;
    }
  }
</style>
