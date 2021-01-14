<template>
  <div class="category-recovery">
    <CategoryPath
      :value="value"
      :disabled="!editing"
      :isCorrect="true"
      :showProductList="false"
      @change="handleChange"
    />
  </div>
</template>

<script>
  import CategoryPath from '@/components/category-path'

  export default {
    name: 'category-recovery',
    components: { CategoryPath },
    props: {
      value: {
        required: true
      },
      editing: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      handleChange (value) {
        this.$emit('input', value)
      }
    }
  }
</script>
