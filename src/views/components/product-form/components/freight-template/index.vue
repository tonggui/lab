<template>
  <div class="product-edit-freight">
    <Select
        :value="selfModel"
        clearable
        filterable
        remote
        :remote-method="throttle(handleChange,500)"
        :loading="loading"
        @on-change="onOptionChange"
        >
        <Option v-for="(option,index) in templateList" :value="option.value" :key="index">{{option.label}}</Option>
    </Select>
    <span class="freight-jumper"><a href="/#/page/medicine/e/delivery/#/freight-template" target="_blank">+ 新建运费模板</a></span>
  </div>
</template>

<script>
  import { searchFreightSugName } from '@/data/api/medicine'
  import _ from 'lodash'
  export default {
    name: 'FreightTemplate',
    components: {
    },
    props: {
      shippingTemplateId: [Number, String],
      shippingTemplateName: String
    },
    data () {
      return {
        loading: false,
        templateList: []
      }
    },
    computed: {
      throttle () {
        return _.throttle
      },
      selfModel () {
        return this.shippingTemplateId ? this.shippingTemplateId : ''
      }
    },
    methods: {
      handleChange (query) {
        console.log(query)
        if (query !== '') {
          this.loading = true
          const params = { templateName: query }
          this.fetchSearchFreightSugName(params)
        } else {
          this.templateList = []
        }
      },
      fetchSearchFreightSugName (params = {}) {
        searchFreightSugName(params).then((res) => {
          this.loading = false
          const list = res.freightTemplateVOList || []
          const transList = list.map(item => {
            return {
              value: item.templateId,
              label: item.templateName
            }
          })
          this.templateList = transList
        })
      },
      onOptionChange (value) {
        this.$emit('on-change', value)
      }
    },
    mounted () {
      this.fetchSearchFreightSugName()
    }
  }
</script>

<style scoped lang="less">
    .product-edit-freight{
      display: flex;
      flex-direction: row;
      /deep/ .boo-select{
        width: 240px;
      }
      .freight-jumper{
        margin-left: 10px;
        color: @highlight-color;
        white-space: nowrap;
        cursor: pointer;
      }
    }
</style>
