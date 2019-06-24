<template>
  <div>
    <Card>
      <DownloadModal :visible="true" />
    </Card>
  </div>
</template>

<script>
import DownloadModal from './index'
export default {
  name: 'download-modal-demo',
  components: {
    DownloadModal
  }
}
</script>
