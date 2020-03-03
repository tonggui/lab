<template>
  <ProductDelete @submit="handleSubmit" :context="modules" :isSinglePoi="isSinglePoi" />
</template>
<script>
  import ProductDelete from './components/product-delete'
  import { fetchGetTagList } from '@/data/repos/category'
  import { mapModule } from '@/module/module-manage/vue'
  import {
    BUSINESS_MEDICINE
  } from '@/module/moduleTypes'

  export default {
    name: 'product-batch-delete-container',
    props: {
      isSinglePoi: Boolean
    },
    data () {
      return {
        tagList: []
      }
    },
    components: { ProductDelete },
    computed: {
      ...mapModule({
        isMedicine: BUSINESS_MEDICINE
      }),
      modules () {
        return {
          isSinglePoi: this.isSinglePoi,
          isMedicine: this.isMedicine,
          tagList: this.tagList
        }
      }
    },
    async mounted () {
      if (this.isSinglePoi) {
        try {
          const tagList = await fetchGetTagList()
          this.tagList = tagList
        } catch (err) {
          console.error(err)
        }
      }
    },
    methods: {
      handleSubmit () {
        this.$router.push({ path: '/batchManagement/progress', query: this.$route.query })
      }
    }
  }
</script>
