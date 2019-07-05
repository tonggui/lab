<template>
  <div>
    <FormCard has-shadow :title="`快捷${modeString}`" :tip="`提高${modeString}商品效率`">
      快捷操作
      <Edit :value="value" @on-confirm="handleConfirm">
        <template v-slot:editing="{ value, change }">
          <Input v-model="value" @on-change="change($event.target.value)" />
        </template>
      </Edit>
    </FormCard>
    <FormCard has-shadow title="基本信息" tip="填写基本的商品信息，有利于增强商品流量，促进购买转换！">
      基本信息
    </FormCard>
    <FormCard has-shadow title="售卖信息" tip="填写售卖信息有助于买家更快的下单，库存为0的在买家端不展示">
      售卖信息
    </FormCard>
    <FormCard has-shadow title="其他信息">
      其他信息
    </FormCard>
    <FormFooter slot="footer" :is-create="isCreateMode" />
  </div>
</template>

<script>
import FormCard from './form-card'
import FormFooter from './form-footer'
import Edit from '@/components/edit'
export default {
  name: 'form',
  components: {
    FormCard,
    FormFooter,
    Edit
  },
  props: {
    spuId: [String, Number]
  },
  data () {
    return {
      value: 123
    }
  },
  computed: {
    isCreateMode () {
      return !this.spuId
    },
    modeString () {
      return this.isCreateMode ? '修改' : '新建'
    }
  },
  methods: {
    handleConfirm (newValue) {
      this.value = newValue
    }
  }
}
</script>

<style scoped>

</style>
