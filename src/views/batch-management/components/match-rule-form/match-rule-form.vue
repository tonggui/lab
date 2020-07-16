<template>
  <div>
    <Tabs type="radio" name="match-rule" :value="type" @change="handleTypeChange" class="match-rule-form">
      <TabPane label="按商品标题匹配" :name="BATCH_MATCH_TYPE.PRODUCT" v-if="!context.isMedicine" tab="match-rule" :key="BATCH_MATCH_TYPE.PRODUCT">
        <Form :ref="`form-${BATCH_MATCH_TYPE.PRODUCT}`" label-position="left" :label-width="80" :rules="rules[BATCH_MATCH_TYPE.PRODUCT]" :model="formData">
          <FormItem label="商品标题" prop="productName">
            <Input v-model="formData.productName" />
          </FormItem>
          <FormItem label="店内分类" prop="tagName">
            <div class="description"><small>不选择店内分类可能匹配多个商品，并修改匹配到的多个商品</small></div>
            <div style="display: inline-block; ">
              <TagList v-if="context.isSinglePoi" :value="formData.tagName" @change="handleTagNameChange" :source="context.tagList" transfer />
              <Input v-else v-model="formData.tagName" />
            </div>
            <Tooltip type="help" placement="top" :max-width="260" transfer content="如果商品有两级分类，请输入第二级的子分类" />
          </FormItem>
        </Form>
      </TabPane>
      <TabPane label="按UPC/EAN/条形码匹配" :name="BATCH_MATCH_TYPE.UPC" tab="match-rule" :key="BATCH_MATCH_TYPE.UPC">
        <Form :ref="`form-${BATCH_MATCH_TYPE.UPC}`" label-position="left" :label-width="120" :rules="rules[BATCH_MATCH_TYPE.UPC]" :model="formData">
          <FormItem label="UPC/EAN/条形码" prop="upc">
            <Input v-model="formData.upc" />
          </FormItem>
        </Form>
      </TabPane>
      <TabPane label="按SKU码/货号匹配" :name="BATCH_MATCH_TYPE.SKU" v-if="!context.isMedicine" tab="match-rule" :key="BATCH_MATCH_TYPE.SKU">
        <Form :ref="`form-${BATCH_MATCH_TYPE.SKU}`" label-position="left" :label-width="120" :rules="rules[BATCH_MATCH_TYPE.SKU]" :model="formData">
          <FormItem label="SKU码/货号" prop="sku">
            <Input v-model="formData.sku" />
          </FormItem>
        </Form>
      </TabPane>
      <TabPane label="(仅限组包商品)按商品名称匹配" :name="BATCH_MATCH_TYPE.PRODUCT_PACKAGE_TITLE" v-if="context.enableProductPackage" tab="match-rule" :key="BATCH_MATCH_TYPE.PRODUCT_PACKAGE_TITLE">
        <Form :ref="`form-${BATCH_MATCH_TYPE.PRODUCT_PACKAGE_TITLE}`" label-position="left" :label-width="120" :rules="rules[BATCH_MATCH_TYPE.PRODUCT_PACKAGE_TITLE]" :model="formData">
          <FormItem label="组包商品名称" prop="productName">
            <Input v-model="formData.productName" :maxlength="36" />
          </FormItem>
        </Form>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
  import { isObject } from 'lodash'
  import { BATCH_MATCH_TYPE } from '@/data/enums/batch'
  import Tabs, { TabPane } from '@components/radio-button-tabs'
  import TagList from '@components/taglist'
  import { getInitValue } from './util'

  export default {
    name: 'match-rule-form',
    props: {
      context: {
        type: Object,
        default: () => ({
          isMedicine: false,
          isSinglePoi: false,
          enableProductPackage: false,
          tagList: []
        }),
        validator: (context) => {
          return ['isMedicine', 'isSinglePoi', 'tagList'].every(k => k in context)
        }
      },
      value: {
        type: Object,
        validator: (v) => {
          try {
            const { type, value } = v
            return Object.values(BATCH_MATCH_TYPE).includes(type) && isObject(value)
          } catch (err) {
            return false
          }
        },
        required: true
      }
    },
    data () {
      return {
        BATCH_MATCH_TYPE,
        rules: {
          [BATCH_MATCH_TYPE.PRODUCT]: {
            productName: [{
              required: true,
              message: '请输入商品标题',
              trigger: 'blur'
            }]
          },
          [BATCH_MATCH_TYPE.UPC]: {
            upc: [{
              required: true,
              message: '请输入UPC/EAN/条形码',
              trigger: 'blur'
            }]
          },
          [BATCH_MATCH_TYPE.SKU]: {
            sku: [{
              required: true,
              message: '请输入SKU码/货号',
              trigger: 'blur'
            }]
          },
          [BATCH_MATCH_TYPE.PRODUCT_PACKAGE_TITLE]: {
            productName: [{
              required: true,
              message: '(仅限组包商品)按商品名称匹配',
              trigger: 'blur'
            }]
          }
        },
        formData: {
          ...this.value.value
        }
      }
    },
    components: {
      Tabs,
      TabPane,
      TagList
    },
    computed: {
      type () {
        return this.value.type
      }
    },
    watch: {
      formData: {
        handler (value) {
          this.handleFormChange(value)
        },
        deep: true
      }
    },
    methods: {
      convertOut (type, value) {
        let data = {}
        switch (type) {
        case BATCH_MATCH_TYPE.PRODUCT:
          data = { productName: value.productName, tagName: value.tagName }
          break
        case BATCH_MATCH_TYPE.UPC:
          data = { upc: value.upc }
          break
        case BATCH_MATCH_TYPE.SKU:
          data = { sku: value.sku }
          break
        case BATCH_MATCH_TYPE.PRODUCT_PACKAGE_TITLE:
          data = { productName: value.productName }
          break
        }
        const initValue = getInitValue(this.context)
        return { ...this.value, value: { ...initValue.value, ...data }, type }
      },
      handleTagNameChange (tagName) {
        this.formData.tagName = tagName
      },
      handleFormChange (value) {
        this.$emit('change', this.convertOut(this.type, value))
      },
      handleTypeChange (type) {
        this.$emit('change', this.convertOut(type, this.formData))
      },
      async validate () {
        const $form = this.$refs[`form-${this.type}`]
        const valid = await $form.validate()
        if (!valid) {
          $form.$el.scrollIntoViewIfNeeded()
          return '请填写一下匹配信息！'
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .match-rule-form {
    width: 700px;
    height: 200px;
    .description {
      color: @text-tip-color;
    }
    /deep/ .boo-form-item {
      margin-bottom: 20px;
    }
    /deep/ .boo-input {
      width: 440px;
    }
  }
</style>
