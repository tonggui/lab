import validate from '@/views/components/product-form/validate'
import { isEmpty } from '@/common/utils'
import moduleControl from '@/module'
import { SELLING_TIME_TYPE } from '@/data/enums/product'
import moment from 'moment'
import uniqBy from 'lodash/uniqBy'

export default () => {
  return [
    {
      layout: 'FormCard',
      options: {
        style: {
          paddingBottom: '10px'
        },
        title: '选择组包内包含的商品',
        tip: '组包商品创建后，不可再修改组包内包含的商品种类及数量，请谨慎设置'
      },
      children: [
        {
          key: 'productList',
          type: 'PackageProductList',
          label: '组包商品',
          required: true,
          value: [],
          events: {
            input (value) {
              this.setData('productList', [...(value || [])])
            }
          },
          options: {},
          rules: {
            result: {
              'options.editMode' () {
                return !this.getContext('isCreate')
              }
            }
          }
        },
        {
          key: 'price',
          type: 'Input',
          label: '组包价格',
          required: true,
          disabled: true,
          value: '',
          options: {
            placeholder: '与组包商品明细相关，自动生成'
          },
          children: [
            {
              type: 'span',
              slotName: 'append',
              children: ['元']
            }
          ],
          rules: {
            result: {
              value () {
                const productList = this.getData('productList')
                return Math.round(
                  productList.reduce((total, product) => {
                    return total + Math.round(product.price * product.discount / 10 * 100) / 100 * product.count
                  }, 0) * 100
                ) / 100
              }
            }
          }
        },
        {
          key: 'stock',
          type: 'InputNumber',
          label: '组包库存',
          required: true,
          disabled: true,
          value: 0,
          options: {
            placeholder: '与组包商品明细相关，自动生成',
            formatter (v) {
              return v === -1 ? '无限' : v
            }
          },
          rules: {
            result: {
              value () {
                const productList = this.getData('productList')
                let maxStock = 0
                if (productList.length) {
                  maxStock = Infinity
                  productList.forEach(product => {
                    const productStock = product.stock === -1 ? Infinity : product.stock
                    const stock = Math.floor(productStock / product.count)
                    maxStock = Math.min(maxStock, stock)
                  }, 0)
                  if (maxStock === Infinity) {
                    maxStock = -1
                  }
                }
                return maxStock
              }
            }
          }
        }
      ]
    },
    {
      layout: 'FormCard',
      options: {
        style: {
          paddingBottom: '10px'
        },
        title: '基本信息',
        tip: '添加组合销售的单个商品并填写售卖信息，组包商品价格为单个商品组合价之和，库存等于组包内单品最小库存'
      },
      children: [
        {
          key: 'name',
          type: 'ProductName',
          label: '组包商品名称',
          required: true,
          value: '',
          description: ({
            render () {
              return (
                <span>
                  使用规范的格式填写有利于商品曝光，提高商品的订单量及活动参与量 <a href="http://collegewm.meituan.com/sg/post/detail?id=144&contentType=0" target="_blank">查看标题规范 &gt;</a>
                </span>
              )
            }
          }),
          events: {
            input (value) {
              this.setData('name', value)
            }
          },
          options: {
            clearable: true,
            maxlength: 36,
            placeholder: '【x盒】[品牌名]商品名+【y瓶】[品牌名]商品名'
          }
        },
        {
          key: 'suitableScene',
          type: 'Input',
          label: '组包场景标题',
          required: true,
          value: '',
          binding: true,
          options: {
            clearable: true,
            maxlength: 8,
            placeholder: '适用病症，如“流行性感冒”，作为推荐理由呈现'
          }
        },
        {
          key: 'categoryId',
          type: 'CategorySelector',
          label: '组包商品类目',
          value: undefined,
          required: true,
          binding: true,
          options: {
            source: [],
            convert: categoryList => categoryList.map(category => ({
              value: category.id,
              label: (category.namePath || []).join(' > ')
            })),
            placeholder: '请选择后台类目',
            emptyTip: '请选择组包商品后再选择商品类目'
          },
          rules: [
            {
              result: {
                'options.source' () {
                  const productList = this.getData('productList') || []
                  const categoryList = uniqBy(productList.map(product => product.category), 'id')
                  // TODO 骚操作，需要考虑移除
                  setTimeout(() => {
                    const selectedCategoryId = this.getData('categoryId')
                    if (selectedCategoryId) {
                      if (!categoryList.some(category => category.id === selectedCategoryId)) {
                        this.setData('categoryId', undefined)
                      }
                    } else {
                      if (categoryList.length) {
                        this.setData('categoryId', categoryList[0].id)
                      }
                    }
                  }, 0)
                  return categoryList
                }
              }
            }, {
              result: {
                'watch-value-change' () {
                  // 监听类目信息变化
                  const categoryId = this.getData('categoryId')
                  moduleControl.setContext('product', { categoryId })
                }
              }
            }
          ]
        },
        {
          key: 'tagList',
          type: 'TagList',
          label: '店内分类',
          required: true,
          value: [],
          options: {
            source: [],
            maxCount: 1,
            separator: ' > ',
            placeholder: '请输入或点击选择'
          },
          validate ({ type, label, value = [], required }) {
            if (required && type === 'TagList' && isEmpty(value)) {
              throw new Error(`${label}不能为空`)
            }
            if (required && type === 'TagInput' && (isEmpty(value) || !value[0].name)) {
              throw new Error(`${label}不能为空`)
            }
          },
          events: {
            change (val = []) {
              this.setData('tagList', val)
            }
          },
          rules: {
            result: {
              'options.source' () {
                return this.getContext('tagList') || []
              },
              'options.maxCount' () {
                return this.getContext('modules').maxTagCount || 1
              }
            }
          }
        },
        {
          key: 'pictureList',
          type: 'ProductPicture',
          label: '组包商品图片',
          required: true,
          description: ({
            render () {
              return (
                <span>
                图片支持1:1（600px*600px）/ 4:3（600px*450px），最多上传5张图 <a href="http://collegewm.meituan.com/post/detail/1415" target="_blank">查看详细说明 &gt;</a>
                </span>
              )
            }
          }),
          validate ({ key, value, required }) {
            return validate(key, value, { required })
          },
          value: [],
          options: {
            preview: true,
            keywords: '',
            autoCropArea: 1,
            poorList: []
          },
          events: {
            change (v) {
              this.setData('pictureList', v)
            }
          },
          rules: {
            result: {
              'options.keywords' () {
                return this.getData('name')
              },
              'options.poorList' () {
                return this.getData('poorPictureList')
              }
            }
          }
        }
      ]
    },
    {
      layout: 'FormCard',
      options: {
        title: '其他信息',
        style: {
          paddingBottom: '20px'
        }
      },
      children: [
        {
          key: 'limitSale',
          type: 'PurchaseLimitation',
          label: ({
            render () {
              return (
                <span style="white-space: nowrap">
                  限制购买
                  <Tooltip
                    style="margin-left: 2px"
                    transfer
                    placement="right"
                    width="225px"
                    content="针对特殊商品，需要限制每个买家在周期内可购买的数量时，可以开启限购"
                  >
                    <Icon class="tip" local="question-circle"/>
                  </Tooltip>
                </span>
              )
            }
          }),
          value: {
            status: 0,
            rule: 1,
            range: [moment().format('YYYY-MM-DD'), moment().add(29, 'd').format('YYYY-MM-DD')],
            max: 0
          },
          events: {
            'change' (v) {
              this.setData('limitSale', v)
            }
          },
          validate ({ value }) {
            const { status = 0, range = [], rule, max = 0 } = value
            if (!status) return '' // 不限制的话不进行校验
            if (!range.length || range.some(v => !v)) return '限购周期不能为空'
            if (!rule) return '请选择限购规则'
            // 最大购买量不能小于sku中最小购买量的最大值
            const skuList = this.getData('skuList') || []
            let minCount = 1
            skuList.forEach(sku => {
              minCount = Math.max(minCount, sku.minOrderCount || 0)
            })
            if (max < minCount) return '限购数量必须>=最小购买量'
          },
          rules: {
            result: {
              mounted () {
                return !!this.getContext('modules').limitSale
              },
              'options.supportMultiPoi' () {
                return !!this.getContext('modules').supportLimitSaleMultiPoi
              }
            }
          }
        },
        {
          key: 'shippingTime',
          type: 'SaleTime',
          label: '可售时间',
          value: {
            type: SELLING_TIME_TYPE.Infinite
          },
          events: {
            'on-change' (val) {
              this.setData('shippingTime', val)
            }
          },
          rules: {
            result: {
              visible () {
                return this.getContext('modules').sellTime !== false
              }
            }
          }
        },
        {
          key: 'labelList',
          type: 'ProductLabel',
          label: '商品标签',
          value: [],
          events: {
            'on-change' (val) {
              this.setData('labelList', val)
            }
          },
          rules: [
            {
              result: {
                visible () {
                  return this.getContext('modules').labelList !== false
                }
              }
            }
          ]
        },
        {
          key: 'description',
          type: 'Input',
          label: '商品描述',
          value: '',
          options: {
            type: 'textarea',
            placeholder: '请填写商品的核心卖点，200字以内'
          },
          events: {
            'on-change' ($event) {
              this.setData('description', $event.target.value)
            }
          },
          rules: [
            {
              result: {
                visible () {
                  return this.getContext('modules').description !== false
                }
              }
            }
          ]
        },
        {
          key: 'pictureContentList',
          type: 'PicDetails',
          label: '图片详情',
          value: [],
          visible: false,
          description: '建议图片宽度≥640像素，高度≤960像素；单张图片≤2M，最多上传20张图片；',
          events: {
            change (v) {
              this.setData('pictureContentList', v)
            }
          },
          validate ({ value = [] }) {
            if (value.length > 20) {
              return '图片详情最多只能上传20张图片'
            }
          },
          rules: [
            {
              result: {
                visible () {
                  return this.getContext('modules').picContent === true
                }
              }
            }
          ]
        }
      ]
    }
  ]
}
