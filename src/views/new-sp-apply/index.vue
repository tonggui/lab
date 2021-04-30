<template>
  <div class="sp-apply-page">
    <div class="form-container">
      <Alert v-if="auditApproved" type="success" show-icon>此商品已录入商品库，可前往商品库新建此商品。</Alert>
      <Alert v-if="auditing" type="warning" show-icon>此商品正在审核中，请等待审核完成或撤销审核后再进行修改</Alert>
      <Loading v-if="loading" />
      <Form
        v-else
        v-model="data"
        navigation
        :context="context"
        :is-edit-mode="isEditMode"
        :disabled="auditing || auditApproved || !havePermission"
        ref="form"
      >
        <div slot="footer">
          <Button @click="handleCancel">取消</Button>
          <PermissionBtn :btn-type="btnType" type="primary" :loading="submitting" @click="handleCrateProductBySp" v-if="auditApproved">新建此商品</PermissionBtn>
          <template v-else-if="auditing">
            <PermissionBtn :btn-type="btnType" type="primary" :loading="submitting" @click="handleRevokeAudit" v-if="isSelfSp">撤销审核</PermissionBtn>
          </template>
          <template v-else>
            <PermissionBtn :btn-type="btnType" style="margin-right: 10px;" v-if="isSelfSp" @click="handleSave" :loading="submitting">保存</PermissionBtn>
            <PermissionBtn :btn-type="btnType" type="primary" :loading="submitting" @click="handleAudit">提交审核</PermissionBtn>
          </template>
        </div>
      </Form>
    </div>
    <AuditProcess
      v-if="approved"
      class="sp-audit-process"
      :steps="tasks"
      :current="auditCurrentTask"
      :auditStatus="auditProcessState"
      :formatter="auditTaskFormat"
    />
  </div>
</template>
<script>
  import createForm from '@/views/components/configurable-form/instance/standard-audit'
  import { getContext } from '@/views/components/configurable-form/instance/standard-audit/initData'
  import createProductCorrectionAuditTips from '@/views/components/configurable-form/plugins/audit-field-tips/sp-correct-field'
  import { SKU_FIELD } from '@/views/components/configurable-form/field'

  import AuditProcess from '@/components/audit-process'
  import {
    fetchSpAuditDetailInfo,
    saveOrUpdate,
    commitAudit,
    cancelAudit
  } from '@/data/repos/medicineSpAudit'
  import { getSpConfig } from '@/data/api/medicineSpCorrect'
  import { PRODUCT_AUDIT_STATUS } from '@/data/enums/product'
  import { findLastIndex, findIndex, merge } from 'lodash'
  import lx from '@/common/lx/lxReport'
  import { convertIn, convertTo } from './utils'
  import getPermissionMixin from '@/views/components/permission-bth/getPermissionMixin'

  const Form = createForm({ plugins: [createProductCorrectionAuditTips()] })

  const errorAuditStatus = {
    3: '审核驳回',
    4: '审核驳回'
  }

  const auditStatusText = {
    1: '审核中',
    2: '审核通过',
    6: '审核撤销',
    7: '审核中', // 审核驳回待审核
    ...errorAuditStatus
  }

  export default {
    name: 'SpApply',
    mixins: [getPermissionMixin('CREATE_EDIT')],
    data () {
      return {
        submitting: false,
        loading: true,
        data: {},
        tasks: [],
        auditStatus: 0,
        isSelfSp: true
      }
    },
    components: {
      AuditProcess,
      Form
    },
    computed: {
      context () {
        // 默认context兜底
        return this.formContext || getContext()
      },
      spId () {
        return this.$route.query.spId
      },
      isEditMode () {
        return this.spId > 0
      },
      poiId () {
        return this.$route.query.wmPoiId
      },
      approved () {
        return this.auditStatus > 0
      },
      auditApproved () {
        return this.auditStatus === 2
      },
      auditing () {
        return this.auditStatus === 1
      },
      auditCurrentTask () {
        if (this.auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_APPROVED) {
          return this.tasks.length
        }
        const taskList = this.tasks || []
        // 新增兼容逻辑。
        // 后端只有固定节点，而非日志形式。需要解决！！！
        let idx = findIndex(taskList, task => [1, 7].includes(task.auditState))
        if (idx > -1) { // 没有待审核/审核中逻辑，就找非0逻辑
          idx = findLastIndex(taskList, task => task.auditState !== 0)
        }
        return idx > -1 ? idx : 0
      },
      auditProcessState () {
        if (this.auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_APPROVED) return 'finish'
        const taskList = this.tasks || []
        const lastTask = taskList[this.auditCurrentTask]
        if (!lastTask) return 'error'
        return errorAuditStatus[lastTask.auditState] ? 'error' : 'process'
      }
    },
    async mounted () {
      try {
        this.loading = true
        if (this.spId) {
          await this.getDetail()
        }
        await this.getCorrectConfig()
      } catch (err) {
        console.error(err)
        this.$Message.error(err.message)
      } finally {
        this.loading = false
      }
    },
    methods: {
      async getCorrectConfig () {
        const context = getContext()
        const featureContext = {
          features: {
            navigation: true,
            audit: {
              originalProduct: this.originalFormData,
              needCorrectionAudit: !!this.originalFormData
            }
          }
        }
        // 纠错情况下且标品审核状态不为审核中和审核成功 走标品纠错逻辑
        const disabledContext = !!this.originalFormData && !this.auditing && !this.auditApproved ? await getSpConfig() : {}
        const formContext = merge({}, context, featureContext, disabledContext)
        // 商家在帮助修改其他商家提报的标品信息时，UPC不可修改
        if (!this.isSelfSp) {
          formContext.skuField[SKU_FIELD.UPC_CODE].disabled = true
        }
        this.formContext = formContext
      },
      // 审核记录展示
      auditTaskFormat (task, key, i) {
        const nodeName = task.nodeName || '系统审核'
        if (key === 'title') {
          return auditStatusText[task.auditState] ? `${nodeName} - ${auditStatusText[task.auditState]}` : nodeName
        }
        // 如果当前序号大于目前进行中的任务节点，则异常后续信息（解决后端驳回场景下未增加节点的问题）
        if (i > this.auditCurrentTask) { return '' }
        return errorAuditStatus[task.auditState] ? (`驳回原因：${task.comment || ''}`) : ''
      },
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
            lx.mc({ bid: 'b_shangou_online_e_bu6a7t4y_mc' })
            // type:0 普通保存, 1 纠错保存
            const params = {
              ...convertTo(this.data),
              type: this.originalFormData ? 1 : 0
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
            if (this.approved) {
              if (this.auditStatus === PRODUCT_AUDIT_STATUS.AUDIT_REJECTED) {
                lx.mc({ bid: 'b_shangou_online_e_g5fuux6s_mc' })
              } else {
                lx.mc({ bid: 'b_shangou_online_e_intsrqmk_mc' })
              }
            } else {
              lx.mc({ bid: 'b_shangou_online_e_1u0h2fds_mc' })
            }
            const params = {
              ...convertTo(this.data),
              type: this.originalFormData ? 1 : 0
            }
            await commitAudit(this.poiId, this.spId, params)
            this.$Message.success('成功提交审核')
            this.$Modal.confirm({
              title: '成功提交审核',
              content: '商品审核通过后可从商品库新建该商品。您可以在「商品审核」中查看审核进度。',
              centerLayout: true,
              iconType: null,
              okText: '返回商品库',
              cancelText: '查看商品审核',
              onOk: () => {
                this.$router.replace({ name: 'spCreate', query: { wmPoiId: this.poiId } })
              },
              onCancel: () => {
                this.$router.replace({ name: 'spAuditList', query: { wmPoiId: this.poiId } })
              }
            })
          }
        } catch (e) {
          this.$Message.error(e.message)
        } finally {
          this.submitting = false
        }
      },
      async triggerRevokeAudit () {
        try {
          this.submitting = true
          lx.mc({ bid: 'b_shangou_online_e_sabt9fgm_mc' })
          // 标品纠错审核撤销type===1,普通标品审核撤销type===0
          const type = this.originalFormData ? 1 : 0
          await cancelAudit(this.spId, type)
          this.$Message.success('审核撤销成功')
          setTimeout(this.goBack, 1000)
        } catch (e) {
          this.$Message.error(e.message)
        } finally {
          this.submitting = true
        }
      },
      async handleRevokeAudit () {
        this.$Modal.confirm({
          title: '撤销商品审核',
          content: `撤销【${this.data.name}】的商品审核`,
          onOk: this.triggerRevokeAudit
        })
      },
      handleCrateProductBySp () {
        lx.mc({ bid: 'b_shangou_online_e_zmq94k4l_mc' })
        this.$router.push({
          name: 'spCreate',
          query: {
            wmPoiId: this.poiId,
            name: this.data.name || '',
            upc: (this.data.upcList || [])[0] || ''
          }
        })
      },
      handleCancel () {
        // 审核过的商品，无法再次编辑，所以可以直接返回。其他场景需要确认后退出
        if (!this.approved) {
          lx.mc({ bid: 'b_shangou_online_e_zymhs1z7_mc' })
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
      async getDetail () {
        try {
          const { tasks = [], auditStatus, originSpProduct, wmPoiId, ...spInfo } = await fetchSpAuditDetailInfo(this.poiId, this.spId)
          this.data = convertIn(spInfo)
          this.originalFormData = originSpProduct ? convertIn(originSpProduct) : originSpProduct
          this.isSelfSp = !!(wmPoiId === parseInt(this.$route.query.wmPoiId))
          this.tasks = tasks
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
.sp-apply-page {
  display: flex;
  .form-container {
    flex: 1;
  }
  .sp-audit-process {
    width: 300px;
    background: #fff;
    margin-left: 20px;
  }
}
</style>
