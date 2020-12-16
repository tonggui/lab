<template>
  <div class="sp-correct-page">
    <div class="form-container">
      <Alert type="warning" show-icon
        >标品数据来自基础库，可能与您正在售卖的商品不同（商品未优化更新）</Alert
      >
      <Loading v-if="loading" />
      <Form
        v-else
        v-model="data"
        navigation
        :context="context"
        :is-edit-mode="true"
        ref="form"
      >
        <div slot="footer">
          <Button @click="handleCancel">取消</Button>
          <Button v-if="isSelfSp" @click="handleSave" :loading="submitting"
            >保存</Button
          >
          <Button type="primary" :loading="submitting" @click="handleAudit"
            >提交审核</Button
          >
        </div>
      </Form>
    </div>
  </div>
</template>
<script>
  import { cloneDeep, merge } from 'lodash'
  import createForm from '@/views/components/configurable-form/instance/standard-correct'
  import { getContext } from '@/views/components/configurable-form/instance/standard-correct/initData'
  import createProductCorrectionAuditTips from '@/views/components/configurable-form/plugins/audit-field-tips/sp-correct-field'
  import { SKU_FIELD } from '@/views/components/configurable-form/field'

  import { saveOrUpdate, commitAudit } from '@/data/repos/medicineSpAudit'
  import { fetchSpDetailInfo } from '@/data/repos/medicine'
  import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
  import lx from '@/common/lx/lxReport'
  import { convertIn, convertTo } from '../new-sp-apply/utils'

  const Form = createForm({ plugins: [createProductCorrectionAuditTips()] })

  export default {
    name: 'SpCorrect',
    data () {
      return {
        submitting: false,
        loading: true,
        data: {},
        auditStatus: 0,
        isSelfSp: true
      }
    },
    components: {
      Form
    },
    computed: {
      context () {
        const context = getContext()
        const extraContext = {
          features: {
            navigation: true,
            audit: {
              originalProduct: this.originalFormData,
              needCorrectionAudit: true
            }
          }
        }
        const formContext = merge({}, context, extraContext)
        // 商家在帮助修改其他商家提报的标品信息时，UPC不可修改
        if (!this.isSelfSp) {
          formContext.skuField[SKU_FIELD.UPC_CODE].disabled = true
        }
        return formContext
      },
      spId () {
        return this.$route.query.spId
      },
      poiId () {
        return this.$route.query.wmPoiId
      },
      auditing () {
        return this.auditStatus === 1
      }
    },
    async mounted () {
      try {
        this.loading = true
        await this.getSpDetail()
        // if (this.spId) {

        // }
      } catch (err) {
        console.error(err)
        this.$Message.error(err.message)
      } finally {
        this.loading = false
      }
    },
    methods: {
      async handleSave () {
        try {
          this.submitting = true
          const error = await this.validate()
          if (!error) {
            lx.mc({ bid: 'b_shangou_online_e_bu6a7t4y_mc' })
            // type: 1纠错
            const params = {
              ...convertTo(this.data),
              type: 1
            }
            await saveOrUpdate(this.poiId, this.spId, ...params)
            this.$Message.success('草稿保存成功')
            this.goBack()
          }
        } catch (e) {
          this.$Message.error(e.message)
        } finally {
          this.submitting = false
        }
      },
      async handleAudit () {
        try {
          this.submitting = true
          const error = await this.validate()
          if (!error) {
            if (this.approved) {
              if (this.auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_REJECTED) {
                lx.mc({ bid: 'b_shangou_online_e_g5fuux6s_mc' })
              } else {
                lx.mc({ bid: 'b_shangou_online_e_intsrqmk_mc' })
              }
            } else {
              lx.mc({ bid: 'b_shangou_online_e_1u0h2fds_mc' })
            }
            await commitAudit(this.poiId, this.spId, convertTo(this.data))
            this.$Message.success('成功提交审核')
            this.$Modal.confirm({
              title: '成功提交审核',
              content:
                '商品审核通过后可从商品库新建该商品。您可以在「商品审核」中查看审核进度。',
              centerLayout: true,
              iconType: null,
              okText: '返回商品库',
              cancelText: '查看商品审核',
              onOk: () => {
                this.$router.replace({
                  name: 'spCreate',
                  query: { wmPoiId: this.poiId }
                })
              },
              onCancel: () => {
                this.$router.replace({
                  name: 'spAuditList',
                  query: { wmPoiId: this.poiId }
                })
              }
            })
          }
        } catch (e) {
          this.$Message.error(e.message)
        } finally {
          this.submitting = false
        }
      },
      handleCancel () {
        // 审核过的商品，无法再次编辑，所以可以直接返回。其他场景需要确认后退出
        lx.mc({ bid: 'b_shangou_online_e_zymhs1z7_mc' })
        this.$Modal.confirm({
          title: '提示',
          content: '是否退出当前页面',
          okText: '确定',
          cancelText: '取消',
          onOk: () => this.goBack()
        })
      },
      goBack () {
        window.history.go(-1)
      },
      async getSpDetail () {
        try {
          const { auditStatus, ...spInfo } = await fetchSpDetailInfo(
            this.poiId,
            this.spId
          )
          this.data = convertIn(spInfo)
          this.originalFormData = cloneDeep(this.data)
          this.auditStatus = +auditStatus || 0
          lx.mv({
            bid: 'b_shangou_online_e_kthpf02y_mv',
            val: { poi_id: this.poiId, status: this.auditStatus }
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
  .sp-correct-page {
    display: flex;
    overflow: auto;
    .form-container {
      flex: 1;
    }
  }
</style>
