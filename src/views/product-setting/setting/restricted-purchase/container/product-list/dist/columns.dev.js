'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports['default'] = void 0

var _productTableInfo = _interopRequireDefault(require('@components/product-table-info'))

var _productPrice = _interopRequireDefault(require('@components/product-price'))

var _productStock = _interopRequireDefault(require('@components/product-stock'))

function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { 'default': obj } }

var _default = [{
  title: '商品信息',
  render: function render (h, _ref) {
    var row = _ref.row
    return h(_productTableInfo['default'], {
      props: {
        product: row
      }
    })
  }
}, {
  title: '价格',
  width: 250,
  key: 'price',
  align: 'right',
  render: function render (h, _ref2) {
    var row = _ref2.row
    return h(_productPrice['default'], {
      props: {
        price: row.skuList.map(function (sku) {
          return sku.price.value
        })
      }
    })
  }
}, {
  title: '限购',
  width: 200,
  key: 'stock',
  align: 'right',
  render: function render (h, _ref3) {
    var row = _ref3.row
    return h(_productStock['default'], {
      props: {
        stock: row.limitRuleId ? '\u5DF2\u9650\u8D2D' : ''
      }
    })
  }
}]
exports['default'] = _default
