<template>
  <div>
    <Taglist
      :value="value"
      :width="300"
      @change="handleChange"
      :source="source"
      triggerMode="hover"
      placeholder="请选择分类"
      :maxCount="5"
    />
  </div>
</template>
<script>
import Taglist from './index'
export default {
  name: 'taglist-demo',
  components: {
    Taglist
  },
  data () {
    return {
      value: [],
      source: [{ 'id': 96851308, 'name': '徐秀兰', 'children': [], 'total': 0, 'leaf': true }, { 'id': 1000001, 'name': '锺强', 'children': [{ 'id': 1, 'name': '叶丽', 'children': [], 'total': 10, 'leaf': true }, { 'id': 2, 'name': '唐霞', 'children': [], 'total': 10, 'leaf': true }, { 'id': 3, 'name': '孙娜', 'children': [], 'total': 10, 'leaf': true }, { 'id': 4, 'name': '高勇', 'children': [], 'total': 10, 'leaf': true }, { 'id': 5, 'name': '梁艳', 'children': [], 'total': 10, 'leaf': true }], 'total': 5, 'leaf': false }, { 'id': 1000002, 'name': '夏超', 'children': [{ 'id': 6, 'name': '毛芳', 'children': [], 'total': 10, 'leaf': true }], 'total': 1, 'leaf': false }, { 'id': 1000003, 'name': '薛丽', 'children': [{ 'id': 7, 'name': '郑静', 'children': [], 'total': 10, 'leaf': true }, { 'id': 8, 'name': '蔡明', 'children': [], 'total': 10, 'leaf': true }, { 'id': 9, 'name': '任军', 'children': [], 'total': 10, 'leaf': true }], 'total': 3, 'leaf': false }, { 'id': 1000004, 'name': '贾强', 'children': [{ 'id': 10, 'name': '宋娜', 'children': [], 'total': 10, 'leaf': true }, { 'id': 11, 'name': '董芳', 'children': [], 'total': 10, 'leaf': true }], 'total': 2, 'leaf': false }]
    }
  },
  methods: {
    handleChange (val) {
      this.value = val
    }
  }
}
</script>
