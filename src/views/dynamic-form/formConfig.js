/**
 * 字段说明（configItem）
 * key 唯一标识，每个config item都必须有，如果与表单数据formData的key值相同，则value会被同步
 * type 组件名
 * label 表单字段名
 * value 表单值
 * mounted 是否挂载
 * visible 是否显示
 * options 组件props
 * events 组件向外emit的事件
 * directives 组件指令
 * rules 依赖规则
 * children[configItem] 容器组件特有，其中的每个configItem会按序渲染到容器组件中
 * TODO：scopeSlot，根据容器组件的插槽放置子组件
 * TODO：validator 校验
 */
/* 新增调整
* 1. 新增Layout节点，支持自定义FormItem容器布局
*    支持无layout布局，Layout和FormItem必有其一；自定义Layout只支持一个default插槽！
*    children只配合Layout使用，支持[{option}]和{key: renderFunction/option} --child/slot
* 2. 取消Key必填限制，没有的场景自动创建;
* 3. Validator;
* 4. NestForm支持，动态formConfig支持（暴力刷新）;
* */

// import ItemLayout from './item-layout'

export const getFormConfig = () => {
  const formConfig = [
    {
      layout: 'Card',
      visible: true,
      children: [
        {
          key: 'isMed',
          // layout: ItemLayout,
          type: 'iSwitch',
          label: '是否药品',
          value: false,
          validate () {
            console.log(this.formData, ...arguments)
            throw new Error('校验失败')
          },
          events: {
            'on-change' (v) {
              this.context.isMedicine = v
            }
          },
          rules: [
            {
              result: {
                value () {
                  return this.context.isMedicine
                }
              }
            }
          ]
        },
        {
          key: 'upc',
          type: 'Input',
          label: '商品条码',
          value: '',
          visible: true,
          options: {
            placeholder: '请输入商品条码'
          },
          events: {
            'on-change' (v) {
              this.formData.upc = v.target.value
            }
          },
          rules: [
            {
              result: {
                visible () {
                  return this.context.isMedicine
                }
              }
            }
          ]
        },
        {
          key: 'name',
          type: 'Input',
          label: '商品名称',
          value: '',
          options: {
            placeholder: '请输入商品名称'
          },
          events: {
            'on-change' (v) {
              this.formData.name = v.target.value
            }
          }
        },
        {
          key: 'edit-name',
          type: 'EditInput',
          label: '商品名称',
          value: '',
          visible: false,
          options: {
            displayMaxWidth: 400,
            onConfirm (v) {
              return new Promise(resolve => {
                setTimeout(() => {
                  this.formData.name = v
                  resolve()
                }, 1000)
              })
            }
          },
          rules: [
            {
              result: {
                value () {
                  return this.formData.name
                },
                visible () {
                  return !!this.formData.name
                }
              }
            }
          ]
        },
        {
          key: 'labels',
          type: 'ProductLabels',
          label: '商品标签',
          value: [],
          events: {
            'on-change' (v) {
              this.formData.labels = v
            }
          }
        }
      ],
      rules: [
        {
          result: {
            visible () {
              return !this.context.isMedicine
            }
          }
        }
      ]
    }
  ]
  return formConfig
}

/*
title: [
          {
            key: 'isMed',
            // layout: ItemLayout,
            type: 'iSwitch',
            label: '是否药品',
            value: false,
            events: {
              'on-change' (v) {
                this.context.isMedicine = v
              }
            },
            rules: [
              {
                result: {
                  value () {
                    return this.context.isMedicine
                  }
                }
              }
            ]
          },
          {
            key: 'upc',
            type: 'Input',
            label: '商品条码',
            value: '',
            visible: true,
            options: {
              placeholder: '请输入商品条码'
            },
            events: {
              'on-change' (v) {
                this.formData.upc = v.target.value
              }
            },
            rules: [
              {
                result: {
                  visible () {
                    return this.context.isMedicine
                  }
                }
              }
            ]
          },
          {
            key: 'name',
            type: 'Input',
            label: '商品名称',
            value: '',
            options: {
              placeholder: '请输入商品名称'
            },
            events: {
              'on-change' (v) {
                this.formData.name = v.target.value
              }
            }
          },
          {
            key: 'edit-name',
            type: 'EditInput',
            label: '商品名称',
            value: '',
            visible: false,
            options: {
              displayMaxWidth: 400,
              onConfirm (v) {
                return new Promise(resolve => {
                  setTimeout(() => {
                    this.formData.name = v
                    resolve()
                  }, 1000)
                })
              }
            },
            rules: [
              {
                result: {
                  value () {
                    return this.formData.name
                  },
                  visible () {
                    return !!this.formData.name
                  }
                }
              }
            ]
          },
          {
            key: 'labels',
            type: 'ProductLabels',
            label: '商品标签',
            value: [],
            events: {
              'on-change' (v) {
                this.formData.labels = v
              }
            }
          }
        ]
*/
