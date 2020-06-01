<script>
  import { isProductValid } from '../../../utils'
  import { QUALIFICATION_STATUS } from '@/data/enums/product'
  import qualificationModal from '@/components/qualification-modal'
  // import { bridgeJumpTo } from '@/components/link'
  export function handleToast (qualificationStatus, qualificationTip) {
    if (qualificationStatus === QUALIFICATION_STATUS.NO || qualificationStatus === QUALIFICATION_STATUS.EXP) {
      qualificationModal(qualificationTip, {
        title: '缺少经营资质'
      })
    } else if (qualificationStatus === QUALIFICATION_STATUS.NOT_ALLOWED) {
      this.$Modal.info({
        title: '超出经营范围',
        content: qualificationTip,
        okText: '我知道了',
        maskClosable: true
      })
    }
  }
  export default {
    name: 'qualification',
    props: {
      product: Object
    },
    computed: {
      qualificationStatus () {
        return isProductValid(this.product)
      }
    },
    methods: {
      renderContent (h) {
        return h('div', {
          class: {
            'qualification-tips': true
          }
        }, this.product.qualificationTip)
      }
    },
    render (h) {
      const qualificationStatus = this.qualificationStatus
      if (qualificationStatus) {
        return this.renderContent(h)
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
