<template>
  <CategoryTemplateLayout>
    <template slot="header">
      <div class="category-template-select-header">
        <span>分类模版</span>
        <span class="category-template-select-tips">
          <Tooltip type="help" :max-width="400" placement="bottom-start" :offset="20" @on-popper-show="handleShowTip">
            <ol slot="content">
              <li>模版生成后，未选分类下的商品将会被分配到“未分类”；</li>
              <li>分类模版有多套，您可以切换使用，模版使用后，您可以自行调整商品的分类及对应模版分类的顺序；</li>
              <li>分类模版有助于提升店内商品下单转化以及商家的复购。</li>
            </ol>
            说明
          </Tooltip>
        </span>
      </div>
    </template>
    <div class="category-template-select-content">
      <div class="category-template-select-radio-group">
        <RadioGroup :value="selectedIndex" @on-change="handleChangeTemplateIndex">
          <Radio v-for="(item, index) in templateList" :label="index" :key="item.detail.id">{{ item.detail.name }}</Radio>
        </RadioGroup>
      </div>
      <div class="category-template-select-list">
        <ErrorBoundary :error="error" description="分类模版获取失败~" @refresh="refresh">
          <Empty v-if="isNoData" description="分类模版即将到来，请耐心等待一段时日！"></Empty>
          <Slider v-else :selected-index="selectedIndex">
            <CategoryTemplate
              v-for="(template, index) in templateList"
              :key="index"
              :data-source="template"
              :editable="template.detail && template.detail.editable"
              :loading="template.status.fetching"
              @refresh="refreshTemplate"
              @change="handleChangeTemplateTagList"
            />
          </Slider>
        </ErrorBoundary>
      </div>
      <Loading v-if="loading || submitting" size="small" />
    </div>
    <template slot="footer">
      <Button
        v-if="!isNoData"
        v-mc="{ bid: 'b_shangou_online_e_0oh6x1x4_mc', val: { template_cat_id: templateId } }"
        class="button"
        type="primary"
        :disabled="disabled"
        @click="handleSubmit"
      >
        生成预览
      </Button>
    </template>
  </CategoryTemplateLayout>
</template>
<script>
  import CategoryTemplateLayout from '../category-template-layout'
  import CategoryTemplate from './template'
  import Slider from './slider'
  import lx from '@/common/lx/lxReport'

  export default {
    name: 'category-template-select',
    props: {
      loading: Boolean,
      error: Boolean,
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
    activated () {
      lx.mv({ bid: 'b_shangou_online_e_4szcomjm_mv', val: { template_cat_id: this.templateId } })
    },
    computed: {
      isNoData () {
        return !this.templateList || this.templateList.length <= 0
      },
      currentTemplate () {
        return this.templateList[this.selectedIndex] || {}
      },
      templateId () {
        const detail = this.currentTemplate.detail || {}
        return detail.id
      },
      disabled () {
        const status = this.currentTemplate.status || {}
        const fetchingTemplate = status.fetching
        const templateError = status.error
        return fetchingTemplate || this.error || templateError
      }
    },
    components: {
      CategoryTemplate,
      Slider,
      CategoryTemplateLayout
    },
    methods: {
      refresh () {
        this.$emit('refresh')
      },
      refreshTemplate () {
        this.$emit('refresh-template')
      },
      handleChangeTemplateIndex (index) {
        lx.mv('b_shangou_online_e_huggk5dr_mv', { template_cat_name: this.templateList[index].detail.name })
        this.$emit('change-index', index)
      },
      handleChangeTemplateTagList (template) {
        this.$emit('change-template', template)
      },
      handleSubmit () {
        const selectedTemplate = this.currentTemplate
        const { value } = selectedTemplate.detail
        if (!value || value.length <= 0) {
          this.$Message.error('必须勾选分类！')
          return
        }
        this.submitting = true
        this.$emit('submit', () => {
          this.submitting = false
        })
      },
      handleShowTip () {
        lx.mc({ bid: 'b_shangou_online_e_kczeg7lk_mc', val: { template_cat_id: this.templateId } })
      }
    }
  }
</script>
<style lang="less" scoped>
  .category-template-select {
    &-tips {
      margin-left: 12px;
      color: @text-color;
      font-size: @font-size-base;
      font-weight: normal;
      ol {
        list-style-position: outside;
        padding-left: 1em;
      }
    }
    &-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding-bottom: 40px;
    }
    &-radio-group {
      padding: 20px 30px;
      text-align: left;
    }
    &-list {
      flex: 1;
      overflow: hidden;
      position: relative;
    }
  }
</style>
