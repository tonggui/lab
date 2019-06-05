<script>
import Draggable from "vuedraggable";
import { getSmartTagTopCount } from "@/common/product/tagList";
import debounce from "lodash/debounce";
import MutationObserver from "mutation-observer";
const allProduct = {
  id: 0,
  name: "全部商品",
  productCount: 0,
  _isAll: true
};
/**
 * slot {header, allButtonExtra}
 */
export default {
  name: "sort-category-tree",
  props: {
    dataSource: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    value: {
      type: Number,
      required: true
    },
    onChange: {
      type: Function,
      required: true
    },
    totalProduct: {
      type: Number,
      required: true
    },
    openId: {
      type: Array,
      default: () => []
    },
    fixed: {
      type: Boolean,
      default: false
    },
    showAllButton: {
      type: Boolean,
      default: false
    },
    updateSequence: {
      type: Function,
      required: true
    },
    sort: {
      type: Object,
      validator: val => {
        return (
          typeof val.tagId === "number" &&
          typeof val.smart === "boolean" &&
          typeof val.topMaxCount === "number"
        );
      },
      default: () => ({
        tagId: 0,
        smart: false,
        topMaxCount: 5
      })
    },
    onTagToTopChanged: {
      type: Function,
      required: true
    }
  },
  data() {
    const smartTagTopCount = this.sort.smart
      ? getSmartTagTopCount(this.dataSource)
      : 0;
    this.observer = new MutationObserver(debounce(this.handleFixedScroll, 100));
    return {
      valueSelf: this.value,
      openIdSelf: this.openId,
      allProduct: {
        ...allProduct,
        productCount: this.totalProduct,
        extra: this.allButtonExtra
      },
      smart: this.sort.smart,
      smartTagTopCount,
      topMaxCount: this.sort.topMaxCount,
      storagedRemoveFromTopTipStatus:
        Boolean(localStorage.getItem("checkedRemoveFromTopTip")) || false,
      storagedAddTopTipStatus:
        Boolean(localStorage.getItem("checkedAddTopTip")) || false
    };
  },
  mounted() {
    if (this.fixed) {
      window.addEventListener("scroll", this.handleFixedScroll);
      this.observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  },
  destroyed() {
    if (this.fixed) {
      window.removeEventListener("scroll", this.handleFixedScroll);
      this.observer.disconnect();
    }
  },
  update() {
    const sort = this.sort;
    if (sort.smart !== this.smart || sort.topMaxCount !== this.topMaxCount) {
      this.smart = sort.smart;
      this.topMaxCount = sort.topMaxCount;
    }
  },
  watch: {
    value(val) {
      this.valueSelf = val;
      this.openIdSelf = this.openId;
    },
    totalProduct(val) {
      if (val !== this.allProduct.productCount) {
        this.allProduct = {
          ...this.allProduct,
          productCount: val,
          extra: this.allButtonExtra
        };
      }
    }
  },
  methods: {
    setRemoveFromTopTipStatus(ev) {
      localStorage.setItem("checkedRemoveFromTopTip", true);
      this.storagedRemoveFromTopTipStatus = true;
      ev.stopPropagation();
    },

    setAddTopTipStatus(ev) {
      localStorage.setItem("checkedAddTopTip", true);
      this.storagedAddTopTipStatus = true;
      ev.stopPropagation();
    },

    handleFixedScroll() {
      if (this.$refs.node && this.$refs.container) {
        const { bottom } = this.$refs.container.getBoundingClientRect();
        const { top } = this.$refs.node.getBoundingClientRect();
        // 保证显示的内容区域全部在可见区内
        const maxHeight =
          Math.min(window.innerHeight, bottom) - Math.max(0, top);
        this.$refs.node.style.maxHeight = `${maxHeight}px`;
      }
    },

    triggerInitHeightState() {
      if (this.fixed) {
        this.handleFixedScroll();
      }
    },

    async setItemSequence(tagIds) {
      try {
        await this.updateSequence(tagIds);
        this.$Message.success("排序保存成功");
      } catch (e) {
        this.$Message.error("排序保存失败，请重试！");
      }
    },

    onSortEnd({ oldIndex, newIndex }) {
      if (oldIndex === newIndex) return;
      const tagIds = this.dataSource.map(t => t.id);
      const curTag = tagIds.splice(oldIndex, 1);
      tagIds.splice(newIndex, 0, curTag[0]);
      this.setItemSequence(tagIds.join());
    },

    onSortEndSecond(oldIndex, newIndex, parentId) {
      if (oldIndex === newIndex) return;
      const parentTag = this.dataSource.find(t => t.id === parentId);
      const tagIds = parentTag.subTags.map(p => p.id);
      const curTag = tagIds.splice(oldIndex, 1);
      tagIds.splice(newIndex, 0, curTag[0]);
      this.setItemSequence(tagIds.join());
    },

    async handleTagToTopChanged(ev, type, tagId, seq) {
      ev.stopPropagation();
      if (type === 1 && seq >= this.topMaxCount) {
        // 当Mcc配置上限变小时（如从默认的5变为3），存量置顶不变，即可以取消置顶，但是不能新增置顶
        this.$Message.warning(`当前置顶排序最大支持${this.topMaxCount}`);
        return;
      }
      if (this.onTagToTopChanged) {
        try {
          await this.onTagToTopChanged(type, tagId, seq);
        } catch (e) {
          const msg = type === 1 ? "分类置顶失败" : "分类取消置顶失败";
          this.$Message.error(msg);
          throw e;
        }
      }
    },

    handleOpen(id, level) {
      const openId = this.openIdSelf.slice(0, level);
      if (this.openIdSelf[level] !== id) {
        openId[level] = id;
      }
      this.openIdSelf = [...openId];
    },

    handleSelect(id, level) {
      if (id === this.valueSelf) return;
      const curOepnIds = this.openIdSelf.slice(0, level);
      this.openIdSelf = curOepnIds;
      this.onChange([...curOepnIds, id]);
    },

    renderRemoveFromTopTip() {
      return (
        <>
          <p>点击则可以取消置顶显示，用户端将根据买家喜好智能排序</p>
          <div class="tip-box">
            <span
              class="check-tip"
              onClick={e => this.setRemoveFromTopTipStatus(e)}
            >
              我知道了
            </span>
          </div>
        </>
      );
    },

    renderAddTopTip() {
      return (
        <>
          <p>可添加置顶分类，添加后，该分类在用户端将置顶显示</p>
          <div class="tip-box">
            <span class="check-tip" onClick={e => this.setAddTopTipStatus(e)}>
              我知道了
            </span>
          </div>
        </>
      );
    },

    renderTagOpr(item, index, level, isTop = false) {
      const {
        smart,
        smartTagTopCount,
        // storagedRemoveFromTopTipStatus,
        storagedAddTopTipStatus
      } = this;
      if (!smart) {
        // 拖拽
        return <CustomerIcon type="drag" class="icon-border drag" />;
      }
      if (smart && level === 1) return null;
      return isTop ? (
        <>
          <span
            onClick={e =>
              this.handleTagToTopChanged(e, 2, item.id, smartTagTopCount - 1)
            }
          >
            <Tooltip
              // visible={!storagedRemoveFromTopTipStatus && !index}
              placement="right-top"
              content={this.renderRemoveFromTopTip()}
            >
              <CustomerIcon type="minus" class="icon-border remove" />
            </Tooltip>
          </span>
          {index !== 0 && (
            <span
              class="ml10"
              onClick={e => this.handleTagToTopChanged(e, 1, item.id, 0)}
            >
              <CustomerIcon type="set-top" class="icon-border" />
            </span>
          )}
        </>
      ) : (
        <span
          onClick={e =>
            this.handleTagToTopChanged(e, 1, item.id, smartTagTopCount)
          }
        >
          <Tooltip
            visible={
              !storagedAddTopTipStatus && smart && index === smartTagTopCount
            }
            placement="rightTop"
            title={this.renderAddTopTip()}
          >
            <CustomerIcon type="plus" class="icon-border" />
          </Tooltip>
        </span>
      );
    },

    renderCategory(category, index, level, options = {}) {
      const { name, productCount, subTags } = category;
      const { open = false, selected = false, isTop = false } = options;
      const hasChildren = subTags && subTags.length;
      const isSubCategory = level > 0;
      const clsName = {
        category: true,
        selected: selected,
        open: open,
        "has-child": isSubCategory
      };
      return (
        <div class={clsName}>
          {hasChildren > 0 ? (
            <CustomerIcon
              class="arrow"
              type={open ? "down-fill-arrow" : "right-fill-arrow"}
            />
          ) : null}
          <div class="title">{name}</div>
          <div class="desc">
            <span>{`商品${productCount}`}</span>
            {hasChildren > 0 ? <span>{`子分类${hasChildren}`}</span> : null}
          </div>
          <div class="extra sort-extra">
            {this.renderTagOpr(category, index, level, isTop)}
          </div>
        </div>
      );
    },

    renderItem(item, index, level, isTop = false) {
      const { id, subTags } = item;
      const isLeaf = !subTags || subTags.length === 0;
      const isOpen = !isLeaf && id === this.openIdSelf[level];
      const isActive = id === this.props.value;

      const className = {
        item: true,
        open: isOpen
      };

      const handleClick = e => {
        e.stopPropagation();
        if (!isLeaf) {
          this.handleOpen(id, level);
          return;
        }
        this.handleSelect(id, level);
      };
      return (
        <div
          class={className}
          onClick={handleClick}
          data-level={level}
          key={id}
        >
          {this.renderCategory(item, index, level, {
            open: isOpen,
            selected: isActive,
            isTop
          })}
          {!isLeaf ? (
            <CollpaseAnimate show={isOpen}>
              <Draggable
                list={this.dataSource}
                class="sub-list"
                onEnd={this.onSortEndSecond}
              >
                {this.renderLoop(subTags, level + 1)}
              </Draggable>
            </CollpaseAnimate>
          ) : (
            ""
          )}
        </div>
      );
    },

    renderLoop(data, level = 0) {
      return data.map((item, index) => this.renderItem(item, index, level));
    },

    renderContent(dataSource) {
      const { showAllButton } = this.props;
      if (dataSource.length === 0) {
        return null;
      }
      const content = (
        <>
          {showAllButton && this.renderItem(this.allProduct, -1, 0)}
          {this.renderLoop(dataSource, 0)}
        </>
      );
      return (
        <div
          class="content"
          ref={node => {
            this.$node = node;
            this.triggerInitHeightState();
          }}
        >
          <Draggable
            tag="div"
            list={this.dataSource}
            class="list-group"
            ghost-class="ghost"
            // onStart="dragging = true"
            onEnd={this.onSortEnd}
          >
            {content}
          </Draggable>
        </div>
      );
    },

    renderSortContent() {
      const { fixed, dataSource } = this.props;
      return fixed ? (
        <Affix>{this.renderContent(dataSource)}</Affix>
      ) : (
        this.renderContent(dataSource)
      );
    },

    renderSmartSortLoop(data, level = 0, isTop = false) {
      return data.map((item, index) =>
        this.renderItem(item, index, level, isTop)
      );
    },

    renderFixedSmartSortContent() {
      const smartSortContent = this.renderSmartSortContent();
      return this.fixed ? (
        <Affix>{smartSortContent}</Affix>
      ) : (
        <>{smartSortContent}</>
      );
    },

    renderSmartSortContent() {
      const { dataSource } = this.props;
      const arrSmart = [...dataSource];
      const arrTop = arrSmart.splice(0, this.smartTagTopCount);

      return (
        <div class="content" ref="node">
          <div class="caption">置顶分类</div>
          {this.renderSmartSortLoop(arrTop, 0, true)}
          {arrTop.length === 0 && <div class="no-top">未添加置顶分类</div>}
          <div class="caption">
            智能排序&nbsp;&nbsp;
            <span class="caption-tip">点击“+”可添加置顶分类</span>
          </div>
          {this.renderSmartSortLoop(arrSmart, 0)}
        </div>
      );
    }
  },
  components: {
    Draggable
  },
  render() {
    const { header, loading } = this.props;
    return (
      <div class="tree" ref="container">
        <Spin spinning={loading}>
          {header}
          {this.smart
            ? this.renderFixedSmartSortContent()
            : this.renderSortContent()}
        </Spin>
      </div>
    );
  }
};
</script>

<style scoped></style>
