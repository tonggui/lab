<template>
  <div class="sp-correct-page">
    <div class="form-container">
      <Alert v-if="isEdit" class="tip alert" type="warning" show-icon>
        标品数据来自基础库，可能与您正在售卖的商品不同（商品未优化更新）
      </Alert>
      <Alert v-if="isEdit" class="tip warning" type="warning">
        标品纠错须知
        <a class="link" :href="url" target="_blank">去看看</a>
      </Alert>
      <Loading v-if="loading" />
      <Form
        v-else
        v-model="data"
        navigation
        :context="context"
        :is-edit-mode="true"
        :disabled="!isEdit"
        ref="form"
      >
        <div slot="footer">
          <template v-if="isEdit">
            <Button @click="handleCancel">取消</Button>
            <Button v-if="isSelfSp" @click="handleSave" :loading="submitting">保存</Button>
            <Button type="primary" :loading="submitting" @click="handleAudit">提交审核</Button>
          </template>
          <template v-else>
            <Button @click="handleCancel">返回</Button>
          </template>
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
  import { PRODUCT_CORRECT_IFRAME_URL } from '@/data/constants/product'
  import { saveOrUpdate, commitAudit } from '@/data/repos/medicineSpAudit'
  import { fetchSpDetailInfo } from '@/data/repos/medicine'
  import { convertIn, convertTo } from '../new-sp-apply/utils'

  const Form = createForm({ plugins: [createProductCorrectionAuditTips()] })

  export default {
    name: 'SpCorrect',
    data () {
      return {
        submitting: false,
        loading: true,
        data: {},
        isSelfSp: true,
        url: PRODUCT_CORRECT_IFRAME_URL
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
              needCorrectionAudit: this.isEdit
            }
          }
        }
        const formContext = merge({}, context, extraContext)
        return formContext
      },
      spId () {
        return this.$route.query.spId
      },
      upc () {
        return this.$route.query.upc
      },
      poiId () {
        return this.$route.query.wmPoiId
      },
      isEdit () {
        return this.$route.query.type === 'correct'
      }
    },
    async mounted () {
      try {
        this.loading = true
        await this.getSpDetail()
      } catch (err) {
        console.error(err)
        this.$Message.error(err.message)
      } finally {
        this.loading = false
      }
    },
    methods: {
      async validate () {
        if (!this.$refs.form) return
        let error = null
        try {
          error = await this.$refs.form.validate({
            // breakWhenErrorOccur: false,
            // showError: true
          })
          // if (error && error.length) {
          //   error = error[0]
          // }
        } catch (err) {
          error = err.message || err
        }
        if (error) {
          this.$Message.warning(error)
        }
        return error
      },
      async handleSave () {
        try {
          this.submitting = true
          const error = await this.validate()
          if (!error) {
            // type: 1纠错
            const params = {
              ...convertTo(this.data),
              type: 1
            }
            await saveOrUpdate(this.poiId, this.spId, params)
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
            const params = {
              ...convertTo(this.data),
              type: 1
            }
            await commitAudit(this.poiId, 0, params)
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
        if (this.isEdit) {
          this.$Modal.confirm({
            title: '提示',
            content: '是否退出当前页面',
            okText: '确定',
            cancelText: '取消',
            onOk: () => this.goBack()
          })
        } else {
          this.goBack()
        }
      },
      goBack () {
        window.history.go(-1)
      },
      async getSpDetail () {
        try {
          const { wmPoiId, ...spInfo } = await fetchSpDetailInfo(this.poiId, this.spId, this.upc)
          this.data = convertIn(spInfo)
          this.originalFormData = cloneDeep(this.data)
          this.isSelfSp = !!(wmPoiId === parseInt(this.$route.query.wmPoiId))
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
    .tip {
      margin-bottom: 0;
    }
    .alert {
      color: @error-color;
      background: #fee;
    }
    .warning {
      background: #fef4d6;
      .link {
        float: right;
      }
    }
    .form-container {
      flex: 1;
    }
  }
</style>
