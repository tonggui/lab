<template>
  <div style="margin: 20px;">
    <Card title="Menu">
      <Menu
        class="test"
        :list="list1"
        :total="20"
        :multiple="true"
        :active="[1]"
        :exist="[[1]]"
        :loadingId="1"
        triggerMode="hover"
        :onLoadMore="onLoadMore"
        @trigger="onTrigger"
      ></Menu>
    </Card>
    <Card title="Cascader" style="margin-top: 20px;">
      <Cascader :value="[]" multiple :source="source" triggerMode="hover">
        <!-- renderItem 作为slot的使用方法 -->
        <template v-slot:renderItem="props">
          <div class="default">
            <span
              class="name"
              v-html="props.highlight(props.item.name, props.keyword)"
            />
            <Icon type="loading" v-if="props.item.loading" />
            <template v-else-if="props.item.isLeaf">
              <Icon
                v-if="props.item.included"
                type="check"
                :style="props.item.style"
              />
            </template>
            <Icon v-else type="chevron-right" :style="props.item.style" />
          </div>
        </template>
      </Cascader>
    </Card>
    <Card title="with-search" style="margin-top: 20px; padding-bottom: 200px;">
      <with-search
        :value="list1"
        name="this is name"
        :onSearch="onSearch"
        placeholder="this is placeholder"
      ></with-search>
    </Card>
  </div>
</template>

<script>
import Menu from './menu'
import Cascader from './index'
import WithSearch from './with-search'
export default {
  name: 'cascader-demo',
  data () {
    const list1 = new Array(1).fill(0).map((it, index) => ({
      id: index,
      name: '啊啊啊啊啊啊' + index
    }))
    return {
      list1,
      list2: list1.map(it => it.id),
      source: [{ 'id': 96851308, 'name': '徐秀兰', 'children': [], 'total': 0, 'isLeaf': true }, { 'id': 1000001, 'name': '锺强', 'children': [{ 'id': 1, 'name': '叶丽', 'children': [], 'total': 10, 'isLeaf': true }, { 'id': 2, 'name': '唐霞', 'children': [], 'total': 10, 'isLeaf': true }, { 'id': 3, 'name': '孙娜', 'children': [], 'total': 10, 'isLeaf': true }, { 'id': 4, 'name': '高勇', 'children': [], 'total': 10, 'isLeaf': true }, { 'id': 5, 'name': '梁艳', 'children': [], 'total': 10, 'isLeaf': true }], 'total': 5, 'isLeaf': false }, { 'id': 1000002, 'name': '夏超', 'children': [{ 'id': 6, 'name': '毛芳', 'children': [], 'total': 10, 'isLeaf': true }], 'total': 1, 'isLeaf': false }, { 'id': 1000003, 'name': '薛丽', 'children': [{ 'id': 7, 'name': '郑静', 'children': [], 'total': 10, 'isLeaf': true }, { 'id': 8, 'name': '蔡明', 'children': [], 'total': 10, 'isLeaf': true }, { 'id': 9, 'name': '任军', 'children': [], 'total': 10, 'isLeaf': true }], 'total': 3, 'isLeaf': false }, { 'id': 1000004, 'name': '贾强', 'children': [{ 'id': 10, 'name': '宋娜', 'children': [], 'total': 10, 'isLeaf': true }, { 'id': 11, 'name': '董芳', 'children': [], 'total': 10, 'isLeaf': true }], 'total': 2, 'isLeaf': false }]
    }
  },
  methods: {
    onTrigger (a, b) {
      console.log(a, b)
    },
    onLoadMore () {
      return Promise.resolve(
        new Array(10).fill(0).map((it, index) => ({
          id: Math.round(Math.random() * 10000),
          name: '啊啊啊啊啊啊' + index
        }))
      )
    },
    onSearch () {
      return Promise.resolve({
        data: new Array(3).fill(0).map((it, index) => ({
          id: Math.round(Math.random() * 10000),
          name: '啊啊啊啊啊啊' + index
        })),
        total: 3
      })
    }
  },
  components: {
    Menu,
    Cascader,
    WithSearch
  }
}
</script>
