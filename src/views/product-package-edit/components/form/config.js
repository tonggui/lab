import validate from '@/views/components/product-form/validate'
import { isEmpty } from '@/common/utils'
import { VIDEO_STATUS } from '@/data/constants/video'
import { SELLING_TIME_TYPE } from '@/data/enums/product'
import moment from 'moment'

export default () => {
  return [
    {
      layout: 'FormCard',
      options: {
        style: {
          paddingBottom: '10px'
        },
        title: '组合商品列表',
        tip: ''
      },
      children: [
        {
          key: 'productList',
          type: 'PackageProductList',
          label: '组合商品',
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
          label: '组合价格',
          required: true,
          disabled: true,
          value: '',
          options: {
            placeholder: '与组合商品明细相关，自动生成'
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
                return Math.ceil(productList.reduce((total, product) => {
                  return total + product.price * product.discount / 10 * product.count
                }, 0) * 100) / 100
              }
            }
          }
        }, {
          key: 'stock',
          type: 'Input',
          label: '组合库存',
          required: true,
          disabled: true,
          value: '',
          options: {
            placeholder: '与组合商品明细相关，自动生成'
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
        tip: '添加组合销售的单个商品并填写售卖信息，组合商品价格为单个商品组合价之和，库存等于组包内单品最小库存'
      },
      children: [
        {
          key: 'name',
          type: 'ProductName',
          label: '组合商品标题',
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
          validate ({ key, value, required }) {
            return validate(key, value, { required })
          },
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
          label: '组合场景标题',
          required: true,
          value: '',
          events: {
            input (value) {
              this.setData('suitableScene', value)
            }
          },
          options: {
            clearable: true,
            maxlength: 8,
            placeholder: '适用病症，如“流行性感冒”'
          }
        },
        {
          key: 'category',
          type: 'CategoryPath',
          label: '商品类目',
          value: {},
          required: true,
          display (v) {
            return (v.namePath || []).join(' > ')
          },
          options: {
            suggesting: false,
            supportLocked: false,
            placeholder: '请输入类目关键词，例如苹果'
          },
          events: {
            'on-change' (category) {
              this.setData('category', category)
              if (category.id) { // 清空不用重置暂不使用标识
                this.setData('categoryId', category.id)
              }
            }
          },
          validate ({ key, value, required }) {
            return validate(key, value, { required })
          },
          rules: {
            result: {
              // 监听类目信息变化
              categoryId () {

              }
            }
          }
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
          label: '商品图片',
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
        },
        {
          key: 'video',
          type: 'ProductVideo',
          label: '商品视频',
          description: '温馨提示：商品视频有利于曝光及下单转化',
          required: false,
          value: null,
          validate ({ value }) {
            if (value && value.id && value.status !== VIDEO_STATUS.SUCCESS) {
              return '商品视频状态异常'
            }
          },
          events: {
            change (v) {
              this.setData('video', v)
            }
          },
          rules: {
            result: {
              mounted () {
                return !!this.getContext('modules').productVideo
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
          }
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
