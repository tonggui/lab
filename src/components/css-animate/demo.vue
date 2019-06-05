<template>
  <div>
    <Card style="margin: 20px;">
      <height-animate>
        <div>哈哈硕大的</div>
      </height-animate>
    </Card>
    <Card style="margin: 20px;">
      <collpase-animate>
        <div>哈哈硕大的</div>
      </collpase-animate>
    </Card>
    <Card style="margin: 20px;">
      <Button @click="hclick">add</Button>
      <group-animate>
        <div v-for="(it, index) in items" :key="index">
          <div style="height: 50px">{{ it }}</div>
        </div>
      </group-animate>
    </Card>
  </div>
</template>

<script>
import GroupAnimate from "./height-animate/group";
import HeightAnimate from "./height-animate";
import CollpaseAnimate from "./collpase";
export default {
  name: "css-animate-demo",
  data() {
    return {
      items: [1, 2],
      nextNum: 10
    };
  },
  methods: {
    hclick() {
      this.items.push(this.items.length + 1);
    }
  },
  components: {
    GroupAnimate,
    HeightAnimate,
    CollpaseAnimate
  }
};
</script>
