<template>
  <div class="file-upload" :class="wrapperClassNames">
    <div class="file-upload-file" :class="fileClassNames">{{ file ? file.name : placeholder }}</div>
    <div class="file-upload-action">
      <Button type="primary" v-bind="buttonProps" @click="handleAction">
        {{ buttonProps.text }}
      </Button>
    </div>
    <div class="file-upload-operation" v-if="showOperation">
      <Button @click="handleFileClick" v-if="showReSelect">重新选择</Button>
      <Button @click="handleDelete">删除</Button>
    </div>
    <input
      v-show="false"
      :accept="accept"
      type="file"
      @change="handleChange"
      ref="file"
    />
  </div>
</template>
<script>
  import { STATUS, defaultStatus, UPLOAD_STATUS } from './constants'
  import lx from '@/common/lx/lxReport'
  /**
   * file-uplpad
   * 存在5中状态
   * -----
   * 1. 直接行内提交的情况（inlineUpload： true） 分为
   * -----------------
   * a. init -- 初始状态 props中initButtonText就是配置这个状态的按钮文字 只有选择文件的按钮
   * b. start -- 选择完file了 可以开始上传了 可进行重新选择和删除
   * c. upload -- 上传中 可进行重新选择和删除
   * -----------------
   * 2. 不直接行内提交，只是作为一个input
   * ----------
   * a. normal -- 存在normal状态 替代start和upload 可进行重新选择和删除
   * 除此之外
   * 3. error -- error 状态 只可进行删除
   */
  export default {
    name: 'file-upload',
    props: {
      placeholder: {
        type: String,
        default: '请选择文件'
      },
      accept: {
        type: String,
        default: ''
      },
      inlineUpload: {
        type: Boolean,
        default: true
      },
      initButtonText: {
        type: String,
        default: '选择文件'
      },
      validator: {
        type: Function,
        default: () => false
      },
      createCallback: {
        type: Function,
        default: success => success
      }
    },
    data () {
      return {
        status: defaultStatus,
        file: ''
      }
    },
    computed: {
      buttonProps () {
        const map = {
          [STATUS.INIT]: {
            icon: 'folder',
            text: this.initButtonText
          },
          [STATUS.START]: {
            icon: 'cloud-upload',
            text: '开始上传'
          },
          [STATUS.UPLOAD]: {
            icon: 'loading',
            loading: true,
            text: '正在上传'
          },
          [STATUS.ERROR]: {
            icon: 'folder',
            text: '重新选择'
          },
          [STATUS.NORMAL]: {
            icon: 'folder',
            text: '重新选择'
          }
        }
        return map[this.status]
      },
      wrapperClassNames () {
        return {
          'is-upload': this.status === STATUS.UPLOAD
        }
      },
      fileClassNames () {
        const status = this.status
        return {
          'is-error': status === STATUS.ERROR,
          'is-upload': status === STATUS.UPLOAD,
          'is-placeholder': !this.file
        }
      },
      showReSelect () {
        return [STATUS.START, STATUS.UPLOAD].includes(this.status)
      },
      showOperation () {
        return this.status !== STATUS.INIT
      }
    },
    methods: {
      handleFileClick () {
        // 上传中 不响应
        if (this.status === STATUS.UPLOAD) {
          return
        }
        this.$refs.file.click()
      },
      handleAction () {
        // 开始上传
        if (this.status === STATUS.START) {
          lx.mc({ bid: 'b_zu0s9n2f' })
          this.handleUpload()
          return
        }
        this.handleFileClick()
      },
      async handleUpload () {
        if (this.status === STATUS.UPLOAD) {
          return
        }
        this.status = STATUS.UPLOAD
        this.$emit('submit', this.file, this.createCallback((status) => {
          if (status === UPLOAD_STATUS.PENDING) {
            this.status = STATUS.START
            return
          }
          if (status === UPLOAD_STATUS.ERROR) {
            this.status = STATUS.ERROR
            return
          }
          this.reset()
        }, (err) => {
          console.error(err)
          this.$Message.error(err.message || '上传出错！')
          this.status = STATUS.ERROR
        }))
      },
      handleDelete () {
        if (this.status === STATUS.UPLOAD) {
          return
        }
        this.reset()
      },
      async handleChange (e) {
        const fileList = e.target.files
        if (!fileList || fileList.length <= 0) {
          return
        }
        const file = fileList[0]
        let status
        const error = await this.validator(file)
        if (error) {
          status = STATUS.ERROR
        } else {
          if (this.inlineUpload) {
            status = STATUS.START
          } else {
            status = STATUS.NORMAL
          }
        }
        this.status = status
        this.file = file
        this.$emit('change', file)
        this.$emit('input', file)
      },
      reset () {
        this.file = ''
        this.status = defaultStatus
        this.$refs.file.value = ''
        this.$emit('change', '')
      }
    }
  }
</script>
<style lang="less" scoped>
  @prefix: ~'file-upload';
  .@{prefix} {
    height: 36px;
    display: flex;
    align-items: center;
    margin: 10px auto;
    &.is-upload {
      .@{prefix}-file,
      button {
        cursor: not-allowed;
      }
    }
    button {
      height: 36px;
      line-height: 36px;
      margin-right: 15px;
      padding-top: 0;
      padding-bottom: 0;
    }
    &-file {
      width: 260px;
      height: 100%;
      box-sizing: border-box;
      border: 1px solid @border-color-base;
      border-right: none;
      border-top-left-radius: @border-radius-base;
      border-bottom-left-radius: @border-radius-base;
      line-height: 34px;
      padding: 0 15px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      cursor: pointer;
      &:hover:not(.is-upload) {
        border-color: @text-color;
      }
      &.is-error {
        border-color: @error-color;
      }
      &.is-placeholder {
        color: @text-tip-color;
      }
    }
    &-action button {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
</style>
