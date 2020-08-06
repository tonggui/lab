<template>
  <div class="picture-recovery">
    <ProductPicture
      :value="value"
      :showDescription="false"
      :box-style="boxStyle"
      :disabled="!editing"
      @change="handleChange"
      :keepSpot="false"
    />
  </div>
</template>

<script>
  import ProductPicture from '@/components/product-picture'

  export default {
    name: 'picture-recovery',
    components: { ProductPicture },
    props: {
      value: {
        required: true
      },
      editing: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        boxStyle: {
          margin: '0 10px 10px 0'
        }
      }
    },
    methods: {
      handleChange (value) {
        this.$emit('input', value)
      }
    }
  }
</script>
