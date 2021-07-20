<template>
  <ProductPicture
    :tips="TIPS"
    :requiredIndex="[1]"
    :max="2"
    preview
    :value="pictureList"
    :disabled="disabledList"
    :tags="['示例']"
    @change="handleImageChange"
  />
</template>

<script>
  import ProductPicture from '@/components/product-picture'
  import exampleImg from '@/assets/upc-img-example.jpg'
  import TimeCounters from '@/common/lx/lxReport/lxTime'

  export default {
    name: 'UpcImage',
    components: {
      ProductPicture
    },
    props: {
      value: String,
      disabled: Boolean
    },
    data () {
      return {
        TIPS: [
          '图片示例',
          '带条码的商品图'
        ]
      }
    },
    computed: {
      pictureList () {
        return [exampleImg, this.value || '']
      },
      disabledList () {
        if (this.disabled) return [0, 1]
        return [0]
      }
    },
    methods: {
      handleImageChange (valList = []) {
        this.$emit('on-change', valList[1])
        TimeCounters.setTime('upcImage', +new Date(), 's2s')
      }
    }
  }
</script>
