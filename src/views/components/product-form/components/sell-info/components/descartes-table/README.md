## 场景如下：
- 不支持笛卡尔：顺序渲染sku
- 支持笛卡尔
  - 没有销售属性：展现和不支持笛卡尔相同
  - 有销售属性
    - 没选择任何销售属性：展示默认的一个sku item
    - 选择销售属性：根据销售属性做笛卡尔乘机（矩阵） 生成sku
  
## 功能如下
- index: 是否支持笛卡尔的判断
- descartes-table: 做笛卡尔乘机
- table：纯渲染table
- row：基于form做的带实时校验的 table-row
  
## TODO
- dimvalue变化时，考虑做部分diff，不是全部重算
- 固定表头，右侧，左侧等功能（考虑基础table的功能扩展）

## props
```
// 笛卡尔算子，二维数组，false代表不支持笛卡尔
dimvalue: false | Array
// 已有的sku list
value: Array
// 列信息
columns: Array
// 存储 笛卡尔 信息的字段key
keyName: String
// 生成row的key
rowKey: Function
// 创建一个空的sku，主要是有些默认值
generateItem: Function
// 算子item中关于父属性的key
parentKey: String
```