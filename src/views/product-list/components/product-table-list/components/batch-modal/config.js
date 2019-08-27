import {
  PRODUCT_BATCH_OP
} from '@/data/enums/product'
import Stock from './stock'
import TagList from '@components/taglist'
import SaleTime from '@/views/components/product-form/components/sale-time'
import ProductLabel from '@components/product-label'

const config = {
  [PRODUCT_BATCH_OP.MOD_TAG]: {
    type: 'form',
    initValue: {
      type: undefined,
      tagIdList: []
    },
    title: '批量修改商品分类',
    children: [{
      key: 'type',
      label: '修改方式',
      render: (h) => {
        return (
          <RadioGroup>
            <Radio label={1}>新增</Radio>
            <Radio label={2}>替换</Radio>
            <Radio label={3}>删除</Radio>
          </RadioGroup>
        )
      }
    }, {
      key: 'tagIdList',
      label: '目标分类',
      render: (h, { context }) => {
        return (
          <TagList
            width={300}
            triggerMode="hover"
            placeholder="请选择分类"
            source={context.tagList}
          />
        )
      }
    }]
  },
  [PRODUCT_BATCH_OP.MOD_STOCK]: {
    type: 'form',
    initValue: {
      stock: -1
    },
    title: '批量修改库存',
    children: [{
      key: 'stock',
      label: '',
      render: (h) => <Stock />
    }]
  },
  [PRODUCT_BATCH_OP.MOD_TIME]: {
    type: 'form',
    initValue: {
      saleTime: undefined
    },
    title: '批量修改可售时间',
    children: [{
      key: 'saleTime',
      label: '可售时间',
      render: (h) => <SaleTime />
    }]
  },
  [PRODUCT_BATCH_OP.MOD_LABEL]: {
    type: 'form',
    initValue: {
      labelIdList: [],
      type: 0
    },
    title: '批量修改商品标签',
    children: [{
      key: 'type',
      label: '选择模式',
      render: (h) => (
        <RadioGroup>
          <Radio label={0}>设置标签</Radio>
          <Radio label={1}>清除标签</Radio>
        </RadioGroup>
      )
    }, {
      key: 'labelIdList',
      label: '选择标签',
      render: (h) => <ProductLabel />
    }]
  },
  [PRODUCT_BATCH_OP.DELETE]: {
    type: 'confirm',
    title: '批量删除',
    children: [{
      render: (h, { context }) => `删除商品后，已提交订单及加入购物车的商品将无法付款，本次将要删除 ${context.count} 个商品，请慎重操作`
    }]
  },
  [PRODUCT_BATCH_OP.PUT_ON]: {
    type: 'confirm',
    title: '批量上架',
    children: [{
      render: (h, { context }) => `共选择了 ${context.count} 件商品`
    }]
  },
  [PRODUCT_BATCH_OP.PUT_OFF]: {
    type: 'confirm',
    title: '批量下架',
    children: [{
      render: (h, { context }) => `共选择了 ${context.count} 件商品，商品下架后可能导致已加入购物车的商品无法付款`
    }]
  }
}
const description = {
  render: (h, { context }) => <div>共选择 { context.count } 件商品</div>
}
const result = Object.entries(config).reduce((prev, [key, item]) => {
  const { type, children, ...newItem } = item
  let newChildren = children
  if (type === 'form') {
    newChildren = [description, ...children]
  }
  newItem.children = newChildren
  prev[key] = newItem
  return prev
}, {})
export default result
