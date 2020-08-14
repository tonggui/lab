<template>
  <div>
    <slot :columns="columns" />
  </div>
</template>
<script>
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
  import { get } from 'lodash'
  import { weightOverflow } from './helper'
  import ValidateInput from '@/components/input/ValidateInput'

  const isDisabled = (row, disabledMap, key) => !!row.id && !!disabledMap[key]

  export default {
    name: 'sell-info-columns',
    props: {
      hasAttr: Boolean,
      skuCount: Number,
      fieldStatus: Object,
      disabled: Boolean,
      disabledExistSkuColumnMap: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      columns () {
        const {
          disabled,
          hasAttr,
          skuCount,
          fieldStatus,
          disabledExistSkuColumnMap
        } = this
        const columns = [
          {
            name: '是否售卖',
            id: 'editable',
            __hide__: !hasAttr,
            render: (h) => <Checkbox disabled={disabled}>售卖</Checkbox>
          },
          {
            name: '售卖规格',
            __hide__: hasAttr,
            fixed: 'left',
            rules: [{
              required: skuCount > 1 || !!get(fieldStatus, 'specName.required'),
              message: '请输入规格',
              trigger: 'blur'
            }],
            id: 'specName',
            render: (h, { row }) => <SpecName disabled={disabled} data={row} />
          },
          {
            name: '价格',
            tip: '商品价格是与标题对应的，请仔细核对是否正确，避免造成损失',
            required: !!get(fieldStatus, 'price.required'),
            __hide__: !get(fieldStatus, 'price.visible'),
            rules: get(fieldStatus, 'price.required') ? [
              {
                validator: (_rule, value, callback) => {
                  let error
                  if (!value.value && value.value !== 0) {
                    error = '请输入价格'
                  } else if (!value.unit) {
                    error = '请选择价格单位'
                  }
                  callback(error)
                },
                trigger: 'blur'
              }
            ] : [],
            id: 'price',
            render: (h, { row }) => (
              <InputSelectGroup
                options={ProductUnit}
                selectKey="unit"
                inputKey="value"
                inputType="number"
                max={30000}
                min={0}
                disabled={{
                  input: disabled || isDisabled(row, disabledExistSkuColumnMap, 'price'),
                  select: disabled || isDisabled(row, disabledExistSkuColumnMap, 'priceUnit')
                }}
                separtor='/'
                placeholder="请输入"
              >
                <span slot="prefix" style="margin-right: 5px">¥</span>
              </InputSelectGroup>
            )
          },
          { // 药品标品审核专属
            name: '建议零售价',
            id: 'suggestedPrice',
            required: !!get(fieldStatus, 'suggestedPrice.required'),
            __hide__: !get(fieldStatus, 'suggestedPrice.visible'),
            rules: get(fieldStatus, 'suggestedPrice.required') ? [
              {
                validator (_rule, value, callback) {
                  let error
                  if (value !== 0 && !value) {
                    error = '请输入建议零售价'
                  }
                  callback(error)
                },
                trigger: 'blur'
              }
            ] : [],
            render: (h, { row }) => (
              <ValidateInput
                disabled={disabled}
                placeholder="请输入"
                validateType="positive_float_2"
              >
                <span slot="prefix" style="line-height: 32px">¥</span>
              </ValidateInput>
            )
          },
          {
            name: '重量',
            required: !!get(fieldStatus, 'weight.required'),
            __hide__: !get(fieldStatus, 'weight.visible'),
            rules: [{
              validator: (_rule, value, callback) => {
                // 超重校验
                let error
                const overflow = value.weight && weightOverflow(value.weight, get(fieldStatus, 'weight.max'))
                if (overflow) {
                  error = '重量过大，请核实后再保存商品'
                  callback(error)
                  return
                }

                const required = get(fieldStatus, 'weight.required')
                if (!required) {
                  callback()
                  return
                }
                // 必填校验
                let weight = value.value
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
            id: 'weight',
            render: (h) => (
              <SkuWeight
                disabled={disabled}
                options={WeightUnit}
                selectKey="unit"
                inputKey="value"
                inputType="string"
                placeholder="请输入"
              />
            )
          },
          {
            name: '库存',
            required: !!get(fieldStatus, 'stock.required'),
            __hide__: !get(fieldStatus, 'stock.visible'),
            rules: get(fieldStatus, 'stock.required') ? [
              {
                validator (_rule, value, callback) {
                  let error
                  if (value !== 0 && !value) {
                    error = '请输入库存'
                  }
                  callback(error)
                },
                trigger: 'blur'
              }
            ] : [],
            id: 'stock',
            render: (h, { row }) => <InputNumber placeholder='请输入' precision={0} max={PRODUCT_MAX_STOCK} min={-1} disabled={ disabled || isDisabled(row, disabledExistSkuColumnMap, 'stock')} />
          },
          {
            name: '最小购买量',
            id: 'minOrderCount',
            required: !!get(fieldStatus, 'minOrderCount.required'),
            __hide__: !get(fieldStatus, 'minOrderCount.visible'),
            rules: get(fieldStatus, 'minOrderCount.required') ? [{
              validator (_rule, value, callback) {
                let error
                if (value !== 0 && !value) {
                  error = '请输入最小购买量'
                }
                callback(error)
              },
              trigger: 'blur'
            }] : [],
            render: (h) => <InputNumber disabled={disabled} style="width:100%" min={1} />
          },
          {
            name: '包装费',
            id: 'box',
            tip: `包装费可根据用户一次下单此商品数量多少而阶梯变化，以节省用户包装费用，提高下单转化。\n如：每3件收取¥0.50。用户购买1~3个商品时，收取包装费0.5元。购买4~6个商品时，收取包装费1元，以此类推`,
            required: !!get(fieldStatus, 'box.required'),
            __hide__: !get(fieldStatus, 'box.visible'),
            rules: get(fieldStatus, 'box.required') ? [
              {
                validator: (_rule, value, callback) => {
                  let error
                  if (!value.price && value.price !== 0) {
                    error = '请输入包装袋价格'
                  } else if (!value.count) {
                    error = '请输入包装袋数量'
                  }
                  callback(error)
                },
                trigger: 'blur'
              }
            ] : [],
            render: (h) => <PackageInput disabled={disabled} />
          },
          {
            name: 'SKU码/货号',
            __hide__: !get(fieldStatus, 'sourceFoodCode.visible'),
            rules: [{
              required: !!get(fieldStatus, 'sourceFoodCode.required'),
              message: '请输入SKU码/货号',
              trigger: 'blur'
            }],
            id: 'sourceFoodCode',
            width: 160,
            render: (h) => <InputBlurTrim disabled={disabled} />
          },
          {
            name: '条形码',
            rules: [{
              required: !!get(fieldStatus, 'upcCode.required'),
              message: '请输入UPC码',
              trigger: 'blur'
            }],
            __hide__: !get(fieldStatus, 'upcCode.visible'),
            id: 'upcCode',
            width: 200,
            render: (h, { row, index }) => <InputBlurTrim disabled={disabled} vOn:on-blur={() => this.$emit('upc-blur', row, index)} />
          },
          {
            name: '货架码/位置码',
            rules: [{
              required: !!get(fieldStatus, 'shelfNum.required'),
              message: '请输入货架码/位置码',
              trigger: 'blur'
            }],
            __hide__: !get(fieldStatus, 'shelfNum.visible'),
            id: 'shelfNum',
            width: 160,
            render: (h) => <InputBlurTrim disabled={disabled} />
          },
          {
            name: '操作',
            editable: false,
            id: 'op',
            fixed: 'right',
            __hide__: disabled || hasAttr || skuCount <= 1,
            render: (h, { index }) => <Button size="small" vOn:click={() => this.$emit('on-delete', index)}>删除</Button>
          }
        ]
        return columns.filter(n => !n.__hide__)
      }
    }
  }
</script>
