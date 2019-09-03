import Icon from '@components/icon/icon'
import EditInput from '@components/edit-input/edit-input'
import UnitNumber from '@components/unit-number'
import { PRODUCT_INFINITE_STOCK } from '@/data/constants/product'
export const FELID = {
  STOCK: 1,
  PRICE: 2
}

const editIcon = (h, { click }) => <Icon style={{ color: '#F89800' }} local="edit" vOn:click={click} size="20" />

export default {
  [FELID.STOCK]: {
    title: '修改库存',
    headerTitle: '库存',
    editIcon,
    displayRender: (h, product) => {
      const { stock } = product
      const className = stock === 0 ? 'error' : ''
      return <span className={className}>{ stock === PRODUCT_INFINITE_STOCK ? '无限' : `${stock}`}</span>
    },
    editRender: (h, { sku, onChange }) => {
      const value = sku.stock
      const scopedSlots = {
        display: ({ edit }) => (
          <div><span>{ value }</span>{ editIcon(h, { click: () => edit(true) }) }</div>
        ),
        editing: ({ onChange, value }) => (
          <InputNumber min={-1} value={value} vOn:on-change={onChange} />
        )
      }
      return h(EditInput, {
        scopedSlots,
        attrs: {
          value,
          onConfirm: onChange
        }
      })
    }
  },
  [FELID.PRICE]: {
    title: '修改价格',
    headerTitle: '价格',
    editIcon,
    displayRender: (h, product) => {
      return <span>{ product.priceStr }</span>
    },
    editRender: (h, { sku, onChange }) => {
      const value = sku.price.value
      const scopedSlots = {
        display: ({ edit }) => (
          <div>{ value }{ editIcon(h, { click: () => edit(true) }) }</div>
        ),
        editing: ({ onChange, value }) => (
          <UnitNumber unit="¥"><Input value={value} vOn:on-change={onChange} /></UnitNumber>
        )
      }
      return h(EditInput, {
        scopedSlots,
        attrs: {
          value,
          onConfirm: onChange
        }
      })
    }
  }
}
