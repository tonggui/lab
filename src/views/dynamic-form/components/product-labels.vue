<template>
  <div class="product-labels">
    <Select multiple style="width:260px" :value="value" v-on="$listeners">
      <Option v-for="item in labels" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
  </div>
</template>

<script>
export default {
  name: 'product-labels',
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      labels: [
        {
          value: 1,
          label: '招牌'
        },
        {
          value: 2,
          label: '热销'
        },
        {
          value: 3,
          label: '推荐'
        }
      ]
    }
  }
}
</script>
