<template>
  <div class="container">
    <PictureBox
      v-for="(pic, index) in valueSelf"
      :key="index"
      :src="pic.src"
      :poor="pic.poor"
      :tag="index === 0 ? '主图' : null"
      :required="index === 0"
      :description="tips[index]"
      :move="{
        prev: index > 0,
        next: index < valueSelf.length - 1
      }"
      @click="handleUploadClick(index)"
      @delete="handleDeleteClick(index)"
      @move="type => handleMoveClick(type, index)"
    />
    <PictureChooseModal
      :score="score"
      :keywords="keywords"
      :poiIds="poiIds || (poiId ? [poiId] : [])"
      :hasUpc="hasUpc"
      :visible="modalVisible"
      @cancel="handleModalHide"
      @confirm="handleModalConfirm"
    />
  </div>
</template>

<script>
  import isPlainObject from 'lodash/isPlainObject'
  import PictureBox from './picture-box'
  import PictureChooseModal from './picture-choose-modal'
  const PICTURE_DESCRIPTIONS = [
    '主图展示位',
    '建议展示包装',
    '建议展示原材料',
    '建议展示特写',
    '建议展示卖点'
  ]

  const convertPictureValue = src => {
    if (isPlainObject(src)) {
      return {
        src: src.src,
        poor: !!src.poor
      }
    } else {
      return {
        src,
        poor: false
      }
    }
  }

  const convertToInnerContent = (pics, size) => {
    if (size < 1) throw new Error("size can't be smaller than 1")
    const list = pics.slice(0, size).map(pic => convertPictureValue(pic))
    while (list.length < size) list.push(convertPictureValue(''))
    return list
  }

  const convertToOutsideContent = (pics, score) => {
    if (score) return pics
    else return pics.map(pic => (pic.src !== undefined ? pic.src : pic))
  }
  /**
   * event {change}
   */
  export default {
    name: 'product-picture',
    props: {
      value: {
        type: Array,
        validator: val => {
          return val.every(it => typeof it === 'string')
        },
        default: () => ['', '', '', '', '']
      },
      size: {
        type: Number,
        default: 5
      },
      tips: {
        type: Array,
        default: () => PICTURE_DESCRIPTIONS
      },
      keywords: {
        type: String,
        default: ''
      },
      score: {
        type: Boolean,
        default: false
      },
      poiId: {
        type: [String, Number],
        default: null
      },
      poiIds: {
        type: Array,
        default: () => [],
        validator: val => {
          return val.every(
            it => typeof it === 'string' || typeof it === 'number'
          )
        }
      },
      hasUpc: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        valueSelf: null,
        drawerVisible: false
      }
    },
    watch: {
      value: {
        immediate: true,
        handler (val) {
          this.valueSelf = convertToInnerContent(val, this.size)
        }
      }
    },
    methods: {
      handleUploadClick (index) {
        this.curIndex = index
        this.modalVisible = true
      },

      handleModalHide () {
        this.modalVisible = false
      },

      handleModalConfirm (src) {
        this.changePictures(this.curIndex, src)
        this.handleModalHide()
      },

      handleDeleteClick (index) {
        this.changePictures(index, '')
      },

      handleMoveClick (type, index) {
        const value = this.valueSelf
        const source = index
        const target = type === 'prev' ? index - 1 : index + 1
        if (target < 0 || target > value.length - 1) return

        const left = Math.min(source, target)
        const right = Math.max(source, target)
        this.triggerValueChanged(
          [].concat(
            value.slice(0, left),
            value[right],
            value[left],
            value.slice(right + 1, value.length)
          )
        )
      },

      triggerValueChanged (value) {
        this.$emit('change', convertToOutsideContent(value, this.score))
        this.valueSelf = value
      },

      changePictures (index, src) {
        const value = this.valueSelf
        this.triggerValueChanged(
          [].concat(
            value.slice(0, index),
            convertPictureValue(src),
            value.slice(index + 1, value.length)
          )
        )
      }
    },
    components: {
      PictureBox,
      PictureChooseModal
    }
  }
</script>

<style scoped>
.container {
  margin: -10px;
}
</style>
