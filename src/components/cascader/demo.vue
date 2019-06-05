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
      source: [
        {
          sequence: 0,
          description: "",
          timeZone: "",
          fullName: "生鲜果蔬",
          name: "生鲜果蔬",
          id: 102983522,
          level: 1,
          code: "",
          topFlag: 0,
          extend: '{"status":1,"sortType":2,"topCount":3}',
          parentName: null,
          valid: 1,
          wmPoiId: 2756215,
          poiId: 0,
          parentId: 0,
          subTags: [],
          productCount: 311,
          appTagCode: "",
          ctime: 1557391073,
          utime: 1559638440,
          isLeaf: 1,
          tagType: 0,
          timeZoneObj: null,
          timeZoneForHuman: null,
          defaultFlag: 0,
          actPolicyId: 0,
          nodePath: "",
          buzType: 0
        },
        {
          sequence: 0,
          description: "",
          timeZone: "",
          fullName: "MTCY1",
          name: "MTCY1",
          id: 104389441,
          level: 1,
          code: "",
          topFlag: 0,
          extend: '{"status":1}',
          parentName: null,
          valid: 1,
          wmPoiId: 2756215,
          poiId: 159497804,
          parentId: 0,
          subTags: [
            {
              sequence: 1,
              description: "",
              timeZone: "{}",
              fullName: "MTCY1 >> 111111",
              name: "111111",
              id: 105270812,
              level: 2,
              code: "",
              topFlag: 0,
              extend: "",
              parentName: "MTCY1",
              valid: 1,
              wmPoiId: 2756215,
              poiId: 0,
              parentId: 104389441,
              subTags: null,
              productCount: 12,
              appTagCode: "",
              ctime: 1559039855,
              utime: 1559617595,
              isLeaf: 1,
              tagType: 0,
              timeZoneObj: {},
              timeZoneForHuman: "",
              defaultFlag: 0,
              actPolicyId: 0,
              nodePath: "",
              buzType: 0
            }
          ],
          productCount: 12,
          appTagCode: "",
          ctime: 1558345294,
          utime: 1559638440,
          isLeaf: 0,
          tagType: 0,
          timeZoneObj: null,
          timeZoneForHuman: null,
          defaultFlag: 0,
          actPolicyId: 0,
          nodePath: "",
          buzType: 0
        }
      ]
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
