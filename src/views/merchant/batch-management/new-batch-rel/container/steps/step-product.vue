<template>
  <div>
    <Row>
      <Col span="4">
        所要关联之门店的商品
      </Col>
      <Col span="20">
        <RadioGroup v-model="phone">
          <Radio label="apple">
            <span>全部商品</span>
          </Radio>
          <Radio label="android">
            <span>指定商品</span>
          </Radio>
        </RadioGroup>
      </Col>
    </Row>
    <Row>
      <Col span="4">
        商品选择方式
      </Col>
      <Col span="20">
        <RadioGroup v-model="phone">
          <Radio label="apple">
            <span>按分类选择</span>
          </Radio>
          <Radio label="android">
            <span>批量导入选择</span>
          </Radio>
        </RadioGroup>
        <TagWithDataSelected class="tag-width-data-selected" />
      </Col>
    </Row>
    <Row>
      <Col span="4">
        关联后商品信息更新范围
      </Col>
      <Col span="20">
        <RadioGroup v-model="phone">
          <Radio label="apple">
            <span>全部信息</span>
          </Radio>
          <Radio label="android">
            <span>除价格、库存的信息</span>
          </Radio>
          <Radio label="android">
            <span>仅关联门店商品，不更新商品信息</span>
          </Radio>
        </RadioGroup>
      </Col>
    </Row>
  </div>
</template>

<script>
  import TagWithDataSelected from '../tag-with-data-selected'

  export default {
    name: 'step-product',
    components: {
      TagWithDataSelected
    }
  }
</script>

<style scoped>
  .tag-width-data-selected {
    width: 800px;
    height: 371px;
  }
</style>
