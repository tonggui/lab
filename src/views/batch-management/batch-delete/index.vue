<template>
  <ProductDelete v-if="havePermission" @submit="handleSubmit" :context="modules" :isSinglePoi="isSinglePoi" :routerTagId="routerTagId" :isBusinessClient="isBusinessClient" />
  <EmptyTip v-else></EmptyTip>
</template>
<script>
  import ProductDelete from './components/product-delete'
  import { fetchGetTagList } from '@/data/repos/category'
  import { mapModule } from '@/module/module-manage/vue'
  import {
    BUSINESS_MEDICINE
  } from '@/module/moduleTypes'
  import { forceGetPermission } from '@/views/components/permission-bth/getPermissionMixin'
  import EmptyTip from '../components/empty-tip'

  export default {
    name: 'product-batch-delete-container',
    mixins: [forceGetPermission('DEL_PRODUCT')],
    props: {
      isSinglePoi: Boolean,
      routerTagId: [Number, String]
    },
    inject: ['appState'],
    data () {
      return {
        tagList: []
      }
    },
    components: { ProductDelete, EmptyTip },
    computed: {
      ...mapModule({
        isMedicine: BUSINESS_MEDICINE
      }),
      isBusinessClient () {
        return this.appState.isBusinessClient
      },
      modules () {
        return {
          isSinglePoi: this.isSinglePoi,
          isMedicine: this.isMedicine,
          enableProductPackage: true,
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
