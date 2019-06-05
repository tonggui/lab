<template>
  <FooterEvaluate
    style="margin-top: 10px"
    :title="title"
    :likedNumber="likedNumber"
    :hatedNumber="hatedNumber"
    :likedRecord="likedRecord"
    @evaluate="handleEvaluate"
    @put-comment="handleEvaluateComment"
  />
</template>

<script>
import FooterEvaluate from "./footer-evaluate";
import {
  fetchEvaluation,
  fetchEvaluationSubmit
} from "@/data/repos/listRepository";
import { jumpTo } from "@sgfe/eproduct/navigator";
export default {
  name: "footer-evaluate-index",
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
  data() {
    return {
      likedNumber: 0,
      hatedNumber: 0,
      likedRecord: 0
    };
  },
  mounted() {
    fetchEvaluation({
      pageType: this.props.pageType
    }).then(evaluateData => {
      this.likedNumber = evaluateData.likedNumber;
      this.hatedNumber = evaluateData.hatedNumber;
      this.likedRecord = evaluateData.likedRecord;
    });
  },
  methods: {
    toast(title) {
      this.$Message.warning(title, 1.5);
    },
    async handleEvaluate(type) {
      if (this.likedRecord) {
        this.toast("您已评价过");
        return;
      }
      const params = {
        pageType: this.pageType,
        pageVersion: 1,
        likeType: type
      };
      try {
        await fetchEvaluationSubmit(params);
        let { likedNumber, hatedNumber, likedRecord } = this;
        if (type === 1) {
          likedNumber += 1;
        } else {
          hatedNumber += 1;
        }
        likedRecord = 1;
        this.likedNumber = likedNumber;
        this.hatedNumber = hatedNumber;
        this.likedRecord = likedRecord;
        this.toast("评价成功");
      } catch (err) {
        this.toast("评价失败");
      }
    },

    handleEvaluateComment() {
      jumpTo("/v2/help/feedback/suggest?from=productManager");
    }
  },
  components: {
    FooterEvaluate
  }
};
</script>

<style scoped></style>
