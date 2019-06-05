<script>
export default {
  name: "group-animate",
  props: {
    duration: {
      type: Number,
      default: 0
    },
    appear: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      height: 0
    };
  },
  mounted() {
    console.log(this.$slots);
  },
  methods: {
    beforeEnter(el) {
      this.$emit("before-enter", el);
    },
    enterActive(el) {
      el.style.height = el.children[0].offsetHeight + "px";
      this.$emit("enter", el);
    },
    afterEnter(el) {
      this.$emit("after-enter", el);
    },
    beforeLeave(el) {
      this.$emit("before-leave", el);
    },
    leaveActive(el) {
      el.style.height = "0px";
      this.$emit("leave", el);
    }
  },
  render(h) {
    const childs = this.$slots.default.map((item, index) => {
      return h(
        "div",
        {
          class: "wrapper",
          key: index
        },
        [item]
      );
    });
    return h(
      "transition-group",
      {
        props: {
          tag: "div",
          name: "animate-height",
          appear: true
        },
        on: {
          "before-enter": this.beforeEnter,
          enter: this.enterActive,
          "after-enter": this.afterEnter,
          "before-leave": this.beforeLeave,
          leave: this.leaveActive
        }
      },
      childs
    );
  }
};
</script>
<style lang="less">
@import "./index.less";
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(30px);
}
.list1-item {
  display: inline-block;
  margin-right: 10px;
}
.list1-enter-active,
.list1-leave-active {
  transition: all 10s;
}
.list1-enter-to {
  height: initial;
}
.list1-enter, .list1-leave-to
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  height: 0;
}
</style>
