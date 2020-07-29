<template>
  <Upload
    action="disabledActionUrl"
    :before-upload="abortUpload"
    :show-upload-list="false"
    v-bind="$attrs"
  >
    <Button type="primary" size="large">{{value ? '重新选择' : '选择文件'}}</Button>
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
      value: File
    },
    methods: {
      abortUpload (file) {
        this.$emit('input', file)
        this.$emit('change', file)
        return false
      }
    }
  }
</script>
