<template>
  <StickyFooter
    :gap="10"
    size="normal"
    :btnTexts="btnTexts"
    :btnProps="[{ loading: submitting, disabled: categoryTemplateApplying }, { style: 'min-width: 70px;margin-right: 5px' }]"
    :btnTips="btnTips"
    @on-click="handleClick"
  />
</template>

<script>
  import { debounce } from 'lodash'
  import StickyFooter from '@/components/sticky-footer'
  export default {
    name: 'form-footer',
    components: {
      StickyFooter
    },
    props: {
      isCreate: Boolean,
      auditBtnText: {
        type: String,
        default: ''
      },
      onConfirm: Function,
      submitting: Boolean,
      categoryTemplateApplying: Boolean
    },
    computed: {
      btnTips () {
        return this.categoryTemplateApplying ? ['分类模板提交中...'] : []
      },
      btnTexts () {
        const btnTexts = ['取消']
        if (this.auditBtnText) {
          btnTexts.unshift(this.auditBtnText)
        } else {
          btnTexts.unshift(this.isCreate ? '确认发布商品' : '保存商品')
        }
        return btnTexts
      }
    },
    methods: {
      handleClick: debounce(function (idx) {
        if (idx === 0) {
          this.$emit('confirm')
        } else if (idx === 1) {
          this.$emit('cancel')
        }
      }, 300)
    }
  }
</script>
