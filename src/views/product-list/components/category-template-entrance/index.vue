<template>
  <Tooltip type="guide" :transfer="false" key-name="CATEGORY_TEMPLATE_ENTRANCE_TIP" content="可以一键让您的商品分类更合理，转化率更高哦，快来试试看吧。！">
    <Button :disabled="disabled" @click="!disabled && $emit('click')" icon="list" v-mc="{ bid: 'b_shangou_online_e_36dd03uq_mc' }">分类模版</Button>
  </Tooltip>
</template>
<script>
  export default {
    name: 'category-template-entrance',
    props: {
      disabled: Boolean
    }
  }
</script>
