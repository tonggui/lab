<template>
  <div>
    <Cropper
      :minCropWidth="600"
      reselect
      :aspectRatios="aspectRatios"
      :src="src"
    />
    <input type="file" @change="onChange" />
  </div>
</template>

<script>
import Cropper from './index'
export default {
  name: 'cropper-demo',
  data () {
    return {
      src: '',
      aspectRatios: [
        {
          label: '16 / 9',
          value: [16, 9]
        },
        {
          label: '4 / 3',
          value: [4, 3]
        }
      ]
    }
  },
  components: {
    Cropper
  },
  methods: {
    onChange (e) {
      e.preventDefault()
      let files
      if (e.dataTransfer) {
        files = e.dataTransfer.files
      } else if (e.target) {
        files = e.target.files
      }
      const reader = new FileReader()
      reader.onload = () => {
        this.src = reader.result
      }
      reader.readAsDataURL(files[0])
    }
  }
}
</script>

<style scoped></style>
