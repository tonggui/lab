<template>
  <div>
    <slot :columns="columns" />
  </div>
</template>
<script lang="jsx">
  import {
    PRODUCT_MAX_STOCK,
    ProductUnit,
    WeightUnit
  } from '@/data/constants/product'
  import InputSelectGroup from '@components/input-select-group'
  import PackageInput from './components/cell/packageInput'
  import SpecName from './components/cell/specName'
  import InputBlurTrim from './components/cell/input-blur-trim'
  import SkuWeight from './components/cell/weight'
  import InputNumberDivEvent from '@/components/input-number-div-events'
  import { get, isFunction, isPlainObject } from 'lodash'
  import { weightOverflow } from './helper'
  import ValidateInput from '@/components/input/ValidateInput'
  import WithNoUpcSwitch from '@/hoc/withNoUpcSwitch'
  import TimeCounters from '@/common/lx/lxReport/lxTime'
  import { getPermissions } from '@/views/components/permission-bth/getPermissionMixin'

  const isDisabled = (row, disabledMap, key) => !!row.id && !!disabledMap[key]

  const getStatus = (fieldStatus, key) => {
    const status = get(fieldStatus, `${key}`) || {}
    return {
      required: !!status.required,
      visible: !!status.visible,
      disabled: !!status.disabled,
      hasNoUpcSwitchFunc: !!status.hasNoUpcSwitchFunc
    }
  }

  const mergeColumnItem = (columnList, extraConfig) => {
    if (!extraConfig) return columnList

    return columnList.map(columnItem => {
      const columnItemId = columnItem.id
      const extraConfigItem = extraConfig[columnItemId]
      if (!extraConfigItem) {
        return columnItem
      }

      if (isFunction(extraConfigItem)) {
        return extraConfigItem(columnItem)
      } else if (isPlainObject(extraConfigItem)) {
        return {
          ...columnItem,
          ...extraConfigItem
        }
      } else {
        console.warn('无效的columnItem配置项，请检查', extraConfigItem)
        return columnItem
      }
    })
  }

  export default {
    name: 'sell-info-columns',
    props: {
      hasAttr: Boolean,
      skuCount: Number,
      fieldStatus: Object,
      disabled: Boolean,
      needPermission: Boolean,
      disabledExistSkuColumnMap: {
        type: Object,
        default: () => ({})
      },
      extraColumnConfig: Object
    },
    mixins: [getPermissions('MODIFY_PRICE', 'MODIFY_STOCK', 'MODIFY_ON_AND_OFF_SHELVES')],
    computed: {
      specNameCol () {
        const base = {
          name: '售卖规格',
          fixed: 'left',
          id: 'specName'
        }
        const { required, disabled } = getStatus(this.fieldStatus, base.id)
        return {
          ...base,
          __hide__: this.hasAttr,
          rules: [{
            required: this.skuCount > 1 || required,
            message: '请输入规格',
            trigger: 'blur'
          }],
          width: 200,
          render: (h, { row }) => <SpecName disabled={this.disabled || disabled} data={row} />
        }
      },
      priceCol () {
        const base = {
          name: '价格',
          tip: '商品价格是与标题对应的，请仔细核对是否正确，避免造成损失',
          id: 'price'
        }
        const { visible, required, disabled } = getStatus(this.fieldStatus, base.id)
        const validate = (_rule, value, callback) => {
          let error
          if (!required) {
            callback(error)
            return
          }
          if (!value.value && value.value !== 0) {
            error = '请输入价格'
          } else if (!value.unit) {
            error = '请选择价格单位'
          }
          callback(error)
        }
        let isInputFocus = false
        let divFocus = false
        return {
          ...base,
          required,
          __hide__: !visible,
          rules: [{
            validator: validate,
            trigger: ['blur', 'change']
          }],
          render: (h, { row }) => (
            <InputSelectGroup
              needUnit={false}
              options={ProductUnit}
              selectKey="unit"
              inputKey="value"
              inputType="number"
              max={30000}
              min={0}
              disabled={{
                input: !this.permissions['MODIFY_PRICE'] || this.disabled || disabled || isDisabled(row, this.disabledExistSkuColumnMap, 'price'),
                select: !this.permissions['MODIFY_PRICE'] || this.disabled || disabled || isDisabled(row, this.disabledExistSkuColumnMap, 'priceUnit')
              }}
              separtor='/'
              placeholder="请输入"
              vOn:on-focus={() => {
                isInputFocus = true
                if (!divFocus) {
                  TimeCounters.setTime('price', +new Date(), 's2e')
                }
                divFocus = false
              }}
              vOn:on-div-focus={() => {
                divFocus = true
                TimeCounters.setTime('price', +new Date(), 's2e')
                isInputFocus = false
              }}
              vOn:on-blur={() => {
                TimeCounters.stopTime('price')
                isInputFocus = false
                divFocus = false
              }}
              vOn:on-div-blur={() => {
                if (!isInputFocus && divFocus) {
                  TimeCounters.stopTime('price')
                }
                isInputFocus = false
                divFocus = false
              }}
              vOn:on-change={() => {
                TimeCounters.setEndTime('price', +new Date())
              }}
            >
              <span slot="prefix" style="margin-right: 5px">¥</span>
            </InputSelectGroup>
          )
        }
      },
      suggestedPriceCol () {
        const base = {
          name: '建议零售价',
          id: 'suggestedPrice'
        }
        const { visible, required, disabled } = getStatus(this.fieldStatus, base.id)
        const rules = [{
          validator (_rule, value, callback) {
            let error
            if (!required) {
              callback(error)
              return
            }
            if (value !== 0 && !value) {
              error = '请输入建议零售价'
            }
            callback(error)
          },
          trigger: 'blur'
        }]
        return {
          // 药品标品审核专属
          ...base,
          required,
          __hide__: !visible,
          rules,
          render: (h, { row }) => (
            <ValidateInput
              disabled={this.disabled || disabled}
              placeholder="请输入"
              validateType="positive_float_2"
            >
              <span slot="prefix" style="line-height: 32px">¥</span>
            </ValidateInput>
          )
        }
      },

      stockCol () {
        const base = {
          name: '库存',
          id: 'stock'
        }
        const { visible, required, disabled } = getStatus(this.fieldStatus, base.id)
        let isInputFocus = false
        let divFocus = false
        return {
          ...base,
          required,
          __hide__: !visible,
          rules: [{
            validator (_rule, value, callback) {
              let error
              if (!required) {
                callback(error)
                return
              }
              if (value !== 0 && !value) {
                error = '请输入库存'
              }
              callback(error)
            },
            trigger: ['blur', 'change']
          }],
          render: (h, { row }) => {
            const freightStock = row.enableStockEditing !== false
            return <InputNumberDivEvent
              placeholder='请输入'
              precision={0}
              max={PRODUCT_MAX_STOCK}
              min={-1}
              disabled={ !this.permissions['MODIFY_STOCK'] || this.disabled || disabled || isDisabled(row, this.disabledExistSkuColumnMap, 'stock') || !freightStock}
              vOn:on-focus={() => {
                isInputFocus = true
                if (!divFocus) {
                  TimeCounters.setTime('stock', +new Date(), 's2e')
                }
                divFocus = false
              }}
              vOn:on-blur={() => {
                TimeCounters.stopTime('stock')
                isInputFocus = false
                divFocus = false
              }}
              vOn:on-div-focus={() => {
                divFocus = true
                TimeCounters.setTime('stock', +new Date(), 's2e')
                isInputFocus = false
              }}
              vOn:on-div-blur={() => {
                if (!isInputFocus && divFocus) {
                  TimeCounters.stopTime('stock')
                }
                isInputFocus = false
                divFocus = false
              }}
              vOn:on-change={() => TimeCounters.setEndTime('stock', +new Date())}
            />
          }
        }
      },

      weightCol () {
        const base = {
          name: '重量',
          id: 'weight'
        }
        const { visible, required, disabled } = getStatus(this.fieldStatus, base.id)
        return {
          ...base,
          required,
          __hide__: !visible,
          rules: [{
            validator: (_rule, value, callback) => {
              // 超重校验
              let error
              let weight = value.value
              if (!value.ignoreMax) {
                const overflow = weight && weightOverflow(value, get(this.fieldStatus, 'weight.max'))
                if (overflow) {
                  error = '重量过大，请核实后再保存商品'
                  callback(error)
                  return
                }
              }

              if (!required) {
                callback()
                return
              }
              // 必填校验
              if (typeof weight === 'number') {
                weight = weight.toString()
              }
              if (!weight) {
                error = '请输入重量'
              } else if (!value.unit) {
                error = '请选择重量单位'
              }
              callback(error)
            },
            trigger: 'blur'
          }],
          render: (h) => (
            <SkuWeight
              disabled={this.disabled || disabled}
              options={WeightUnit}
              selectKey="unit"
              inputKey="value"
              inputType="string"
              placeholder="请输入"
              vOn:on-focus={() => TimeCounters.setTime('weight', +new Date(), 's2e')}
              vOn:on-blur={() => TimeCounters.stopTime('weight')}
              vOn:on-change={() => TimeCounters.setEndTime('weight', +new Date()) }
            />
          )
        }
      },

      minOrderCountCol () {
        const { visible, required, disabled } = getStatus(this.fieldStatus, 'minOrderCount')
        let isInputFocus = false
        let divFocus = false
        return {
          name: '起购数',
          id: 'minOrderCount',
          required,
          __hide__: !visible,
          rules: [{
            validator (_rule, value, callback) {
              let error
              if (!required) {
                callback(error)
                return
              }
              if (value !== 0 && !value) {
                error = '请输入起购数'
              }
              callback(error)
            },
            trigger: ['blur', 'change']
          }],
          render: (h) => <InputNumberDivEvent
            disabled={this.disabled || disabled}
            style="width:100%"
            min={1}
            max={50}
            vOn:on-focus={() => {
              isInputFocus = true
              if (!divFocus) {
                TimeCounters.setTime('minCount', +new Date(), 's2e')
              }
              divFocus = false
            }}
            vOn:on-div-focus={() => {
              divFocus = true
              TimeCounters.setTime('minCount', +new Date(), 's2e')
              isInputFocus = false
            }}
            vOn:on-blur={() => {
              TimeCounters.stopTime('minCount')
              isInputFocus = false
              divFocus = false
            }}
            vOn:on-div-blur={() => {
              if (!isInputFocus && divFocus) {
                TimeCounters.stopTime('minCount')
              }
              isInputFocus = false
              divFocus = false
            }}
            vOn:on-change={() => TimeCounters.setEndTime('minCount', +new Date()) }
          />
        }
      },

      boxCol () {
        const { visible, required, disabled } = getStatus(this.fieldStatus, 'box')
        return {
          name: '包装费',
          id: 'box',
          tip: `包装费可根据用户一次下单此商品数量多少而阶梯变化，以节省用户包装费用，提高下单转化。\n如：每3件收取¥0.50。用户购买1~3个商品时，收取包装费0.5元。购买4~6个商品时，收取包装费1元，以此类推`,
          required,
          __hide__: !visible,
          rules: [{
            validator: (_rule, value, callback) => {
              let error
              if (!required) {
                callback(error)
                return
              }
              if (!value.price && value.price !== 0) {
                error = '请输入包装袋价格'
              } else if (!value.count) {
                error = '请输入包装袋数量'
              }
              callback(error)
            },
            trigger: 'blur'
          }],
          render: (h) => <PackageInput disabled={this.disabled || disabled} />
        }
      },

      sourceFoodCodeCol () {
        const { visible, required, disabled } = getStatus(this.fieldStatus, 'sourceFoodCode')
        return {
          name: '店内码/货号',
          required,
          __hide__: !visible,
          rules: [{
            required,
            message: '请输入店内码/货号',
            trigger: 'blur'
          }],
          id: 'sourceFoodCode',
          width: 160,
          render: (h) => <InputBlurTrim disabled={this.disabled || disabled} />
        }
      },

      upcCodeCol () {
        const { visible, required, disabled, hasNoUpcSwitchFunc } = getStatus(this.fieldStatus, 'upcCode')
        const WrapperComponent = WithNoUpcSwitch(InputBlurTrim, hasNoUpcSwitchFunc)
        return {
          required,
          name: '条形码',
          rules: (data) => [{
            required: get(data, 'commonProperty.allowUpcEmpty', false) ? false : required,
            message: '请输入UPC码',
            trigger: 'blur'
          }],
          __hide__: !visible,
          id: 'upcCode',
          width: 200,
          render: (h, { row, index }) => <WrapperComponent
            required={required}
            data={row}
            disabled={this.disabled || disabled}
            vOn:on-noUpc-change={(data) => this.$emit('on-noUpc-change', data, index)}
            vOn:on-blur={() => {
              TimeCounters.stopTime('upc')
              this.$emit('upc-blur', row, index)
            }}
            vOn:on-focus={() => {
              TimeCounters.setTime('upc', +new Date(), 's2e')
            }}
          />
        }
      },

      shelfNumCol () {
        const { visible, required, disabled } = getStatus(this.fieldStatus, 'shelfNum')
        return {
          name: '货架码/位置',
          rules: [{
            required,
            message: '请输入货架码/位置码',
            trigger: 'blur'
          }],
          __hide__: !visible,
          id: 'shelfNum',
          width: 160,
          render: (h) => <InputBlurTrim disabled={this.disabled || disabled} />
        }
      },

      columns () {
        const {
          disabled,
          hasAttr,
          skuCount
        } = this
        const columns = mergeColumnItem([
          {
            name: '是否售卖',
            id: 'editable',
            __hide__: !hasAttr,
            render: (h) => <Checkbox disabled={disabled}>售卖</Checkbox>
          },
          this.specNameCol,
          this.upcCodeCol,
          this.priceCol,
          this.suggestedPriceCol,
          this.stockCol,
          this.weightCol,
          this.sourceFoodCodeCol,
          this.minOrderCountCol,
          this.boxCol,
          this.shelfNumCol,
          {
            name: '操作',
            editable: false,
            id: 'op',
            fixed: 'right',
            __hide__: disabled || hasAttr || skuCount <= 1,
            render: (h, { index }) => <Button size="small" vOn:click={() => this.$emit('on-delete', index)}>删除</Button>
          }
        ], this.extraColumnConfig)
        return columns.filter(n => !n.__hide__)
      }
    }
  }
</script>
