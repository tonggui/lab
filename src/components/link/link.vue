<script>
import { parse } from "qs";
import { jumpTo } from "@sgfe/eproduct/navigator";
import { isPageName } from "@sgfe/eproduct/navigator/pages/page";

export default {
  name: "Link",
  props: {
    to: {
      type: [String, Object],
      required: true
    },
    tag: {
      type: String,
      default: "a"
    },
    replace: Boolean,
    delay: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleClickEvent(e) {
      // don't redirect with control keys
      if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return;
      // don't redirect when preventDefault called
      if (e.defaultPrevented) return;
      // don't redirect on right click
      if (e.button !== undefined && e.button !== 0) return;
      // don't redirect if `target="_blank"`
      if (e.currentTarget && e.currentTarget.getAttribute) {
        const target = e.currentTarget.getAttribute("target");
        if (/\b_blank\b/i.test(target)) return;
      }
      // this may be a Weex event which doesn't have this method
      if (e.preventDefault) {
        e.preventDefault();
      }
      this.jumpTo();
    },
    jumpTo() {
      const history = this.$router;
      const router = this.$router;
      const name = this.to && this.to.name;
      if (isPageName(name)) {
        const { search, query = {}, state = {} } = this.to;
        jumpTo(
          name,
          {
            history,
            ...state,
            params: {
              ...parse(search, { ignoreQueryPrefix: true }),
              ...query
            }
          },
          {
            name: true,
            spaType: "vue"
          }
        );
      } else {
        const { href } = router.resolve(this.to, this.$route, false);
        jumpTo(
          href,
          {
            history
          },
          {
            spaType: "vue"
          }
        );
      }
    }
  },
  render(h) {
    const data = {
      on: {
        click: this.handleClickEvent
      },
      attrs: {
        href: "javascript: void 0"
      }
    };

    return h(this.tag, data, this.$slots.default);
  }
};
</script>
