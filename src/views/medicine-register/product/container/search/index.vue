<template>
  <div class="medicine-register-search">
    <div class="search">
      <div class="search-item">
        <span class="label">城市</span>
        <div class="content">
          <Select v-model="commonParameter.cityIds" placeholder="全部" clearable multiple>
            <Option v-for="item in cityList" :value="item.cityId" :key="item.cityId">{{ item.cityName }}</Option>
          </Select>
        </div>
      </div>
      <div class="search-item">
        <span class="label">购买方式要求</span>
        <div class="content">
          <Select v-model="commonParameter.shopType" placeholder="全部" clearable>
            <Option v-for="item in registerTypeOptions" :value="item.code" :key="item.code">{{ item.desc }}</Option>
          </Select>
        </div>
      </div>
      <div class="search-item">
        <span class="label">商品识别方式</span>
        <div class="content">
          <Select v-model="commonParameter.registerMethod" placeholder="全部">
            <Option v-for="item in registerMethodOptions" :value="item.code" :key="item.code">{{ item.desc }}</Option>
          </Select>
        </div>
      </div>
      <div class="search-item">
        <span class="label">商品信息</span>
        <div class="tips">
          <Tooltip
            placement="bottom"
            width="225px"
            content="请录入商品名称关键词/UPC，不同关键词/UPC之间用英文逗号隔开"
          >
            <Icon class="tip" local="question-circle"/>
          </Tooltip>
        </div>
        <div class="content product-content">
          <Input v-model="commonParameter.productInfo" clearable />
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
  import { helper } from '../../store'
  const { mapState, mapMutations, mapActions } = helper('product')

  // TODO  上下架、药品类别、查询、导出等接口，商品类目待确认
  export default {
    name: 'medicine-register-search',
    computed: {
      ...mapState([
        'searchParams'
      ]),
      commonParameterTrim: function () {
        const { handleTrim } = this
        const { productInfo } = this.commonParameter
        return {
          productInfo: handleTrim(productInfo)
        }
      }
    },
    data () {
      return {
        commonParameter: {
          cityIds: [], // 城市
          shopType: '', // 购买方式要求
          registerMethod: '', // 商品识别方式
          productInfo: '' // 商品信息
        },
        registerTypeOptions: [{
          code: -1,
          desc: '全部'
        }, {
          code: 0,
          desc: '登记个人信息购买'
        }, {
          code: 1,
          desc: '仅到店自取'
        }],
        registerMethodOptions: [{
          code: -1,
          desc: '全部'
        }, {
          code: 0,
          desc: '商品名称关键字'
        }, {
          code: 1,
          desc: '商品UPC'
        }],
        condition: {},
        cityList: [], // 城市列表
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
      handleSearch (item) {
        this.$emit('search', item)
      },
      async fetchCityList () {
        // 获取城市列表
      },
      // 点击查询
      async handleQueryBtn () {
        const { commonParameter, getList, resetPagination, commonParameterTrim: { productInfo } } = this
        await resetPagination()
        await getList({ ...commonParameter, productInfo })
      },
      // trim
      handleTrim (str) {
        return _.trim(str)
      },
      // 点击重置
      handleResetBtn () {
        for (let i in this.commonParameter) {
          this.commonParameter[i] = ''
        }
      },
      // 点击导出
      handleExportBtn () {
        if (!this.exportFlag) {

        }
        // 下载接口

        // this.exportFlag = false
        // multiStoreExportExcel(this.searchParams, 1).then(() => {
        //   Message.success('已提交，请查看任务进度～')
        //   this.exportFlag = true
        // }).catch((err) => {
        //   if (err.message) {
        //     Message.error(err.message)
        //   }
        //   this.exportFlag = true
        // })
      }
    },
    async mounted () {
      // 初次请求列表接口
      this.setFirstIn(1)
      this.handleQueryBtn()
      this.fetchCityList()
    }
  }
</script>
<style lang="less" scoped>
  .medicine-register-search{
    position: relative;
    .search {
      display: flex;
      .search-item {
        display: flex;
        margin-bottom: 20px;
      }
      .label {
        line-height: 36px;
      }
      .content {
        margin: 0 20px;
        width: 150px;
        line-height: 36px;
      }
      .product-content {
        width: 320px;
      }
      .tips {
        margin-left: 10px;
        line-height: 36px;
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
