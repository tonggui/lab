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

  const isDisabled = (row, disabledMap, key) => !!row.id && !!disabledMap[key]

  export default {
    name: 'sell-info-columns',
    props: {
      hasAttr: Boolean,
      skuCount: Number,
      supportPackingBag: {
        type: Boolean,
        default: true
      },
      hasMinOrderCount: {
        type: Boolean,
        default: false
      },
      disabledExistSkuColumnMap: {
        type: Object,
        default: () => ({})
      },
      requiredMap: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      columns () {
        const {
          hasAttr,
          skuCount,
          supportPackingBag,
          hasMinOrderCount,
          disabledExistSkuColumnMap,
          requiredMap
        } = this
        const columns = [
          {
            name: '是否售卖',
            id: 'editable',
            __hide__: !hasAttr,
            render: (h) => <Checkbox>售卖</Checkbox>
          },
          {
            name: '规格',
            __hide__: hasAttr,
            rules: [{
              required: skuCount > 1 || !!requiredMap.spec,
              message: '请输入规格',
              trigger: 'blur'
            }],
            id: 'specName',
            render: (h, { row }) => <SpecName data={row} />
          },
          {
            name: '价格',
            tip: '商品价格是与标题对应的，请仔细核对是否正确，避免造成损失',
            required: !!requiredMap.price,
            rules: requiredMap.price ? [
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
                  input: isDisabled(row, disabledExistSkuColumnMap, 'price'),
                  select: isDisabled(row, disabledExistSkuColumnMap, 'priceUnit')
                }}
                separtor='/'
                placeholder="请输入"
              >
                <span slot="prefix" style="margin-right: 5px">¥</span>
              </InputSelectGroup>
            )
          },
          {
            name: '重量',
            required: !!requiredMap.weight,
            rules: requiredMap.weight ? [
              {
                validator: (_rule, value, callback) => {
                  let error
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
              }
            ] : [],
            id: 'weight',
            render: (h) => (
              <InputSelectGroup
                options={WeightUnit}
                selectKey="unit"
                inputKey="value"
                inputType="string"
                placeholder="请输入"
              >
                <span slot="prefix" style="margin-right: 5px">约</span>
              </InputSelectGroup>
            )
          },
          {
            name: '库存',
            required: !!requiredMap.stock,
            rules: requiredMap.stock ? [
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
            render: (h, { row }) => <InputNumber placeholder='请输入' precision={0} max={PRODUCT_MAX_STOCK} min={-1} disabled={isDisabled(row, disabledExistSkuColumnMap, 'stock')} />
          },
          {
            name: '最小购买量',
            id: 'minOrderCount',
            required: !!requiredMap.minOrderCount,
            rules: requiredMap.minOrderCount ? [{
              validator (_rule, value, callback) {
                let error
                if (value !== 0 && !value) {
                  error = '请输入最小购买量'
                }
                callback(error)
              },
              trigger: 'blur'
            }] : [],
            __hide__: !hasMinOrderCount,
            render: (h) => <InputNumber style="width:100%" min={1} />
          },
          {
            name: '包装费',
            id: 'box',
            tip: `包装费可根据用户一次下单此商品数量多少而阶梯变化，以节省用户包装费用，提高下单转化。\n如：每3件收取¥0.50。用户购买1~3个商品时，收取包装费0.5元。购买4~6个商品时，收取包装费1元，以此类推`,
            required: !!requiredMap.box,
            rules: requiredMap.box ? [
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
            __hide__: !supportPackingBag,
            render: (h) => <PackageInput />
          },
          {
            name: 'SKU码/货号',
            rules: [{
              required: !!requiredMap.sourceFoodCode,
              message: '请输入SKU码/货号',
              trigger: 'blur'
            }],
            id: 'sourceFoodCode',
            width: 160,
            render: (h) => <InputBlurTrim />
          },
          {
            name: 'UPC码',
            rules: [{
              required: !!requiredMap.upc,
              message: '请输入UPC码',
              trigger: 'blur'
            }],
            id: 'upcCode',
            width: 200,
            render: (h, { row, index }) => <InputBlurTrim vOn:on-blur={() => this.$emit('upc-blur', row, index)} />
          },
          {
            name: '货架码/位置码',
            rules: [{
              required: !!requiredMap.shelfNum,
              message: '请输入货架码/位置码',
              trigger: 'blur'
            }],
            id: 'shelfNum',
            width: 160,
            render: (h) => <InputBlurTrim />
          },
          {
            name: '操作',
            editable: false,
            id: 'op',
            __hide__: hasAttr || skuCount <= 1,
            render: (h, { index }) => <Button size="small" vOn:click={() => this.$emit('on-delete', index)}>删除</Button>
          }
        ]
        return columns.filter(n => !n.__hide__)
      }
    }
  }
</script>
