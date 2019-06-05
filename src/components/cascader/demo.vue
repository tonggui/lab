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
      <Cascader :value="list2" :exist="[1]" :loadingId="1" :source="source">
        <!-- renderItem 作为slot的使用方法 -->
        <template v-slot:renderItem="props">
          <div class="default">
            <span
              class="name"
              v-html="props.highlight(props.item.name, props.keyword)"
            />
            <Icon type="loading" v-if="props.item.loading" />
            <template v-else-if="props.item.leaf">
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
import Menu from "./menu";
import Cascader from "./index";
import WithSearch from "./with-search";
export default {
  name: "cascader-demo",
  data() {
    const list1 = new Array(10).fill(0).map((it, index) => ({
      id: index,
      name: "啊啊啊啊啊啊" + index
    }));
    return {
      list1,
      list2: list1.map(it => it.id),
      source: list1
    };
  },
  methods: {
    onTrigger(a, b) {
      console.log(a, b);
    },
    onLoadMore() {
      return Promise.resolve(
        new Array(10).fill(0).map((it, index) => ({
          id: Math.round(Math.random() * 10000),
          name: "啊啊啊啊啊啊" + index
        }))
      );
    },
    onSearch() {
      return Promise.resolve({
        data: new Array(3).fill(0).map((it, index) => ({
          id: Math.round(Math.random() * 10000),
          name: "啊啊啊啊啊啊" + index
        })),
        total: 3
      });
    }
  },
  components: {
    Menu,
    Cascader,
    WithSearch
  }
};
</script>
