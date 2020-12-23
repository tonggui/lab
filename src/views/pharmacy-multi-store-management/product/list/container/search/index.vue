<template>
  <div class="search-content">
    <div class="search">
    <div class="search-col col-left">
      <div class="search-col-item">
        <label>门店id</label>
        <Input v-model="commonParameter.wmPoiIds" placeholder="可输入多个门店id，用逗号隔开" clearable class="input-wmPoiId" />
      </div>
      <div class="search-col-item">
        <label>UPC编码</label>
        <Input v-model="commonParameter.upcCode" placeholder="请输入UPC编码" clearable class="input-wmPoiId" />
      </div>
      <div class="search-col-item">
        <label>上/下架状态</label>
        <Select v-model="commonParameter.sellStatus" placeholder="上架/下架" clearable  class="input-wmPoiId">
            <Option v-for="item in condition.sellStatus" :value="item.code" :key="item.code">{{ item.desc }}</Option>
        </Select>
      </div>
    </div>
    <div class="search-col col-mid">
      <div class="search-col-item">
        <label>门店名称</label>
        <Input v-model="commonParameter.wmPoiName" placeholder="请输入门店名称" clearable class="input-wmPoiId" />
      </div>
      <div class="search-col-item">
        <label>商品名称</label>
        <Input v-model="commonParameter.name" placeholder="请输入商品名称" clearable class="input-wmPoiId" />
      </div>
      <div class="search-col-item">
        <label>商品后台分类</label>
        <Cascader ref="cascader" :data="categoryList" :load-data="loadData" changeOnSelect trigger="hover" @on-change="handleCascaderDone" placeholder="支持分别选择1级, 2级, 3级"></Cascader>
      </div>
    </div>
    <div class="search-col col-right">
      <div class="search-col-item">
        <label>商品编码</label>
        <Input v-model="commonParameter.sourceFoodCode" placeholder="请输入商品编码" clearable class="input-wmPoiId" />
      </div>
      <div class="search-col-item">
        <label>药品类别</label>
        <Select v-model="commonParameter.medicineType" placeholder="全部" clearable class="input-wmPoiId">
            <Option v-for="item in condition.medicineType" :value="item.code" :key="item.code">{{ item.desc }}</Option>
        </Select>
      </div>
      <div class="search-col-item">
        <label>医保商品</label>
        <Select v-model="commonParameter.medicareType" placeholder="全部" class="input-wmPoiId">
            <Option v-for="item in medicareTypeList" :value="item.code" :key="item.code">{{ item.label }}</Option>
        </Select>
      </div>
    </div>
    </div>
    <div class="search-btn-group">
      <Button type="primary" class="search-btn" @click="handleQueryBtn" v-mc="{ bid: 'b_shangou_online_e_apw7cbgf_mc', val: { bidParams } }">查询</Button>
      <Button class="search-btn" @click="handleResetBtn">重置</Button>
      <Button class="search-btn" @click="handleExportBtn" v-mc="{ bid: 'b_shangou_online_e_a5mua36m_mc'}">导出</Button>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import {
    fetchGetSearchSuggestion
  } from '@/data/repos/merchantProduct'
  import { fetchGetCategoryListByParentId } from '@/data/repos/category'
  import { multiStoreGetCondition, multiStoreExportExcel } from '@/data/api/medicineMultiStore'
  import { medicareTypeList } from '@/data/constants/medicine/medicare/index'
  import { Message } from '@roo-design/roo-vue'
  import { getCookie } from '@utiljs/cookie'
  import { helper } from '../../store'
  const { mapState, mapMutations, mapActions } = helper('product')

  // TODO  上下架、药品类别、查询、导出等接口，商品类目待确认
  export default {
    name: 'product-search',
    props: {
      placeholder: {
        type: String,
        default: '商品名称/品牌/条码/货号'
      }
    },
    computed: {
      ...mapState([
        'searchParams'
      ]),
      bidParams () {
        const { wmPoiName, sourceFoodCode, upcCode, medicineType, sellStatus } = this.commonParameter
        const obj = {
          poi_info: wmPoiName,
          sku_id: sourceFoodCode,
          upc_code: upcCode,
          category_id: this.category_id,
          drug_category: medicineType,
          status: sellStatus
        }
        return obj
      },
      commonParameterTrim: function () {
        const { handleTrim } = this
        const { sourceFoodCode, name, wmPoiName, upcCode } = this.commonParameter
        return {
          sourceFoodCode: handleTrim(sourceFoodCode),
          name: handleTrim(name),
          wmPoiName: handleTrim(wmPoiName),
          upcCode: handleTrim(upcCode)
        }
      }
    },
    components: {
    },
    data () {
      return {
        commonParameter: {
          wmPoiIds: '', // 门店id
          wmPoiName: '', // 门店名称
          sourceFoodCode: '', // 商品编码
          name: '', // 商品名称 ?
          upcCode: '', // upc编码
          categoryId: '', // 三级后台分类
          medicineType: '', // 药品类别
          sellStatus: '', // 上下架状态
          medicareType: 1 // 医保商品状态
        },
        categoryList: [],
        condition: {},
        medicareTypeList,
        category_id: '', // 后台分类拼接字符串
        exportFlag: true // 导出按钮开关
      }
    },
    methods: {
      ...mapMutations([
        'setSearchParams',
        'setFirstIn'
      ]),
      ...mapActions([
        'getList',
        'resetPagination'
      ]),
      async getSuggestionList (keyword) {
        const params = { keyword }
        const list = await fetchGetSearchSuggestion(params)
        return list
      },
      handleSearch (item) {
        this.$emit('search', item)
      },
      convertCategoryList (list) {
        if (!this.supportLocked) {
          return _.map(list, item => {
            item.locked = false
            item.lockTips = ''
            return item
          })
        }
        return list
      },
      // 获取后续级联数据
      async loadData (item, callback) {
        // console.log(item)
        item.loading = true
        if (item.value) {
          await this.fetchCategory(item.value).then((data) => {
            item.children = this.mapcategoryListData(data)
            item.loading = false
            callback()
          }).catch((err) => {
            item.loading = false
            Message.error(err.message || '获取数据失败~')
          })
        }
      },
      // 商品后台类目生成数据列表
      mapcategoryListData (data) {
        return data.map((e, i) => {
          if (e.level === 3) {
            return {
              value: e.id,
              label: e.name,
              level: e.level
            }
          }
          return {
            value: e.id,
            label: e.name,
            children: [],
            loading: false,
            level: e.level,
            isLeaf: e.isLeaf
          }
        })
      },
      // 商品后台类目选择完成后
      handleCascaderDone (value, selectedData) {
        // const [categoryId1, categoryId2, categoryId3] = value
        this.category_id = value.join(',')
        const categoryId = value[value.length - 1]
        this.commonParameter = Object.assign({}, this.commonParameter, { categoryId })
        // console.log(this.commonParameter)
      },
      // 获取后台类目
      fetchCategory (parentId) {
        const wmPoiId = getCookie('wmPoiId')
        return fetchGetCategoryListByParentId(parentId, wmPoiId).then((data) => {
          // console.log(data)
          return data
        })
      },
      // 点击查询
      async handleQueryBtn () {
        const { commonParameter, getList, resetPagination } = this
        console.log('commonParameter', commonParameter)
        const { sourceFoodCode, name, wmPoiName, upcCode } = this.commonParameterTrim
        console.log('commonParameterTrim===', 'sourceFoodCode:', sourceFoodCode, 'name:', name, 'wmPoiName:', wmPoiName, 'upcCode:', upcCode)
        const ids = commonParameter.wmPoiIds
        // 修改store中的搜索参数，！！！查询成功后插入↓
        // setSearchParams(commonParameter)
        let result = ids.replace(/(\s+)|(，)/g, function (result, $1, $2) {
          switch (result) {
          case $1:
            return ''
          case $2:
            return ','
          }
        })
        if (result) {
          result = result.match(/\d+/g).map(e => (Number(e)))
        } else {
          result = commonParameter.wmPoiIds
        }
        // console.log('wmPoiIds:', result)
        console.log('wmPoiIds:', result)
        if (result.length > 300) {
          this.$Message.warning(`查询门店数需≤300家，可在门店id处录入多个门店id进行查询`)
          return
        }
        await resetPagination()
        await getList({ ...this.commonParameter, wmPoiIds: result, sourceFoodCode, name, wmPoiName, upcCode })
      },
      // trim
      handleTrim (str) {
        return str.replace(/\s+/g, '')
      },
      // 点击重置
      handleResetBtn () {
        this.$refs.cascader.clearSelect()
        for (let i in this.commonParameter) {
          this.commonParameter[i] = ''
        }
        // this.$refs.cascader.value = []
        // console.log(this.commonParameter)
      },
      // 点击导出
      handleExportBtn () {
        if (!this.exportFlag) {
          return
        }
        this.exportFlag = false
        multiStoreExportExcel(this.searchParams, 1).then(() => {
          Message.success('已提交，请查看任务进度～')
          this.exportFlag = true
        }).catch((err) => {
          if (err.message) {
            Message.error(err.message)
          }
          this.exportFlag = true
        })
      }
    },
    async mounted () {
      // 初次请求列表接口
      this.setFirstIn(1)
      this.handleQueryBtn()
      await this.fetchCategory(0).then((data) => {
        this.categoryList = this.mapcategoryListData(data)
      }).catch((err) => {
        Message.error(err.message || '获取数据失败~')
      })
      let condition = await multiStoreGetCondition()
      this.condition = condition
      // console.log(this.categoryList)
    }
  }
</script>
<style lang="less" scoped>
  .search-content{
    position: relative;
    .search{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .search-col{
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        // width:302px;
        width:322px;
        .search-col-item{
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          margin-bottom: 20px;
          >label{
            // font-size: 12px;
            line-height: 36px;
          }
        }
      }
      .col-right{
        // width: 278px;
        width: 298px;
      }
      .input-wmPoiId{
        width: 220px;
      }
      /deep/ .boo-input{
        width: 220px;
      }
    }
    .search-btn-group{
      position: absolute;
      right: 0;
      bottom: -36px;
      .search-btn{
        margin-left: 10px;
      }
      /deep/ .boo-btn{
        width: 68px;
        height: 36px;
      }
    }
  }
</style>
