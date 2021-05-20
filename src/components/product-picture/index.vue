<template>
  <div class="container" :class="{ 'preview-container': !!preview }">
    <div>
      <slot name="before"></slot>
      <PictureBox
        v-for="(pic, index) in valueSelf"
        :key="index"
        :src="pic.src"
        :size="size"
        :poor="pic.poor"
        :tag="tags[index]"
        :tag-placement="tagPlacement"
        :required="requiredIndex.indexOf(index) >= 0"
        :description="showDescription ? tips[index] : ''"
        :class="boxClass"
        :style="boxStyle"
        :view-mode="isItemDisabled(index)"
        :selectable="selectable"
        :selected="selectable && selected === index"
        :move="{
          prev: index > 0 && !isItemDisabled(index) && !isItemDisabled(index - 1),
          next: index < valueSelf.length - 1 && !isItemDisabled(index) && !isItemDisabled(index + 1)
        }"
        @click.native="handleSelectClick(index)"
        @upload="handleUploadClick(index)"
        @delete="handleDeleteClick(index)"
        @move="type => handleMoveClick(type, index)"
      />
      <slot name="after"></slot>
    </div>
    <PictureChooseModal
      :score="score"
      :keywords="keywords"
      :poiIds="poiIds"
      :hasUpc="hasUpc"
      :minWidth="minWidth"
      :aspectRatios="aspectRatios"
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
  import TimeCounters from '@/common/lx/lxReport/lxTime'
  import ImgZoomIn from '@sfe/components-img-zoom-in'
  const previewSize = 480

  const PICTURE_DESCRIPTIONS = [
    '主图展示位',
    '建议展示包装',
    '建议展示原材料',
    '建议展示特写',
    '建议展示卖点',
    '建议展示细节',
    '建议展示细节',
    '建议展示细节'
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
    // 可用状态 补全至max数量
    // 暂不支持数组形式Disabled的补位场景！
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
      requiredIndex: {
        type: Array,
        default () {
          return [0]
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
      tagPlacement: {
        type: String,
        default: 'top-right',
        validator: (tagPlacement) => {
          return ['top-left', 'top-right'].includes(tagPlacement)
        }
      },
      keywords: {
        type: String,
        default: ''
      },
      isTimeConsuming: {
        type: Boolean,
        default: () => false
      },
      score: Boolean,
      preview: Boolean,
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
      disabled: [Boolean, Array],
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
      minWidth: {
        type: Number,
        default: 600
      },
      aspectRatios: {
        type: Array,
        default: () => [
          {
            label: '1 / 1',
            value: 1
          },
          {
            label: '4 / 3',
            value: 4 / 3
          }
        ]
      },
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
      }
    },
    methods: {
      isItemDisabled (index) {
        if (Array.isArray(this.disabled)) {
          return this.disabled.indexOf(index) >= 0
        }
        return !!this.disabled
      },
      handleUploadClick (index) {
        lx.mc({ bid: 'b_shangou_online_e_sq4jnhcd_mc' })
        this.curIndex = index
        this.modalVisible = true
      },
      handleModalHide () {
        this.modalVisible = false
        TimeCounters.stopTime('picture')
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
        const item = this.valueSelf[index]
        if (this.preview && item && item.src) {
          const originImgConfig = { width: previewSize - 40, height: previewSize - 40, objectFit: 'cover', border: '1px solid #dadada' }
          const previewImgConfig = { width: (previewSize - 40) * 3, height: (previewSize - 40) * 3, border: '1px solid #dadada' }
          this.$Modal.open({
            title: '图片预览',
            render: () => {
              return (
                <ImgZoomIn originImgSrc={item.src} originImgConfig={originImgConfig} previewImgConfig={previewImgConfig} />
              )
            },
            // content: `<img src="${item.src}" style="width:100%;max-height:${previewSize}px;object-fit: cover;" />`,
            width: `${previewSize}px`,
            closable: true,
            footerHide: true
          })
        }
        if (this.isTimeConsuming) {
          TimeCounters.setTime('picture', +new Date(), 's2e')
        }
        if (this.selected !== index) {
          this.triggerSelectedChanged(index)
        }
      }
    },
    components: {
      PictureBox,
      PictureChooseModal
      // ImgZoomIn
    }
  }
</script>

<style scoped lang="less">
.container {
  margin: 0;
  line-height: 1.5;
  &.preview-container /deep/ .pic-container {
    cursor: pointer;
  }
}
</style>
