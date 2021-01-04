<template>
  <div class="container" :class="wrapClass">
    <Form :model="formData" :label-width="100" label-position="right" class="medicine-merchant-filter">
      <FormItem label="商品UPC编码">
        <FilterSelect v-model="formData.upcCode" :type="1" />
      </FormItem>
      <FormItem label="商品货号">
        <FilterSelect v-model="formData.skuCode" :type="2" />
      </FormItem>
      <FormItem label="商品名称">
        <FilterSelect v-model="formData.spuName" :type="3" />
      </FormItem>
      <FormItem v-if="formItems.isOtc !== false" label="药品类型">
        <Select v-model="formData.isOtc" placeholder="全部" clearable>
          <Option v-for="item in otcTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem v-if="formItems.category !== false" label="商品分类">
        <CategoryPath
          class="search-category"
          :value="categoryPath"
          @on-change="handleCategoryPath"
          :showProductList="false"
          :supportLocked="false"
          :fetchCategoryListByParentId="fetchGetCategoryListByParentId"
          />
      </FormItem>
      <FormItem v-if="formItems.date !== false" label="时间范围">
        <DatePicker
            v-model="formData.date"
            @on-change="handleDateChange"
            format="yyyy-MM-dd"
            type="daterange"
            placeholder="开始时间 - 结束时间"
            style="width: 100%"
          />
      </FormItem>
    </Form>
    <div class="submit-btn-group" :class="btnClass">
      <Button class="button" @click="handleClear">清空</Button>
      <Button class="button" type="primary" @click="handleSubmit">搜索</Button>
    </div>
  </div>
</template>
<script>
  import { PRODUCT_NAME_MAX_LENGTH } from '@/data/constants/product'
  import { otcTypeList } from '@/data/constants/medicine/merchant'
  import CategoryPath from '@/components/category-path'
  import { fetchGetCategoryListByParentId } from '@/data/repos/medicineMerchantCategory'
  import FilterSelect from './filter-select'

  export default {
    name: 'medicine-merchant-product-search-list-filter-form',
    props: {
      defaultData: {
        type: Object,
        default: () => ({
          upcCode: '',
          spuName: '',
          skuCode: '',
          isOtc: '',
          categoryId: {},
          date: []
        })
      },
      formItems: {
        type: Object,
        default: () => ({
          date: false
        })
      },
      wrapClass: {
        type: String,
        default: ''
      },
      btnClass: {
        type: String,
        default: ''
      }
    },
    watch: {
      defaultData () {
        this.setFormData()
      }
    },
    data () {
      return {
        formData: {
          upcCode: '',
          spuName: '',
          skuCode: '',
          isOtc: '',
          categoryId: {},
          date: []
        },
        otcTypeList,
        maxlength: PRODUCT_NAME_MAX_LENGTH,
        fetchGetCategoryListByParentId,
        // TODO 没做回显处理
        categoryPath: {}
      }
    },
    components: {
      CategoryPath,
      FilterSelect
    },
    created () {
      this.setFormData()
    },
    methods: {
      setFormData () {
        const { formItems, defaultData, formData } = this
        const data = Object.assign({}, formData, defaultData)
        const form = Object.entries(data).filter(([key]) => (formItems[key] !== false))
        this.formData = { ...Object.fromEntries(form) }
      },
      handleSubmit () {
        this.$emit('submit', this.formData)
      },
      handleClear () {
        this.formData = { ...this.defaultData }
        this.$emit('clear', this.formData)
      },
      handleDateChange (date) {
        this.formData.date = date
      },
      handleCategoryPath (categoryPath) {
        this.categoryPath = categoryPath
        this.formData.categoryId = categoryPath.id
      }
    }
  }
</script>
<style scoped lang="less">
  .container {
    margin: 10px 0;
    padding: 20px;
    background: @component-bg;
    /deep/ .boo-form-item {
      margin-bottom: 16px;
      .boo-form-item-label {
        font-size: @font-size-base;
      }
    }
    .submit-btn-group {
      text-align: right;
      .button:not(:last-child) {
        margin-right: 20px
      }
    }
    .medicine-merchant-filter {
      .boo-form-item {
        display: inline-block;
        width: 33.33%;
      }
    }
    .search-category {
      /deep/ .boo-poptip {
          width: 100%!important;
        }
      /deep/  .boo-tooltip {
          display: none;
        }
    }
  }
</style>
