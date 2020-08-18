<template>
  <UploadImagePage
    :submit-data="submitData"
  />
</template>

<script>
  import UploadImagePage from '@/views/batch-management/batch-upload-img'
  import { fetchSubmitBatchUploadImage } from '@/data/repos/merchantPoi'

  export default {
    name: 'MerchantBatchUploadImage',
    components: {
      UploadImagePage
    },
    methods: {
      submitData ({ type, file }) {
        return fetchSubmitBatchUploadImage(undefined, file, 0, type)
      }
    }
  }
</script>
