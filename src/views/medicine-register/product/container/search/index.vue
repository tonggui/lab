<template>
  <div class="medicine-register-search">
    <div class="search">
      <div class="search-item">
        <span class="label">城市</span>
        <div class="content city-content">
          <Select v-model="searchParams.cityIds" placeholder="全部" clearable multiple>
            <Option v-for="item in cityList" :value="item.cityId" :key="item.cityId">{{ item.cityName }}</Option>
          </Select>
        </div>
      </div>
      <div class="search-item">
        <span class="label">购买方式要求</span>
        <div class="content">
          <Select v-model="searchParams.purchaseType" placeholder="全部">
            <Option v-for="item in purchaseTypeOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
      </div>
      <div class="search-item">
        <span class="label">商品限制方式</span>
        <div class="content">
          <Select v-model="searchParams.matchingRules" placeholder="全部">
            <Option v-for="item in matchingRulesOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
          <Input v-model="searchParams.productInfo" clearable />
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
  import { purchaseTypeList, matchingRulesList } from '@/data/constants/medicine/register'
  import { Message } from '@roo-design/roo-vue'
  import { helper } from '../../store'
  import { registerExportExcel } from '@/data/api/medicineRegister'

  const { mapState, mapActions } = helper('product')

  export default {
    name: 'medicine-register-search',
    computed: {
      ...mapState([
        'searchParams',
        'cityList'
      ])
    },
    data () {
      return {
        purchaseTypeOptions: [].concat({
          value: -1,
          label: '全部'
        }, purchaseTypeList),
        matchingRulesOptions: [].concat({
          value: -1,
          label: '全部'
        }, matchingRulesList),
        condition: {},
        exportFlag: true // 导出按钮开关
      }
    },
    methods: {
      ...mapActions([
        'getList',
        'resetPagination',
        'resetSearchParams'
      ]),
      // 点击查询
      async handleQueryBtn () {
        const { getList, resetPagination } = this
        await resetPagination()
        await getList()
      },
      // 点击重置
      async handleResetBtn () {
        await this.resetSearchParams()
      },
      // 点击导出
      handleExportBtn () {
        this.exportFlag = false
        registerExportExcel(this.searchParams).then(() => {
          Message.success('已提交，请查看任务进度～')
          this.exportFlag = true
        }).catch((err) => {
          if (err.message) {
            Message.error(err.message)
          }
          this.exportFlag = true
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .medicine-register-search{
    position: relative;
    .search {
      display: flex;
      flex-flow: wrap;
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
      .city-content {
        width: 170px;
      }
      .product-content {
        width: 270px;
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
