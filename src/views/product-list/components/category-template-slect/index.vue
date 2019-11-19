<template>
  <div class="wrapper">
    <div class="header">分类模版</div>
    <div class="content">
      <div class="radio-group">
        <RadioGroup :value="selectedIndex" @on-change="handleChangeTemplateIndex">
          <Radio v-for="(item, index) in templateList" :label="index" :key="item.id">{{ item.name }}</Radio>
        </RadioGroup>
      </div>
      <div class="template-list">
        <ErrorBoundary :error="error" description="分类模版获取失败~" @refresh="refresh">
          <Empty v-if="isNoData" description="分类模版即将到来，请耐心等待一段时日！"></Empty>
          <Slider v-else :selected-index="selectedIndex">
            <CategoryTemplate
              v-for="(template, index) in templateList"
              :key="index"
              :data-source="formateTemplate(template)"
              :editable="template && template.editable"
              :loading="fetchingTemplate && selectedIndex === index"
              @refresh="refreshTemplate"
              @change="handleChangeTemplateTagList"
            />
          </Slider>
        </ErrorBoundary>
      </div>
      <div class="footer">
        <div class="footer-desc">
          <div>操作说明</div>
          <ol>
            <li>分类模版使用后，不支持恢复到使用前的状态，请您在使用模版前，将商品类目划分正确；</li>
            <li>分类模版有多套，您可以切换使用，模版使用后，您可以自行调整商品的分类及对应模版分类的顺序；</li>
            <li>分类模版有助于提升店内商品下单转化以及商家的复购。</li>
          </ol>
        </div>
        <div>
          <Button class="button" @click="handleCancel">取消</Button>
          <Button class="button" type="primary" v-if="!isNoData" :disabled="disabled" @click="handleSubmit">生成预览</Button>
        </div>
      </div>
      <Loading v-if="loading || submitting" size="small" />
    </div>
  </div>
</template>
<script>
  import CategoryTemplate from './template'
  import Slider from './slider'
  import lx from '@/common/lx/lxReport'

  export default {
    name: 'category-template-select',
    props: {
      loading: Boolean,
      error: Boolean,
      fetchingTemplate: Boolean,
      selectedIndex: Number,
      templateList: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        submitting: false
      }
    },
    computed: {
      isNoData () {
        return !this.templateList || this.templateList.length <= 0
      },
      disabled () {
        return this.fetchingTemplate || this.error || (this.templateList[this.selectedIndex] || {}).error
      }
    },
    components: {
      CategoryTemplate,
      Slider
    },
    methods: {
      refresh () {
        this.$emit('refresh')
      },
      refreshTemplate () {
        this.$emit('refresh-template')
      },
      formateTemplate (template) {
        return template || { loaded: false }
      },
      handleChangeTemplateIndex (index) {
        lx.mv('b_shangou_online_e_huggk5dr_mv', { template_cat_name: this.templateList[index].name })
        this.$emit('change-index', index)
      },
      handleChangeTemplateTagList (value) {
        this.$emit('change-template', { value })
      },
      handleSubmit () {
        const selectedTemplate = this.templateList[this.selectedIndex]
        const { value } = selectedTemplate
        if (!value || value.length <= 0) {
          this.$Message.error('必须勾选分类！')
          return
        }
        this.submitting = true
        this.$emit('submit', () => {
          this.submitting = false
        })
      },
      handleCancel () {
        this.$emit('cancel')
      }
    }
  }
</script>
<style lang="less" scoped>
  @padding: 20px;
  .wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    .header {
      padding: @padding;
      font-size: 20px;
      font-weight: bold;
    }
    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .radio-group {
      padding-bottom: @padding;
      text-align: center;
    }
    .template-list {
      flex: 1;
      overflow: hidden;
      position: relative;
    }
    .footer {
      padding: @padding;
      display: flex;
      align-items: flex-end;
      &-desc {
        flex: 1;
        margin-right: 40px;
        ol {
          margin: 0;
          margin-top: 10px;
          padding-inline-start: 1em;
          font-size: @font-size-small;
          color: @text-description-color;
        }
      }
      .button {
        margin-right: 10px;
        &:last-child {
          margin-right: 0px;
        }
      }
    }
  }
</style>
