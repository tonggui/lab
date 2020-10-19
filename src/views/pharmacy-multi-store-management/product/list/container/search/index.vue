<template>
  <div class="search-content">
    <div class="search">
    <div class="search-col col-left">
      <div class="search-col-item">
        <label>门店id</label>
        <Input v-model="commonParameter.wmPoiId" placeholder="可输入多个门店id，用逗号隔开" clearable class="input-wmPoiId" />
      </div>
      <div class="search-col-item">
        <label>UPC编码</label>
        <Input v-model="commonParameter.upcCode" placeholder="请输入UPC编码" clearable class="input-wmPoiId" />
      </div>
      <div class="search-col-item">
        <label>上/下架状态</label>
        <Select v-model="commonParameter.sellStatus" placeholder="上架/下架" clearable style="width:220px">
            <!-- <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option> -->
        </Select>
      </div>
    </div>
    <div class="search-col col-mid">
      <div class="search-col-item">
        <label>门店名称</label>
        <Input v-model="commonParameter.wmPoiName" placeholder="请输入门店名称" clearable class="input-wmPoiId" />
      </div>
      <div class="search-col-item">
        <label>商品后台分类</label>
        <Cascader :data="categoryList" :load-data="loadData" @on-change="handleCascaderDone" placeholder="支持分别选择1级, 2级, 3级"></Cascader>
      </div>
    </div>
    <div class="search-col col-right">
      <div class="search-col-item">
        <label>商品编码</label>
        <Input v-model="commonParameter.sourceFoodCode" placeholder="请输入商品编码" clearable class="input-wmPoiId" />
      </div>
      <div class="search-col-item">
        <label>药品类别</label>
        <Select v-model="commonParameter.medicineType" placeholder="全部" clearable style="width:220px">
            <!-- <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option> -->
        </Select>
      </div>
    </div>
    </div>
    <div class="search-btn-group">
      <Button type="primary" class="search-btn" @click="handleQueryBtn">查询</Button>
      <Button class="search-btn" @click="handleResetBtn">重置</Button>
      <Button class="search-btn" @click="handleExportBtn">导出</Button>
    </div>
  </div>
</template>
<script>
  import _ from 'lodash'
  import {
    fetchGetSearchSuggestion
  } from '@/data/repos/merchantProduct'
  import { fetchGetCategoryListByParentId } from '@/data/repos/category'

  // TODO  上下架、药品类别、查询、导出等接口，商品类目待确认
  export default {
    name: 'product-search',
    props: {
      placeholder: {
        type: String,
        default: '商品名称/品牌/条码/货号'
      }
    },
    components: {
    },
    data () {
      return {
        commonParameter: {
          wmPoiId: '', // 门店id
          wmPoiName: '', // 门店名称
          sourceFoodCode: '', // 商品编码
          // name: '', // 商品名称 ?
          upcCode: '', // upc编码
          categoryId1: '', // 一级后台分类
          categoryId2: '', // 二级后台分类
          categoryId3: '', // 三级后台分类
          medicineType: '', // 药品类别
          sellStatus: '' // 上下架状态
        },
        categoryList: []
      }
    },
    methods: {
      async getSuggestionList (keyword) {
        const list = await fetchGetSearchSuggestion(keyword)
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
          const data = await this.fetchCategory(item.value)
          item.children = this.mapcategoryListData(data)
          item.loading = false
          callback()
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
        const [categoryId1, categoryId2, categoryId3] = value
        this.commonParameter = Object.assign({}, this.commonParameter, { categoryId1, categoryId2, categoryId3 })
        console.log(this.commonParameter)
      },
      // 获取后台类目
      fetchCategory (parentId) {
        return fetchGetCategoryListByParentId(parentId).then((data) => {
          console.log(data)
          return data
        })
      },
      // 点击查询
      handleQueryBtn () {},
      // 点击重置
      handleResetBtn () {
        for (let i in this.commonParameter) {
          this.commonParameter[i] = ''
        }
        console.log(this.commonParameter)
      },
      // 点击导出
      handleExportBtn () {}
    },
    async mounted () {
      const data = await this.fetchCategory(0)
      this.categoryList = this.mapcategoryListData(data)
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
        width:302px;
        .search-col-item{
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          margin-bottom: 20px;
          >label{
            font-size: 12px;
            line-height: 36px;
          }
        }
      }
      .col-right{
        width: 278px;
      }
      .input-wmPoiId{
        width: 220px
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
