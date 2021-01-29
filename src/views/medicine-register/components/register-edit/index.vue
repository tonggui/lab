<template>
  <Modal
    v-model="isShow"
    title="疫情药品设置"
    class-name="medicine-register-modal"
    :width="600"
    @on-ok="submitHandle"
    @on-cancel="handleCancel"
  >
    <Form ref="form" :model="formData" :rules="formRules" :label-width="80">
      <FormItem label="城市" prop="cityId">
        <Select v-model="formData.cityId" :disabled="isEdit">
          <Option v-for="item in cityList" :value="item.cityId" :key="item.cityId">{{ item.cityName }}</Option>
        </Select>
      </FormItem>
      <FormItem label="购买方式" prop="purchaseType">
        <Select v-model="formData.purchaseType">
          <Option v-for="item in purchaseTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="商品限制" prop="matchingRules">
        <Select v-model="formData.matchingRules">
          <Option v-for="item in matchingRulesList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="商品信息" prop="productInfo">
        <Input v-model="formData.productInfo" type="textarea" :autosize="{minRows: 5,maxRows: 7}" :placeholder="productInfoTips"></Input>
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
  import { registerType as purchaseTypeList, registerMethod as matchingRulesList } from '@/data/constants/medicine/register'
  import { registerAdd as addSettings, registerUpdate as updateSettings } from '@/data/api/medicineRegister'
  import { formData, formRules, productInfoTipsMap } from './config'
  import { helper } from '../../product/store'
  const { mapState } = helper('product')

  export default {
    name: 'medicine-register-modal',
    data () {
      return {
        isEdit: false,
        isShow: false,
        purchaseTypeList,
        matchingRulesList,
        formData,
        formRules
      }
    },
    computed: {
      ...mapState([
        'cityList'
      ]),
      productInfoTips () {
        return productInfoTipsMap[this.formData.matchingRules] || '请输入'
      },
      submitData () {
        return this.isEdit ? updateSettings : addSettings
      }
    },
    methods: {
      show (editData) {
        this.isEdit = !!editData
        this.isShow = true
        if (this.isEdit) {
          this.formData = { ...editData }
        } else {
          this.formData = { ...formData }
        }
      },
      submitHandle () {
        return new Promise(async (resolve, reject) => {
          if (await this.$refs.form.validate()) {
            try {
              await this.submitData({ ...this.formData })
              resolve()
              this.$Message.success(`${this.isEdit ? '修改' : '添加'}设置成功～`)
            } catch (err) {
              this.$Message.error(err.message)
              reject(err)
            }
          } else {
            reject(new Error('请按要求填写信息'))
          }
        })
      },
      handleCancel () {
        this.$refs.form.resetFields()
      }
    }
  }
</script>

<style lang="less">
.medicine-register-modal {
  .boo-modal .boo-modal-body {
    padding-top: 36px;
    padding-right: 30px;
    min-height: 400px;
    max-height: 500px;
    overflow: auto;
  }
  .modal-head-title,
  .boo-modal-footer {
    text-align: center;
  }
  .boo-modal-footer button + button {
    margin-left: 30px;
  }
  .boo-form .boo-form-item-label {
    font-size: 12px;
  }
  textarea.boo-input,
  .boo-form-item-content {
    font-size: 12px;
  }
}
</style>
