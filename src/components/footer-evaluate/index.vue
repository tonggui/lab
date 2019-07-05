<template>
  <FooterEvaluate
    :title="title"
    :likedRecord="likedRecord"
    :hatedNumber="hatedNumber"
    :likedNumber="likedNumber"
    @evaluate="handleEvaluate"
    @put-comment="handleComment"
  ></FooterEvaluate>
</template>
<script>
import { jumpTo } from '@sgfe/eproduct/navigator'
import FooterEvaluate from './footer-evaluate'
import { fetchGetEvaluation, fetchSubmitEvaluation } from '@/data/repos/common'

export default {
  name: 'footer-evaluate-container',
  props: {
    pageType: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      likedNumber: 0,
      hatedNumber: 0,
      likedRecord: 0
    }
  },
  components: {
    FooterEvaluate
  },
  methods: {
    async handleEvaluate (type) {
      if (this.likedRecord) {
        this.$Message.warning('您已评价过')
        return
      }
      try {
        await fetchSubmitEvaluation(this.pageType, this.type)
        if (type === 1) {
          this.likedNumber += 1
        } else {
          this.hatedNumber += 1
        }
        this.likedRecord = 1
      } catch (err) {
        this.$Message.error('评价失败')
      }
    },
    handleComment () {
      jumpTo('/v2/help/feedback/suggest?from=productManager')
    }
  },
  async mounted () {
    const data = await fetchGetEvaluation(this.pageType)
    this.likedNumber = data.likedNumber
    this.hatedNumber = data.hatedNumber
    this.likedRecord = data.likedRecord
  }
}
</script>
