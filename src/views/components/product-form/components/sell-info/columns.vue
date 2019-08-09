<template>
  <div>
    <slot :columns="columns" />
  </div>
</template>
<script>
  import {
    ProductUnit,
    WeightUnit
  } from '@/data/constants/product'
  import InputSelectGroup from '@components/input-select-group'
  import PackageInput from './components/cell/packageInput'
  import SpecName from './components/cell/specName'

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
      hasStock: {
        type: Boolean,
        default: false
      },
      requiredWeight: Boolean
    },
    computed: {
      columns () {
        const { hasAttr, skuCount, supportPackingBag, hasMinOrderCount, hasStock, requiredWeight } = this
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
              required: skuCount > 1,
              message: '请输入规格',
              trigger: 'blur'
            }],
            id: 'specName',
            render: (h, { row }) => <SpecName data={row} />
          },
          {
            name: '价格',
            tip: '商品价格是与标题对应的，请仔细核对是否正确，避免造成损失',
            required: true,
            rules: [
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
            ],
            id: 'price',
            render: () => (
              <InputSelectGroup
                options={ProductUnit}
                selectKey="unit"
                inputKey="value"
                inputType="number"
                max={3000}
                min={0}
                separtor='/'
                placeholder="请输入"
              />
            )
          },
          {
            name: '库存',
            required: true,
            rules: [
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
            ],
            id: 'stock',
            __hide__: !hasStock,
            render: (h, { row }) => <InputNumber placeholder='请输入' precision={0} max={999} min={-1} />
          },
          {
            name: '重量',
            required: requiredWeight,
            rules: [
              {
                validator: (_rule, value, callback) => {
                  let error
                  if (requiredWeight) {
                    let weight = value.value
                    if (typeof weight === 'number') {
                      weight = weight.toString()
                    }
                    if (!weight) {
                      error = '请输入重量'
                    } else if (!value.unit) {
                      error = '请选择重量单位'
                    }
                  }
                  callback(error)
                },
                trigger: 'blur'
              }
            ],
            id: 'weight',
            render: (h) => (
              <InputSelectGroup
                options={WeightUnit}
                selectKey="unit"
                inputKey="value"
                inputType="string"
                placeholder="请输入"
              />
            )
          },
          {
            name: '最小购买量',
            id: 'minOrderCount',
            required: true,
            rules: [{
              validator (_rule, value, callback) {
                let error
                if (value !== 0 && !value) {
                  error = '请输入最小购买量'
                }
                callback(error)
              },
              trigger: 'blur'
            }],
            __hide__: !hasMinOrderCount,
            render: (h) => <InputNumber style="width:100%" min={1} />
          },
          {
            name: '包装袋',
            id: 'box',
            __hide__: !supportPackingBag,
            render: (h) => <PackageInput />
          },
          {
            name: 'SKU码/货号',
            id: 'sourceFoodCode',
            render: (h) => <Input />
          },
          {
            name: 'UPC码',
            id: 'upcCode',
            render: (h) => <Input />
          },
          {
            name: '货架码/位置码',
            id: 'shelfNum',
            render: (h) => <Input />
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
