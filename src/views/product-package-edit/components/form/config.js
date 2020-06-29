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
        title: '基本信息',
        tip: ({
          render () {
            return (
              <span>
                填写基本的商品信息，有利于增强商品流量，促进购买转换！ <a href="https://shangou.meituan.com/college#/detail?resourceId=335&type=0&hideHeader=1" target="_blank">查看商品审核教程 &gt;</a>
              </span>
            )
          }
        })
      },
      children: [
        {
          key: 'name',
          type: 'ProductName',
          label: '组包商品标题',
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
          label: '组包适用场景标题',
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
            placeholder: '请输入类目关键词，例如苹果',
            suggest: {}
          },
          events: {
            'on-change' (category) {

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
