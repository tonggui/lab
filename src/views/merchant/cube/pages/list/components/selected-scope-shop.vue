<template>
  <div style="background:#eee;padding: 20px">
    <Card :bordered="false">
      <span>选择推荐商品范围</span>
      <RadioGroup v-model="scope" type="button" @on-change="handleStatusChange" >
        <Radio :label="0">全国</Radio>
        <span>
              <Radio :label="1">指定城市或分店</Radio>
            </span>
      </RadioGroup>
      <span v-if="contentScope">所选分店为: {{ currentShop.label }}</span>
    </Card>
    <Modal
      v-model="scopeVisible"
      title="选择一个指定城市或分店"
      @on-ok="ok"
      @on-cancel="cancel">
      <Form ref="formScope" :model="formScope" :rules="ruleValidate" :label-width="80">
        <FormItem label="指定城市" prop="city" style="width:350px" >
          <Select line
                  v-model="formScope.city"
                  filterable clearable
                  @on-change="handleSelectedCity" placeholder="Select your city">
            <Option v-for="item in cityList" :value="item.value" :key="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
        <FormItem label="指定分店" prop="shop" style="width:350px" >
          <Select v-model="formScope.shop" :disabled="formScope.city == ''" placeholder="Select your shop" filterable clearable line>
            <Option v-for="item in shopList" :value="item.value" :key="item.value">{{item.label}}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: 'selected-scope-shop',
    data () {
      return {
        scope: 0,
        scopeVisible: false,
        loading1: false,
        loading2: false,
        cityList: [],
        shopList: [],
        shopDisabled: true,
        contentScope: false,
        optionsCity: [
          {
            value: 'New York',
            label: 'New York'
          },
          {
            value: 'London',
            label: 'London'
          },
          {
            value: 'Sydney',
            label: 'Sydney'
          },
          {
            value: 'Ottawa',
            label: 'Ottawa'
          },
          {
            value: 'Paris',
            label: 'Paris'
          },
          {
            value: 'Canberra',
            label: 'Canberra'
          }
        ],
        optionsShop: [
          {
            value: '0',
            label: '所选城市全部分店'
          },
          {
            value: '711',
            label: '711'
          },
          {
            value: '望京店',
            label: '望京店'
          },
          {
            value: '海淀店',
            label: '海淀店'
          }
        ],
        formScope: {
          city: '',
          shop: ''
        },
        ruleValidate: {
          city: [
            { required: true, message: 'Please select the city', trigger: ['blur', 'change'] }
          ]
          // shop: [
          //   { required: true, message: 'Please select the shop', trigger: ['blur', 'change'] }
          // ]
        }
      }
    },
    watch: {
      'formScope.city': {
        immediate: true,
        handler (v) {
          if (v === '') {
            this.shopDisabled = false
          }
        }
      }
    },
    computed: {
      currentShop () {
        return this.shopList.filter(item => item.value === this.formScope.shop)[0]
      }
    },
    methods: {
      handleChange () {
        debugger
        console.log('====')
      },
      handleStatusChange (scope) {
        if (this.scope === 1) {
          this.scopeVisible = true
          setTimeout(() => {
            this.loading1 = false
            this.cityList = this.optionsCity.map(item => {
              return {
                value: item.value,
                label: item.label
              }
            })
          }, 200)
        }
        // this.$emit('change', Boolean(status), status ? this.value : {})
      },
      ok () {
        console.log(this.formScope)
        if (this.scope === 1 && this.formScope.shop !== '') {
          this.contentScope = true
        }
        this.$Message.info('ok')
      },
      cancel () {
        this.scope = 0
        this.$Message.info('Clicked cancel')
      },
      handleSelectedCity (v) {
        // console.log(v)
        this.loading2 = true
        setTimeout(() => {
          this.loading2 = false
          this.shopList = this.optionsShop.map(item => {
            return {
              value: item.value,
              label: item.label
            }
          })
        }, 200)
        this.formScope.shop = '0'
      }
    }
  }
</script>

<style scoped>

</style>
