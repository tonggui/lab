<template>
  <SlideUp>
    <div v-if="!hasClosed">
      <HotRecommend @close="handleClose" />
    </div>
  </SlideUp>
</template>
<script>
  import localStorage, { KEYS } from '@/common/local-storage'
  import SlideUp from '@/transitions/slide-up'
  import HotRecommend from './hot-recommend'

  export default {
    name: 'hot-recommend-container',
    data () {
      return {
        storage: localStorage[KEYS.HOT_RECOMMEND]
      }
    },
    watch: {
      storage (storage) {
        localStorage[KEYS.HOT_RECOMMEND] = storage
      }
    },
    computed: {
      poiId () {
        return this.$route.query.wmPoiId
      },
      hasClosed () {
        return this.storage && this.storage[this.poiId]
      }
    },
    components: {
      HotRecommend,
      SlideUp
    },
    methods: {
      handleClose () {
        const storage = { ...(this.storage || {}) }
        storage[this.poiId] = 1
        this.storage = storage
      }
    }
  }
</script>
