<script>
  import { noop } from 'lodash'
  import createModal from './modal'
  import config from './config'
  import { PRODUCT_TYPE, PRODUCT_STATUS_MAIDIAN } from '@/data/enums/product'
  import PermissionBtn from '@/views/components/permission-bth/index'
  import { FELID } from '../product-sku-edit'
  import lx from '@/common/lx/lxReport'

  export default {
    name: 'product-sku-edit',
    components: { PermissionBtn },
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
      tabValue: [String, Number] // tab当前选中值
    },
    created () {
      this.$modal = null
      this.needRefresh = false
    },
    watch: {
      skuList () {
        // 更新modal
        if (this.$modal && this.$modal.visible) {
          this.needRefresh = true
          this.showModal()
          return
        }
        this.needRefresh = false
      }
    },
    computed: {
      isSingleSku () {
        return this.skuList.length <= 1
      }
    },
    methods: {
      handleChange (sku, value, callback) {
        const info = config[this.felid] || noop
        const message = info.validator(value)
        if (message) {
          this.$Message.error(message)
          return false
        }
        this.$emit('change', this.product, sku, value, callback)
      },
      handleCloseModal () {
        this.needRefresh && this.$emit('done')
        this.$modal = null
      },
      showModal () {
        // 多规格点击
        if (this.tabValue && PRODUCT_STATUS_MAIDIAN[this.tabValue.toString()]) {
          lx.mc({
            bid: 'b_shangou_online_e_a01gqbnj_mc',
            val: {
              tab_id: PRODUCT_STATUS_MAIDIAN[this.tabValue.toString()]
            }
          })
        }
        if (this.disabled) {
          return
        }
        const props = {
          felid: this.felid,
          skuList: this.skuList,
          product: this.product,
          edit: this.$scopedSlots.edit,
          onChange: this.handleChange
        }
        this.$modal = createModal(props, {
          onClose: this.handleCloseModal
        })
      },
      handleSingleChange (value, callback) {
        return this.handleChange(this.skuList[0], value, callback)
      }
    },
    render (h) {
      const info = config[this.felid]
      let isDisplayNone = false
      if (this.felid === 1) {
        isDisplayNone = !this.product.enableStockEditing
      }
      if (this.isSingleSku) {
        const sku = this.skuList[0] || {}
        const isDisabled = this.disabled
        const isPackageProduct = this.product.type === PRODUCT_TYPE.PACKAGE
        return info.editRender(h, {
          sku,
          onChange: this.handleSingleChange,
          disabled: isDisabled,
          isPackageProduct,
          isDisplayNone,
          // 传递是否为单规格
          isSingleSku: this.isSingleSku,
          // 传递当前Tab值
          tabValue: this.tabValue
        })
      }
      const className = {
        'edit-icon': true,
        disabled: this.disabled,
        'display-none': isDisplayNone
      }
      return (
        // 传递是否为单规格
        <div>
          { info.displayRender(h, { skuList: this.skuList, isSingleSku: this.isSingleSku }) }
          <PermissionBtn
            component="Icon"
            needPermission
            btnType={this.felid === FELID.STOCK ? 'MODIFY_STOCK' : this.felid === FELID.PRICE ? 'MODIFY_PRICE' : ''}
            class={className}
            color="#F89800"
            local="edit"
            vOn:click={this.showModal}
            size="20"
          />
        </div>
      )
    }
  }
</script>
