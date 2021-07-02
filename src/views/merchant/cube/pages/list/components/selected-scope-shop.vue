<template>
  <div style="background：rgb(247, 248, 250);padding-bottom: 10px">
    <Card :bordered="false" id="basic_usage">
      <span style="margin: 0 30px">选择推荐商品范围</span>
      <RadioGroup v-model="scope" type="button" @on-change="handleStatusChange" >
        <Radio :label="-1">全国</Radio>
        <span @click="handleStatusClick">
          <Radio :label="1">指定城市或分店</Radio>
        </span>
      </RadioGroup>
      <span v-if="contentScope">所选分店为: {{ displayShop.name }}</span>
    </Card>
    <Modal
      v-model="scopeVisible"
      title="选择一个指定城市或分店"
      @on-ok="confirmSubmit"
      @on-cancel="cancel" :mask-closable="false">
      <Form ref="currentScope" :model="currentScope" :label-width="80">
        <div type="warning" class="operation-info-tip">
          <span>
            <Icon type="info" color="#F89800" class="icon" />选择后，平台将为您推荐“指定城市”或“分店所在商圈”的热销商品。选择商品时，默认关联“指定城市的全部分店”或“指定分店”（可点击“已选择商品”或进入下一步“完善商品信息”修改）。
            {{operationInfo.cityName}}{{operationInfo.poiName}}
          </span>
        </div>
        <FormItem label="城市/分店" prop="scopeStatus" style="width:350px"  >
          <RadioGroup v-model="currentScope.scopeStatus" @on-change="handleScopeChange">
            <Radio :label=0>
              <span>城市</span>
            </Radio>
            <Radio :label=1>
              <span>分店</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <template v-if="currentScope.scopeStatus === 0">
          <FormItem label="指定城市" prop="cityId" style="width:350px">
            <Select line
                    v-model="currentScope.cityId"
                    filterable clearable placeholder="请选择或输入城市名搜索">
              <Option v-for="item in scopeList" :value="item.cityId" :key="item.cityId" >{{item.cityName}}</Option>
            </Select>
          </FormItem>
        </template>
        <template v-if="currentScope.scopeStatus === 1">
          <FormItem label="指定城市" prop="cityId" style="width:350px">
            <Select line
                    v-model="currentScope.cityId"
                    filterable clearable placeholder="请选择或输入城市名搜索">
              <Option v-for="item in scopeList" :value="item.cityId" :key="item.cityId" >{{item.cityName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="指定分店" prop="poiId" style="width:350px" >
            <Select v-model="currentScope.poiId" :disabled="shopDisabled" placeholder="请选择或输入分店名搜索" filterable clearable line>
              <Option v-for="item in shopList" :value="item.id" :key="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
        </template>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import { helper } from '@/views/merchant/cube/store'
  import { get } from 'lodash'
  const { mapState, mapActions } = helper('multiCubeList')
  export default {
    name: 'selected-scope-shop',
    data () {
      return {
        scope: this.currentScopeId && this.currentScopeId.cityId !== -1 ? 1 : -1,
        scopeVisible: false,
        shopDisabled: true,
        contentScope: false,
        currentScope: {
          scopeStatus: 0,
          cityId: '',
          poiId: ''
        }
      }
    },
    watch: {
      'currentScope.cityId': {
        immediate: true,
        handler (v) {
          if (typeof v === 'undefined' || v === '') {
            this.shopDisabled = true
          } else this.shopDisabled = false
        }
      },
      'currentScopeId.cityId': {
        immediate: true,
        handler (v) {
          if (v !== '') {
            this.scope = this.currentScopeId && this.currentScopeId.cityId !== -1 ? 1 : -1
            this.currentScope = {
              scopeStatus: this.currentScopeId.poiId === -1 ? 0 : 1,
              cityId: this.currentScopeId.cityId,
              poiId: this.currentScopeId.poiId
            }
          }
        }
      }
    },
    mounted () {
    },
    computed: {
      ...mapState({
        scopeLists: 'scopeList',
        currentScopeId: 'currentScope'
      }),
      scopeList () {
        return this.scopeLists.filter(item => item.cityId !== -1)
      },
      shopList () {
        let tmp = this.scopeList.filter(item => {
          if (item.cityId === this.currentScope.cityId) {
            return item.poiList
          }
        })
        return tmp && tmp[0] ? tmp[0].poiList : []
      },
      operationInfo () {
        // console.log(this.currentScope)
        const scope = this.scopeList && this.scopeList.find(item => item.id === this.currentScope.poiId)
        // console.log(scope)
        return {
          cityName: get(scope, 'cityName') || '',
          poiName: get(scope, 'poiName') || ''
        }
      }
    },
    // mounted () {
    //   console.log(this.scopeList)
    // },
    methods: {
      ...mapActions(['setCurrentScope', 'getData']),
      handleScopeChange (v) {
        if (v === 1) {
          this.currentScope.poiId = ''
        }
      },
      handleStatusChange (scope) {
        if (this.scope === 1) {
          this.scopeVisible = true
        } else {
          this.currentScope = {
            scopeStatus: 0,
            cityId: '',
            poiId: ''
          }
          this.contentScope = false
          this.setCurrentScope({ cityId: -1, poiId: -1 })
          this.getData()
        }
      },
      handleStatusClick () {
        if (this.scope === 1 && !this.scopeVisible) {
          this.scopeVisible = true
        }
      },
      confirmSubmit () {
        return new Promise((resolve, reject) => {
          if ((this.currentScope.scopeStatus === 0 && this.currentScope.cityId !== -1 && this.currentScope.cityId !== '') ||
            (this.currentScope.scopeStatus === 1 && this.currentScope.poiId !== -1 && this.currentScope.poiId)) {
            if (this.currentScope.scopeStatus === 0) {
              this.setCurrentScope({ cityId: this.currentScope.cityId, poiId: -1 })
              let tmp = this.scopeList.filter(item => {
                return item.cityId === this.currentScope.cityId
              })[0]
              this.displayShop = {
                name: tmp.cityName,
                id: tmp.cityId
              }
            } else {
              this.setCurrentScope(this.setCurrentScope({ cityId: this.currentScope.cityId, poiId: this.currentScope.poiId }))
              this.displayShop = this.shopList.filter(item => item.id === this.currentScope.poiId)[0]
            }
            this.contentScope = true
            this.getData()
            this.$Message.info('更换范围成功')
            this.scopeVisible = false
            resolve()
          } else {
            reject(new Error())
          }
        })
      },
      cancel () {
        this.scope = this.currentScopeId && this.currentScopeId.cityId !== -1 ? 1 : -1
        if (this.scope === 1) {
          this.currentScope = {
            scopeStatus: this.currentScopeId.poiId === -1 ? 0 : 1,
            cityId: this.currentScopeId.cityId,
            poiId: this.currentScopeId.poiId
          }
        }
        this.$Message.info('取消')
      }
    }
  }
</script>

<style lang="less">
  .operation-info-tip {
    line-height: 20px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 0;
    font-weight: 400;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #666666;
    padding: 0 20px 0 41px;
    //border: 1px solid rgba(248, 186, 0, 0.2);
    border-radius: 2px;
    background-color: #F5F6FA;
    .icon {
      margin-right: 9px;
    }
  }
  .operation-info2-tip {
    height: 40px;
    line-height: 40px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 0;
    font-weight: 500;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #36394D;
    padding: 0 20px 0 41px;
    border: 1px solid rgba(248, 181, 0, 0.2);
    background-color: rgba(248, 181, 0, 0.1);
    .icon {
      margin-right: 9px;
    }
    z-index: 999;
  }
</style>
