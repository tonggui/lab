<script>
  import { getProductQualificationStatus } from '../../../utils'
  import { QUALIFICATION_STATUS } from '@/data/enums/product'
  import qualificationModal from '@/components/qualification-modal'
  export function handleToast (qualificationStatus, qualificationTip) {
    if (qualificationStatus === QUALIFICATION_STATUS.NO || qualificationStatus === QUALIFICATION_STATUS.EXP) {
      qualificationModal(qualificationTip, {
        title: '缺少经营资质'
      })
    } else if (qualificationStatus === QUALIFICATION_STATUS.NOT_ALLOWED) {
      this.$Modal.info({
        title: '超出经营范围',
        content: '申请对应营业资质后，才能售卖当前商品。',
        okText: '我知道了',
        maskClosable: true
      })
    }
  }
  export default {
    name: 'qualification',
    props: {
      product: Object,
      lackQuaText: {
        type: String,
        default: '超出经营范围，补充资质后方可售卖'
      },
      lackCateText: {
        type: String,
        default: '超出经营范围，请申请对应营业资质'
      }
    },
    computed: {
      qualificationStatus () {
        return getProductQualificationStatus(this.product)
      }
    },
    methods: {
      renderContent (h, displayText) {
        return h('div', {
          class: {
            'qualification-tips': true
          }
        }, displayText)
      }
    },
    render (h) {
      const qualificationStatus = this.qualificationStatus
      if (qualificationStatus === QUALIFICATION_STATUS.NO || qualificationStatus === QUALIFICATION_STATUS.EXP) {
        return this.renderContent(h, this.lackQuaText)
      } else if (qualificationStatus === QUALIFICATION_STATUS.NOT_ALLOWED) {
        return this.renderContent(h, this.lackCateText)
      } else {
        return null
      }
    }
  }
</script>

<style lang="less" scoped>
  .qualification-tips {
    color: #F46E65;
    &:hover {
      cursor: pointer;
    }
  }
</style>
