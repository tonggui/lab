<template>
  <div class="pic-display">
    <img :src="src" alt="图片详情">
    <div class="upload-again" v-if="reUpload">
      <p class="blocks failed">
        <Icon type="sentiment-dissatisfied" />
        <span>上传失败</span>
      </p>
      <p class="blocks icon" @click="UploadAgain">
        <Icon type="refresh" />
        <span>重新上传</span>
      </p>
      <p class="blocks icon" @click="deletePic">
        <Icon local="trash" class="local-icon" />
        <span>删除</span>
      </p>
    </div>
    <div class="opr-backdrop" v-if="!reUpload && !loading">
      <p :class="['blocks', 'icon', { 'invisible': !moveUp }]" @click="move('up')">
        <Icon type="arrow-upward" />
        <span>上移</span>
      </p>
      <p class="blocks icon" @click="deletePic">
        <Icon local="trash" class="local-icon" />
        <span>删除</span>
      </p>
      <p :class="['blocks', 'icon', { 'invisible': !moveDown }]" @click="move('down')">
        <Icon type="arrow-downward" />
        <span>下移</span>
      </p>
    </div>
    <div class="blocks icon loading" v-show="!reUpload && loading">
      <Icon type="refresh" class="icon-loading" />
      <span>上传中...</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'pic-details-display',
    props: {
      src: { // 图片链接
        type: String,
        required: true
      },
      moveUp: { // 是否显示上移按钮
        type: Boolean,
        default: false
      },
      moveDown: { // 是否显示下移按钮
        type: Boolean,
        default: false
      },
      reUpload: { // 上传失败，显示【重新上传】，或【删除】符号
        type: Boolean,
        default: false
      }
    },
    data () {
      return {}
    },
    computed: {
      loading () {
        return this.src.indexOf('data:image') > -1
      }
    },
    methods: {
      move (direction) {
        this.$emit('move', direction === 'down' ? 1 : -1)
      },
      UploadAgain () {
        this.$emit('upload-again')
      },
      deletePic () {
        this.$emit('delete-pic')
      }
    }
  }
</script>

<style lang='less' scoped>
@img-width: 520px;

.pic-display {
  position: relative;
  display: table;
  width: @img-width;
  min-height: 70px;
  img {
    width: @img-width;
    display: table-cell;
  }
  .invisible {
    visibility: hidden;
  }
  .opr-backdrop {
    display: none;
  }
  .upload-again {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: @img-width;
    height: 100%;
    min-height: 70px;
    background-color: #000;
    opacity: 0.7;
    cursor: pointer;
    .failed {
      color: red !important;
    }
    .icon:hover {
      color: @brand-auxiliaray-color-1;
    }
  }
  .blocks {
    display: block;
    font-size: 30px;
    color: #fff;
    text-align: center;
    margin-bottom: 0;
    span {
      display: block;
      font-size: 14px;
      padding-top: 2px;
    }
  }
  .loading {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: @img-width;
    height: 100%;
    color: #fff;
    background: #000;
    opacity: .7;
    .icon-loading {
      font-size: 60px;
    }
    span {
      font-size: 16px;
      padding-top: 6px;
    }
  }
  &:hover {
    .opr-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: @img-width;
      height: 100%;
      min-height: 70px;
      background-color: #000;
      opacity: 0.7;
      .icon {
        display: block;
        font-size: 30px;
        color: #fff;
        text-align: center;
        span {
          display: block;
          font-size: 14px;
          padding-top: 10px;
        }
      }
      .icon:hover {
        color: @highlight-color;
      }
    }
  }
}
</style>
<style lang='less'>
.pic-display {
  .local-icon {
    font-size: 26px;
    path {
      fill: #fff;
    }
  }
  &:hover {
    .icon:hover {
      .local-icon {
        path {
          fill: @highlight-color;
        }
      }
    }
  }
}
</style>
