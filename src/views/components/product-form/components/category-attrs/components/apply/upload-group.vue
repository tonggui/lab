<template>
  <div class="upload-group">
    <UploadBox
      v-for="i in size"
      :key="i"
      :value="value[i - 1] || ''"
      :description="descriptionList[i - 1]"
      :required="i === 1 && required"
      @change="v => handleChange(v, i - 1)"
    />
  </div>
</template>

<script>
  import UploadBox from './upload-box'

  export default {
    name: 'upload-group',
    components: { UploadBox },
    props: {
      size: {
        type: Number,
        default: 1
      },
      value: {
        type: Array,
        default () {
          return ['']
        }
      },
      descriptionList: {
        type: Array,
        default () {
          return []
        }
      },
      required: {
        type: Boolean,
        default: true
      }
    },
    methods: {
      handleChange (v, index) {
        const newValue = this.value.slice()
        newValue[index] = v
        this.$emit('change', newValue)
      }
    }
  }
</script>

<style lang="less" scoped>
  .upload-group {
    line-height: 1.5;
  }
</style>
