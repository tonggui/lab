<template>
  <div class="sp-detail-page">
    <div class="form-container">
      <Loading v-if="loading" />
      <Form
        v-else
        v-model="data"
        navigation
        :context="context"
        :is-edit-mode="isEditMode"
        :disabled="true"
        ref="form"
      >
        <div slot="footer">
          <Button @click="handleCancel">返回</Button>
        </div>
      </Form>
    </div>
  </div>
</template>
<script>
  import createForm from '@/views/components/configurable-form/instance/standard-audit'
  import { getContext } from '@/views/components/configurable-form/instance/standard-audit/initData'

  import { fetchSpDetailInfo } from '@/data/repos/medicine'
  import lx from '@/common/lx/lxReport'
  import { convertIn } from '../new-sp-apply/utils'

  const Form = createForm()

  export default {
    name: 'SpDetail',
    data () {
      return {
        loading: true,
        data: {}
      }
    },
    components: {
      Form
    },
    computed: {
      context () {
        const context = getContext()
        return context
      },
      spId () {
        return this.$route.query.spId
      },
      isEditMode () {
        return this.spId > 0
      },
      poiId () {
        return this.$route.query.wmPoiId
      }
    },
    async mounted () {
      try {
        this.loading = true
        if (this.spId) {
          await this.getSpDetail()
        }
      } catch (err) {
        console.error(err)
        this.$Message.error(err.message)
      } finally {
        this.loading = false
      }
    },
    methods: {
      handleCancel () {
        window.history.go(-1)
      },
      async getSpDetail () {
        try {
          const { auditStatus, ...spInfo } = await fetchSpDetailInfo(this.poiId, this.spId)
          this.data = convertIn(spInfo)
          lx.mv({
            bid: 'b_shangou_online_e_kthpf02y_mv',
            val: { poi_id: this.poiId }
          })
        } catch (err) {
          console.error(err)
          this.$Message.error(err.message)
        }
      }
    }
  }
</script>
<style scoped lang="less">
.sp-detail-page {
  display: flex;
  .form-container {
    flex: 1;
  }
}
</style>
