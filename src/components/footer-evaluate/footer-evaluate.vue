<template>
  <div class="footer" data-lx-context="evaluate">
    <p class="footer-title">{{ title }}</p>
    <div class="footer-desc">
      <div
        class="footer-desc-item"
        @click="$emit('evaluate', 1)"
        data-lx="moduleClick(bid.good, {'custom': {type:'1'}})"
      >
        <div
          class="item-img"
          :class="
            likedRecord != 1 ? likeStatus.className : likeStatus.selectClassName
          "
        ></div>
        <p>{{ likeStatus.text }}</p>
        <p class="number">{{ likedNumber }}</p>
      </div>
      <div
        class="footer-desc-item"
        @click="$emit('evaluate', 2)"
        data-lx="moduleClick(bid.bad, {'custom': {type:'2'}})"
      >
        <div
          class="item-img"
          :class="
            likedRecord != 2 ? hateStatus.className : hateStatus.selectClassName
          "
        ></div>
        <p>{{ hateStatus.text }}</p>
        <p class="number">{{ hatedNumber }}</p>
      </div>
      <div
        class="footer-desc-item"
        @click="$emit('put-comment')"
        data-lx="moduleClick(bid.comment, {'custom': {type:'3'}})"
      >
        <div class="item-img" :class="comment.className"></div>
        <p>{{ comment.text }}</p>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * event {evaluate, put-comment}
 */
export default {
  name: "footer-evaluate",
  props: {
    title: {
      type: String,
      default: "以上功能是否对您有帮助"
    },
    likedRecord: {
      type: Number,
      default: 0
    },
    likedNumber: {
      type: Number,
      default: 0
    },
    hatedNumber: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      likeStatus: {
        className: "encourage-normal",
        selectClassName: "encourage-select",
        text: "很赞，鼓励一下"
      },
      hateStatus: {
        className: "good-normal",
        selectClassName: "good-select",
        text: "不好，继续优化"
      },
      comment: {
        className: "comment-normal",
        text: "提点意见"
      }
    };
  }
};
</script>

<style scoped lang="less">
.footer {
  margin-bottom: 53px;
  padding: 20px;
  background: #fff;
  .footer-title {
    margin-top: 0;
    height: 26px;
    line-height: 26px;
    font-size: 20px;
    font-weight: bold;
    color: #3f4156;
  }
  p {
    margin-top: 10px;
    margin-bottom: 0px;
    font-size: 14px;
    height: 19px;
    line-height: 19px;
    color: #858692;
    &.number {
      margin-top: 5px;
      margin-bottom: 0;
    }
  }
  .after-line {
    content: "";
    width: 1px;
    height: 40px;
    background: #e9eaf2;
    position: absolute;
    top: 30px;
    right: 0;
  }
  .footer-desc {
    margin-top: 20px;
    display: flex;
    .footer-desc-item {
      flex: 1;
      text-align: center;
      position: relative;
      &:after {
        content: "";
        width: 1px;
        height: 40px;
        background: #e9eaf2;
        position: absolute;
        top: 22px;
        right: 0;
      }
      &:last-child {
        &:after {
          width: 0;
        }
      }
      .item-img {
        margin: 0 auto;
        height: 80px;
        width: 80px;
        zoom: 0.5;
        background: url(./img/footer-icon.png);
      }
      .encourage-normal {
        background-position: 0px 0px;
        &:hover {
          background-position: 0 160px;
        }
      }
      .encourage-select {
        background-position: 0 80px;
      }
      .comment-normal {
        background-position: 80px 0px;
        &:hover {
          background-position: 80px 160px;
        }
      }
      .comment-select {
        background-position: 80px 80px;
      }
      .good-normal {
        background-position: 160px 0px;
        &:hover {
          background-position: 160px 160px;
        }
      }
      .good-select {
        background-position: 160px 80px;
      }
    }
  }
}
</style>
