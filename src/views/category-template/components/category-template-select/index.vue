<template>
  <CategoryTemplateLayout>
    <template slot="header">
      <div class="category-template-select-header">
        <span>分类模版</span>
        <span class="category-template-select-tips">
          <Tooltip type="help" :max-width="400" placement="bottom-start" :offset="20">
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
          <Radio v-for="(item, index) in templateList" :label="index" :key="item.id">{{ item.name }}</Radio>
        </RadioGroup>
      </div>
      <div class="category-template-select-list">
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
      <Loading v-if="loading || submitting" size="small" />
    </div>
    <template slot="footer">
      <Button class="button" type="primary" v-if="!isNoData" :disabled="disabled" @click="handleSubmit">生成预览</Button>
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
