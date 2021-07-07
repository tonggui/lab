<template>
  <div style="background：rgb(247, 248, 250);padding-bottom: 10px">
    <Card :bordered="false">
      <span style="margin: 0 30px">选择推荐商品范围</span>
      <RadioGroup v-model="scope" type="button" @on-change="handleStatusChange" >
        <Radio :label="-1">全国</Radio>
        <span @click="handleStatusClick">
          <Radio :label="1">指定城市或分店</Radio>
        </span>
      </RadioGroup>
    </Card>
    <div class="display-tip">
      <Card>
        当前基于美团平台“{{ displayShop.name }}”商品搜索及销售数据进行推荐。所选商品默认关联本账号“全部分店”，如需变更请在“已选商品”或“完善商品信息”中修改
      </Card>
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
      })
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
.display-tip{
  margin-top: 10px;
}
</style>
