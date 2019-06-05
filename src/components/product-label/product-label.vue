<script>
import omit from "lodash/omit";
import { CheckButtonGroup } from "../check-button";
export default {
  name: "product-label",
  props: {
    labels: {
      type: Array,
      default: () => [{ label: "力荐", value: 1 }],
      validator: val => {
        return val.every(
          it =>
            it.label &&
            typeof it.label === "string" &&
            it.value &&
            typeof it.value === "number"
        );
      }
    }
  },
  components: {
    CheckButtonGroup
  },
  render(h) {
    const props = omit(this.$options.propsData, "labels");
    return h("check-button-group", {
      class: "container",
      attrs: {
        options: this.labels,
        ...this.$attrs
      },
      props
    });
  }
};
</script>
