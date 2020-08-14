<template>
  <Upload
    action="disabledActionUrl"
    :before-upload="abortUpload"
    :show-upload-list="false"
    v-bind="$attrs"
  >
    <Button type="primary" size="large">{{value ? reselectText : selectText}}</Button>
    <Button
      v-if="value"
      type="text"
      size="large"
      icon="attach-file"
      disabled
    >{{value.name}}</Button>
  </Upload>
</template>

<script>
  export default {
    name: 'FileSelect',
    props: {
      value: File,
      validator: Function,
      selectText: {
        type: String,
        default: () => '选择文件'
      },
      reselectText: {
        type: String,
        default: () => '重新选择'
      }
    },
    methods: {
      async abortUpload (file) {
        const validator = this.validator
        if (typeof validator === 'function' && await validator(file)) {
          return
        }
        this.$emit('input', file)
        this.$emit('change', file)
        return false
      }
    }
  }
</script>
