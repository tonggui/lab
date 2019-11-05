<template>
  <div style="display: inline-block">
    <div v-if="singleInline && isSingleSku" style="display: inline-block">
      <component :is="editComponent" :sku="skuList[0]" :onConfirm="handleSingleConfirm" :disabled="disabled"></component>
    </div>
    <div v-if="!singleInline || !isSingleSku" @click="!needEditIcon && showModal()" style="display: inline-block">
      <slot name="display" :sku-list="skuList"></slot>
      <Icon v-if="needEditIcon" class="edit-icon" :class="{ disabled }" color="#F89800" local="edit" @click="showModal" size="20" />
    </div>
  </div>
</template>

<script>
  import createPopper from '@/hoc/withCreatePopper'
  import Modal from './modal'
  import config from './config'

  const createModal = createPopper(Modal)

  export default {
    name: 'product-sku-edit',
    props: {
      felid: {
        type: [Number, String],
        required: true
      },
      product: {
        type: Object,
        required: true
      },
      skuList: {
        type: Array,
        required: true
      },
      disabled: Boolean,
      needEditIcon: {
        type: Boolean,
        default: true
      },
      singleInline: {
        type: Boolean,
        default: true
      },
      showWeight: Boolean,
      editType: {
        type: String,
        default: 'confirm'
      },
      createCallback: {
        type: Function,
        default: (success) => success
      },
      modalProps: {
        type: Object,
        default: () => ({})
      }
    },
    created () {
      this.$modal = null
      this.needRefresh = false
    },
    watch: {
      skuList (skuList) {
        // 更新modal
        if (this.$modal && this.$modal.value) {
          this.needRefresh = true
          this.showModal()
          return
        }
        this.needRefresh = false
        this.selfSkuList = [...skuList]
      }
    },
    computed: {
      isSingleSku () {
        return this.skuList.length <= 1
      },
      info () {
        return config[this.felid]
      },
      title () {
        return this.info.title
      },
      headerTitle () {
        return this.info.headerTitle
      },
      editComponent () {
        return this.info.editComponent[this.editType]
      }
    },
    methods: {
      handleOk (skuList) {
        this.$emit('submit', skuList, this.product)
      },
      handleConfirm (skuList, sku) {
        this.$emit('submit', skuList, sku, this.product)
      },
      handleSingleConfirm (value) {
        this.handleConfirm(this.skuList[0], value)
      },
      handleCloseModal () {
        this.needRefresh && this.$emit('done')
        this.$modal = null
      },
      showModal () {
        if (this.disabled) {
          return
        }
        const props = {
          felid: this.felid,
          skuList: this.skuList,
          product: this.product,
          edit: this.editComponent,
          showWeight: this.showWeight,
          editType: this.editType,
          ...this.modalProps
        }
        this.$modal = createModal({
          props,
          on: {
            'on-cancel': this.handleCloseModal,
            'on-ok': this.handleOk,
            'on-confirm': this.handleConfirm
          },
          slots: {
            'default': this.$slots['modal-content'],
            'footer': this.$slots['modal-footer']
          }
        })
      }
    },
    beforeDestroy () {
      this.$modal = null
    }
  }
</script>
