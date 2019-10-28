<template>
  <div class="sp-pic-details">
    <div class="description">
      <span>{{ description }}</span>
      <Tooltip
        placement="right"
        width="300px"
        :content="tips"
      >
        <Icon class="tip" style="font-size: 14px;" local="question-circle"/>
      </Tooltip>
    </div>
    <div class="thumbnail" @click="showDetails">
      <PictureBox
        :src="mainPic"
        viewMode
      />
    </div>
    <div class="switch" v-show="description">
      <Checkbox :value="value" @input="handleSwitchChange">展示给买家</Checkbox>
    </div>
    <Modal
      title="品牌商图片详情"
      v-model="showDetailModal"
      class="sp-pic-details-modal"
      footer-hide
    >
      <div class="pic-details">
        <img v-for="(pic, i) in pictureList" :key="i" :src="pic" class="pic" alt="">
      </div>
    </Modal>
  </div>
</template>

<script>
  import PictureBox from '@/components/product-picture/picture-box'
  import lx from '@/common/lx/lxReport'

  export default {
    name: 'sp-pic-details',
    components: { PictureBox },
    props: {
      value: Boolean,
      description: {
        type: String,
        default: ''
      },
      tips: {
        type: String,
        default: ''
      },
      pictureList: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data () {
      return {
        showDetailModal: false
      }
    },
    computed: {
      mainPic () {
        return this.pictureList ? (this.pictureList[0] || '') : ''
      }
    },
    methods: {
      handleSwitchChange (v) {
        this.$emit('change', v)
      },
      showDetails () {
        lx.mc({ bid: 'b_shangou_online_e_m1jca3tc_mc' })
        this.showDetailModal = true
      }
    }
  }
</script>

<style lang="less" scoped>
  .sp-pic-details {
    .description {
      line-height: 1;
      color: @text-tip-color;
      font-size: @font-size-small;
      & > span {
        vertical-align: middle;
      }
    }
    .thumbnail {
      display: inline-block;
      cursor: pointer;
      margin: 6px 0 0;
    }
  }
  .pic-details {
    .pic {
      display: block;
      width: 100%;
    }
  }
</style>
<style lang="less">
  .sp-pic-details-modal {
    .boo-modal-body {
      max-height: 500px;
      overflow: auto;
    }
  }
</style>
