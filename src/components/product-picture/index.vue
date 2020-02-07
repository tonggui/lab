<template>
  <div class="container">
    <div>
      <PictureBox
        v-for="(pic, index) in valueSelf"
        :key="index"
        :src="pic.src"
        :size="size"
        :poor="pic.poor"
        :tag="tags[index]"
        :required="index === 0"
        :description="showDescription ? tips[index] : ''"
        :class="boxClass"
        :style="boxStyle"
        :view-mode="disabled"
        :selectable="selectable"
        :selected="selectable && selected === index"
        :move="{
          prev: index > 0,
          next: index < valueSelf.length - 1
        }"
        @click.native="handleSelectClick(index)"
        @upload="handleUploadClick(index)"
        @delete="handleDeleteClick(index)"
        @move="type => handleMoveClick(type, index)"
      />
    </div>
    <PictureChooseModal
      :score="score"
      :keywords="keywords"
      :poiIds="poiIds"
      :hasUpc="hasUpc"
      :autoCropArea="autoCropArea"
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
  import lx from '@/common/lx/lxReport'

  const PICTURE_DESCRIPTIONS = [
    '主图展示位',
    '建议展示包装',
    '建议展示原材料',
    '建议展示特写',
    '建议展示卖点'
  ]

  const convertPictureValue = (src, poor = false) => {
    if (isPlainObject(src)) {
      return {
        src: src.src,
        poor: !!src.poor
      }
    } else {
      return {
        src,
        poor
      }
    }
  }

  const convertToInnerContent = (pics, poorList, max, disabled, keepSpot) => {
    if (max < 1) throw new Error('max can\'t be smaller than 1')
    let list = pics.slice(0, max).map((pic, i) => convertPictureValue(pic, !!poorList[i]))
    if (!keepSpot) {
      list = list.filter(v => !!v.src)
    }
    // 可用状态不全max数
    if (!disabled) {
      if (keepSpot) {
        // 补上缺失的位置
        let i = max - list.length
        while (i > 0) {
          list.push(convertPictureValue(''))
          i -= 1
        }
      } else {
        // 补上一个可以添加的位置
        if (list.length < max) list.push(convertPictureValue(''))
      }
    }
    return list
  }

  const convertToOutsideContent = (pics, score, keepSpot) => {
    if (score) return pics
    pics = pics.map(pic => (pic.src !== undefined ? pic.src : pic))
    if (!keepSpot) {
      pics = pics.filter(v => !!v)
    }
    return pics
  }

  /**
   * event {change}
   */
  export default {
    name: 'ProductPicture',
    props: {
      value: {
        type: Array,
        validator: val => {
          return val.every(it => typeof it === 'string')
        },
        default: () => ['', '', '', '', '']
      },
      poorList: {
        type: Array,
        default () {
          return []
        }
      },
      max: {
        type: Number,
        default: 5
      },
      size: {
        type: [String, Number],
        default: 'normal'
      },
      tips: {
        type: Array,
        default: () => PICTURE_DESCRIPTIONS
      },
      tags: {
        type: Array,
        default: () => ['主图']
      },
      keywords: {
        type: String,
        default: ''
      },
      score: Boolean,
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
      },
      // 是否可操作
      disabled: Boolean,
      keepSpot: {
        type: Boolean,
        default: true
      },
      showDescription: {
        type: Boolean,
        default: () => true
      },
      selectable: Boolean,
      selected: {
        type: Number,
        default: 0
      },
      boxStyle: Object,
      boxClass: String,
      autoCropArea: Number // 自动裁剪区域大小（0~1）
    },
    data () {
      return {
        valueSelf: null,
        modalVisible: false
      }
    },
    computed: {
      innerValue () {
        return convertToInnerContent(this.value, this.poorList, this.max, this.disabled, this.keepSpot)
      }
    },
    watch: {
      innerValue: {
        immediate: true,
        handler (val) {
          this.valueSelf = val
        }
      },
      modalVisible (v) {
        this.$emit(v ? 'start' : 'end')
      }
    },
    methods: {
      handleUploadClick (index) {
        lx.mc({ bid: 'b_shangou_online_e_sq4jnhcd_mc' })
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
        this.$emit('change', convertToOutsideContent(value, this.score, this.keepSpot))

        if (this.selectable) {
          this.triggerSelectedChanged(this.selected)
        }
      },
      changePictures (index, src) {
        const value = this.valueSelf
        let newValue = [].concat(
          value.slice(0, index),
          convertPictureValue(src, !!this.poorList[index]),
          value.slice(index + 1, value.length)
        )
        if (!this.keepSpot) {
          newValue = newValue.filter(v => !!v)
        }
        this.triggerValueChanged(newValue)
      },
      triggerSelectedChanged (index) {
        const selectedItem = this.valueSelf[index]
        if (selectedItem) {
          this.$emit('select', selectedItem.src, index)
        }
      },
      handleSelectClick (index) {
        if (this.selected !== index) {
          this.triggerSelectedChanged(index)
        }
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
  margin: 0;
  line-height: 1.5;
}
</style>
