<template>
  <div class="select-scope" style="background：rgb(247, 248, 250);">
    <div class="scope-card">
      <div class="boo-steps"><span>1</span></div>
      <span class="scope-span">选择推荐商品范围</span>
      <RadioGroup v-model="scope" type="button" @on-change="handleStatusChange" >
        <Radio :label="-1">全国</Radio>
        <span @click="handleStatusClick">
          <Radio :label="1">指定城市或分店</Radio>
        </span>
      </RadioGroup>
      <span v-show="displayShop.cityId !== -1" style="margin-left: 20px">所选{{cityOrPoiDisplay}}为: {{ displayShop.name }}</span>
    </div>
    <div class="display-tip">
      <div class="boo-steps"><span>2</span></div>
      商品勾选后默认关联{{ displayShop.name }}，加入已选列表或完善商品信息时可调整关联门店范围
    </div>
    <SelectedScopeShop :scopeVisible="scopeVisible" :scope="scope"  @updateScope="updateScope" @setDisplayShop="contentScopeStatus"
                       @on-confirm='confirmSubmit' @on-cancel="cancel"/>
  </div>
</template>

<script>
  import SelectedScopeShop from './selected-scope-shop'
  import { helper } from '@/views/merchant/cube/store'
  const { mapState, mapActions } = helper('multiCubeList')

  export default {
    name: 'index',
    components: {
      SelectedScopeShop
    },
    data () {
      return {
        scope: this.currentScopeId && this.currentScopeId.cityId !== -1 ? 1 : -1,
        scopeVisible: false,
        displayShop: {
          name: '全国',
          cityId: -1,
          id: -1
        }
      }
    },
    watch: {
      'currentScopeId.cityId': {
        immediate: true,
        handler (v) {
          if (v !== '') {
            this.scope = this.currentScopeId && this.currentScopeId.cityId !== -1 ? 1 : -1
          }
        }
      }
    },
    computed: {
      ...mapState({
        scopeLists: 'scopeList',
        currentScopeId: 'currentScope'
      }),
      cityOrPoiDisplay () {
        return this.displayShop.id === -1 ? '城市' : '分店'
      },
      recommendDisplay () {
        if (this.displayShop.cityId !== -1) {
          return this.displayShop.id === -1 ? this.displayShop.name + '全部分店' : this.displayShop.name
        } else return '本账号全部分店'
      }
    },
    methods: {
      ...mapActions(['setCurrentScope', 'getData']),
      contentScopeStatus (content) {
        this.displayShop = content
      },
      handleStatusClick () {
        if (this.scope === 1 && !this.scopeVisible) {
          this.scopeVisible = true
        }
      },
      async updateScope (scope) {
        console.log(scope)
        await this.setCurrentScope(scope).then(() => {
          this.getData().then(() => {
            this.$emit('updateSelectedProducts')
          })
        })
      },
      handleStatusChange (scope) {
        if (this.scope === 1) {
          this.scopeVisible = true
        } else {
          let displayShop = {
            name: '全国',
            cityId: -1,
            id: -1
          }
          this.contentScopeStatus(displayShop)
          const scope = { cityId: -1, poiId: -1 }
          this.updateScope(scope)
          this.$Message.info('更换范围成功')
          // this.setCurrentScope({ cityId: -1, poiId: -1 }).then(() => {
          //   this.getData().then(() => {
          //     this.$emit('updateSelectedProducts')
          //   })
          // })
        }
      },
      confirmSubmit () {
        this.scopeVisible = false
      },
      cancel () {
        this.scopeVisible = false
        this.scope = this.currentScopeId && this.currentScopeId.cityId !== -1 ? 1 : -1
      }
    }
  }
</script>

<style scoped>
.select-scope{
  font-weight: 300;
  font-family: PingFangSC-Semibold;
  font-size: 14px;
  color: #222222;
  text-align: left;
}
.scope-card{
  background: #fff;
  box-shadow: 0 0 6px 0 #F3F3F4;
  padding: 30px 70px;
  margin-bottom: 10px;
  border-radius: 2px;
}
.boo-steps{
  display: inline-block;
  width: 31px;
  height: 31px;
  background: #F4F4F5;
  line-height: 28px;
  margin-right: 16px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 50%;
  font-family: HelveticaNeue;
  font-size: 16px;
  color: #222222;
}
.scope-span{
  margin-right: 20px;
}
.display-tip{
  background: #fff;
  padding: 22px 70px;
  margin-top: 10px;
  border-bottom: 1px solid #E9EAF2;
}
</style>
