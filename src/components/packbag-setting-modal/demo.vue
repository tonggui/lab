<template>
  <div>
    <PackbagSettingModal :items="items" :value="1" :visible="true" />
  </div>
</template>

<script>
import PackbagSettingModal from "./index";
export default {
  name: "pack-bag-setting-demo",
  data() {
    return {
      src: "",
      items: [
        {
          label: "哈哈哈",
          value: 1
        },
        {
          label: "刚刚刚",
          value: 2
        }
      ]
    };
  },
  components: {
    PackbagSettingModal
  },
  methods: {}
};
</script>

<style scoped></style>
