<template>
  <Modal class="select-scope-info"
    v-model="scopeVisible" :mask-closable="false" :closable="false"
    title="选择一个指定城市或分店">
    <Form ref="currentScope" :model="currentScope" :label-width="80" :rules="formRules" >
      <div class="operation-info-tip">
          <span>
            <Icon type="info-outline" class="icon" />选择后，平台将为您推荐“指定城市”或“分店所在商圈”的热销商品。选择商品时，默认关联“指定城市的全部分店”或“指定分店”（可点击“已选择商品”或进入下一步“完善商品信息”修改）。
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
        <FormItem label="指定城市" prop="cityId" style="width:350px" :key="'cityId' + currentScope.scopeStatus">
          <Select line
                  v-model="currentScope.cityId"
                  filterable clearable placeholder="请选择或输入城市名搜索">
            <Option v-for="item in scopeList" :value="item.cityId" :key="currentScope.scopeStatus + item.cityId" >{{item.cityName}}</Option>
          </Select>
        </FormItem>
      </template>
      <template v-if="currentScope.scopeStatus === 1">
        <FormItem label="指定城市" prop="cityId" style="width:350px" :key="'cityId' + currentScope.scopeStatus">
          <Select line
                  v-model="currentScope.cityId"
                  filterable clearable placeholder="请选择或输入城市名搜索">
            <Option v-for="item in scopeList" :value="item.cityId" :key="currentScope.scopeStatus + item.cityId" >{{item.cityName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="指定分店" prop="poiId" style="width:350px" :key="'poiId' + currentScope.scopeStatus">
          <Select v-model="currentScope.poiId" :disabled="shopDisabled" placeholder="请选择或输入分店名搜索" filterable clearable line>
            <Option v-for="item in shopList" :value="item.id" :key="currentScope.scopeStatus + item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
      </template>
    </Form>
    <template slot="footer" >
      <FooterButton @confirm="confirmSubmit" @cancel="cancel"/>
    </template>
  </Modal>
</template>

<script>
  import { helper } from '@/views/merchant/cube/store'
  import FooterButton from './footer-button'
  import { get } from 'lodash'
  const { mapState, mapActions } = helper('multiCubeList')
  export default {
    name: 'selected-scope-shop',
    components: {
      FooterButton
    },
    props: {
      scopeVisible: {
        type: Boolean,
        default: false
      },
      scope: {
        type: Number,
        default: 1
      }
    },
    data () {
      return {
        shopDisabled: true,
        loading: false,
        currentScope: {
          scopeStatus: 0,
          cityId: '',
          poiId: ''
        },
        formRules: {
          cityId: [
            { required: true, message: '请选择城市' }
          ],
          poiId: []
        }
      }
    },
    watch: {
      scopeVisible: {
        immediate: true,
        handler (val) {
          this.visible = val
        }
      },
      'currentScope.scopeStatus': {
        immediate: true,
        handler (v) {
          if (this.$refs && this.$refs.currentScope) {
            if (v === 0) {
              this.formRules.cityId = [
                { required: true, message: '请选择城市' }
              ]
            } else {
              this.formRules.cityId = [
                { required: true, message: '请选择城市' }
              ]
              this.formRules.poiId = [
                { required: true, message: '请选择分店' }
              ]
            }
          }
        }
      },
      'currentScope.cityId': {
        immediate: true,
        handler (v) {
          if (typeof v === 'undefined' || v === '') {
            this.currentScope.poiId = ''
            this.shopDisabled = true
          } else this.shopDisabled = false
        }
      },
      'currentScopeId.cityId': {
        immediate: true,
        handler (v) {
          if (v !== '') {
            this.currentScope = {
              scopeStatus: this.currentScopeId.poiId === -1 ? 0 : 1,
              cityId: this.currentScopeId.cityId === -1 ? '' : this.currentScopeId.cityId,
              poiId: this.currentScopeId.poiId === -1 ? '' : this.currentScopeId.poiId
            }
          }
        }
      }
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
        const scope = this.scopeList && this.scopeList.find(item => item.id === this.currentScope.poiId)
        return {
          cityName: get(scope, 'cityName') || '',
          poiName: get(scope, 'poiName') || ''
        }
      }
    },
    methods: {
      ...mapActions(['setCurrentScope', 'getData']),
      handleScopeChange (v) {
        if (v === 1) {
          this.currentScope.poiId = ''
        }
      },
      confirmSubmit () {
        this.$refs['currentScope'].validate(async (valid) => {
          if (valid) {
            let displayShop = ''
            if (this.currentScope.scopeStatus === 0) {
              const scope = { cityId: this.currentScope.cityId, poiId: -1 }
              await this.$emit('updateScope', scope)
              let tmp = this.scopeList.filter(item => {
                return item.cityId === this.currentScope.cityId
              })[0]
              displayShop = {
                name: tmp.cityName,
                cityId: tmp.cityId,
                id: -1
              }
            } else {
              const scope = { cityId: this.currentScope.cityId, poiId: this.currentScope.poiId }
              await this.$emit('updateScope', scope)
              displayShop = this.shopList.filter(item => item.id === this.currentScope.poiId)[0]
              displayShop.cityId = this.currentScope.cityId
            }
            this.$emit('setDisplayShop', displayShop)
            this.$emit('on-confirm')
            this.$Message.info('推荐列表已生成，快选择商品开始创建吧')
          } else return false
        })
      },
      cancel () {
        this.$nextTick(() => {
          this.$refs.currentScope.resetFields()
          if (this.scope === 1) {
            this.currentScope = {
              scopeStatus: this.currentScopeId.poiId === -1 ? 0 : 1,
              cityId: this.currentScopeId.cityId,
              poiId: this.currentScopeId.poiId
            }
          }
        })
        this.$emit('on-cancel')
      }
    }
  }
</script>

<style lang="less">
.select-scope-info{
  .modal-head .modal-head-title {
    font-weight: 500;
    font-family: PingFangSC-Medium;
    font-size: 20px;
    color: #222222;
  }
  .boo-modal-footer {
    padding: 0 20px 20px 20px;
  }
  .operation-info-tip {
    line-height: 25px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    font-weight: 400;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #666666;
    border-radius: 2px;
    padding: 7px 20px 7px 20px;
    //border: 1px solid rgba(248, 186, 0, 0.2);
    border-radius: 2px;
    background-color: #F5F6FA;
    .icon {
      margin-right: 9px;
      color:rgb(102, 102, 102);
    }
  }
}

</style>
