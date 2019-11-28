/*
 * @description
 *   Please write the config script's description
 * @author
 *   rdshoep (zhangliang15@meituan.com)
 * @version
 *   1.0.0(2019-07-05)
 */
import { isEmpty } from '@/common/utils'
import validate from './validate'
import createCategoryAttrsConfigs from './components/category-attrs/config'

export default () => {
  return [
    {
      layout: 'FormCard',
      options: {
        style: {
          paddingBottom: '10px'
        },
        title: '基本信息'
      },
      children: [
        {
          key: 'category',
          type: 'CategoryPath',
          label: '后台类目',
          value: {},
          disabled: true,
          required: true,
          validate ({ key, value, required }) {
            const poiType = this.getContext('poiType')
            return validate(key, value, { required, poiType })
          }
        },
        {
          key: 'upcCode',
          type: 'Input',
          label: 'UPC码',
          value: '',
          disabled: true,
          required: true
        },
        {
          key: 'name',
          type: 'Input',
          label: '商品标题',
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
            const poiType = this.getContext('poiType')
            return validate(key, value, { required, poiType })
          },
          events: {
            'on-change' ($event) {
              this.setData('name', $event.target.value)
            }
          },
          options: {
            clearable: true,
            placeholder: '请输入商品标题'
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
            maxCount: 5,
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
              }
            }
          }
        },
        {
          key: 'pictureList',
          type: 'ProductPicture',
          label: '商品图片',
          required: true,
          validate ({ key, value, required }) {
            const poiType = this.getContext('poiType')
            return validate(key, value, { required, poiType })
          },
          value: [],
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
          key: 'normalAttributesValueMap',
          type: 'CategoryAttrs',
          layout: null,
          label: '',
          options: {
            allowApply: false
          },
          value: {},
          rules: {
            result: {
              // 监听类目属性变化
              attrs () {
                const attrs = this.getContext('normalAttributes')
                const allowApply = !!this.getContext('modules').allowApply
                const configs = createCategoryAttrsConfigs('normalAttributesValueMap', attrs, { allowApply })
                this.replaceConfigChildren('normalAttributesValueMap', {
                  type: 'div',
                  layout: null,
                  slotName: 'attrs',
                  options: {
                    class: attrs.length >= 4 ? 'row-mode' : 'column-mode'
                  },
                  children: configs
                })
              },
              'options.allowApply' () {
                return this.getContext('modules').allowApply
              }
            }
          }
        }
      ]
    }
  ]
}
