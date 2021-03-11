<template>
  <div>
    <Row>
      <Col span="4">
        选择关联门店
      </Col>
      <Col span="20">
        <RadioGroup v-model="phone">
          <Radio label="apple">
            <span>全部门店</span>
          </Radio>
          <Radio label="android">
            <span>指定门店</span>
          </Radio>
        </RadioGroup>
      </Col>
    </Row>
  </div>
</template>

<script>
  export default {
    name: 'step-poi'
  }
</script>

<style scoped>

</style>
