<template>
  <TagInput @change="handleChange" />
</template>
<script>
  import TagInput from '@/components/tag-input'

  export default {
    name: 'tag-input-container',
    components: {
      TagInput
    },
    methods: {
      handleChange (value) {
        const tag = value[0]
        if (!tag.name) {
          this.$emit('change', [])
          return
        }
        this.$emit('change', [tag])
      }
    }
  }
</script>
