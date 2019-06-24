<script>
import debounce from 'lodash/debounce'
import MutationObserver from 'mutation-observer'
import CustomerIcon from '@/components/customer-icon'
import CollpaseAnimate from '@/components/css-animate/collpase'
import CategorySetModal from './category-set-modal'
import { isMedicine } from '@/common/constants'
// 全部商品
const allProduct = {
  id: 0,
  name: '全部商品',
  productCount: 0,
  _isAll: true
}

export default {
  name: 'category-tree',
  props: {
    dataSource: {
      type: Array,
      required: true
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
    header: {
      type: String,
      default: null
    },
    showAllButton: {
      type: Boolean,
      default: true
    },
    showCateSetMenu: {
      type: Boolean,
      default: false
    },
    cateSetModalStatus: {
      type: Boolean,
      required: true
    },
    setModalStatus: {
      type: Function,
      required: true
    },
    saveProductTag: {
      type: Function,
      required: true
    },
    deleteTag: {
      type: Function,
      required: true
    },
    deleteTagAndProduct: {
      type: Function,
      required: true
    },
    changeTagLevel: {
      type: Function,
      required: true
    }
  },
  data () {
    return {
      allProduct: {
        ...allProduct,
        productCount: this.totalProduct,
        extra: this.allButtonExtra
      },
      valueSelf: null,
      openIdSelf: null,
      cateSetModalType: 'NEW',
      modalOptions: null,
      hoveredTagId: null,
      // 一下属性无需双向绑定
      observer: new MutationObserver(debounce(this.handleFixedScroll, 100))
    }
  },
  watch: {
    totalProduct: {
      immediate: true,
      handler (val) {
        this.allProduct = {
          ...this.allProduct,
          productCount: val,
          extra: this.allButtonExtra
        }
      }
    },
    value: {
      immediate: true,
      handler (val) {
        this.valueSelf = val
        this.openIdSelf = this.openId
      }
    }
  },
  mounted () {
    if (this.fixed) {
      this.triggerInitHeightState()
      window.addEventListener('scroll', this.handleFixedScroll)
      this.observer.observe(document.body, {
        childList: true,
        subtree: true
      })
    }
  },
  beforeDestroy () {
    if (this.fixed) {
      window.removeEventListener('scroll', this.handleFixedScroll)
      this.observer.disconnect()
    }
  },
  methods: {
    handleFixedScroll () {
      if (this.$refs.nodeRef && this.$refs.containerRef) {
        const { bottom } = this.$refs.containerRef.getBoundingClientRect()
        const { top } = this.$refs.nodeRef.getBoundingClientRect()
        // 保证显示的内容区域全部在可见区内
        const maxHeight =
          Math.min(window.innerHeight, bottom) - Math.max(0, top)
        this.$refs.nodeRef.style.maxHeight = `${maxHeight}px`
      }
    },

    triggerInitHeightState () {
      if (this.fixed) {
        this.handleFixedScroll()
      }
    },

    handleClickMenu (options, ev) {
      if (ev) {
        ev.domEvent.stopPropagation()
      }
      this.setState({
        modalOptions: options,
        cateSetModalType: options.type
      })
      this.setModalStatus(true)
    },

    async handleClickDeleteMenu (options, ev) {
      if (ev) {
        ev.domEvent.stopPropagation()
      }
      if (!options.category.productCount) {
        try {
          await this.deleteTag(options.category.id)
          this.$Message.success('删除成功')
        } catch (e) {
          this.$Message.error(e.message || e)
        }
      } else {
        this.handleClickMenu(options)
      }
    },

    handleModalClose () {
      this.cateSetModalType = 'NEWS'
      this.modalOptions = null
    },

    handleToFirst (tagId, parentId, ev) {
      if (ev) {
        ev.domEvent.stopPropagation()
      }
      this.$Modal.confirm({
        title: '确定设为一级分类吗？',
        icon: 'info',
        onOk: async () => {
          try {
            await this.changeTagLevel(tagId, parentId)
          } catch (err) {
            this.$Message.error(err.message || err.msg || '操作失败')
          }
        }
      })
    },

    handleOpen (id, level) {
      const openId = this.openIdSelf.slice(0, level)
      if (this.openIdSelf[level] !== id) {
        openId[level] = id
      }
      this.openIdSelf = [...openId]
    },

    handleSelect (id, level) {
      if (id === this.valueSelf) return
      const curOepnIds = this.openIdSelf.slice(0, level)
      this.openIdSelf = curOepnIds
      this.onChange([...curOepnIds, id])
    },

    handleMouseOverCategory (categoryId = null) {
      console.log('mouseleave')
      this.hoveredTagId = categoryId
    },

    transData (item, level) {
      const { id, subTags } = item
      const isLeaf = !subTags || subTags.length === 0
      return {
        ...item,
        isLeaf,
        isOpen: !isLeaf && id === this.openIdSelf[level],
        isActive: id === this.value
      }
    },

    transData1 (category, level, options = {}) {
      const { subTags } = category
      const { open = false, selected = false } = options
      const hasChildren = subTags && subTags.length
      const isSubCategory = level > 0
      return {
        category,
        level,
        options,
        hasChildren,
        isSubCategory,
        clsName: `category ${selected ? 'selected' : ''} ${
          open ? 'open' : ''
        } ${isSubCategory ? 'has-child' : ''}`
      }
    },

    renderTop (timeZoneForHuman) {
      const title = (
        <span dangerouslySetInnerHTML={{ __html: timeZoneForHuman }} />
      )
      return (
        <Tooltip placement="right" title={title}>
          <CustomerIcon class="top" type="top" />
        </Tooltip>
      )
    },

    renderNotTop () {
      const content = (
        <div>
          <div>限时置顶有助于提升订单</div>
          <div>
            点击查看<a href="/">提升订单秘籍</a>
          </div>
          <span onClick={this.setTimeTopTips}>知道了</span>
        </div>
      )
      return (
        <Tooltip placement="right" title={content}>
          <div class="category-tree-set-top">
            <Icon type="to-top" />
          </div>
        </Tooltip>
      )
    },

    renderCategoryExtra ({ extra, topFlag, timeZoneForHuman }) {
      let content = extra
      const hasTopSetting = topFlag === 1
      const clsName = {
        extra: true,
        'top-extra': hasTopSetting
      }

      if (topFlag === 1) content = this.renderTop(timeZoneForHuman)

      if (!content) return null
      return (
        <div class={clsName}>
          {topFlag === 1 ? this.renderTop(timeZoneForHuman) : extra}
        </div>
      )
    },

    renderSetMenus (level, category) {
      const { hoveredTagId } = this
      const subTags = category.subTags || []
      const specialTag = +category.defaultFlag === 1 // 药品的特殊分类不让修改或增加二级分类
      const disableToSecond = subTags.length !== 0
      const menu =
        level === 0 ? (
          <Menu>
            {!specialTag ? (
              <MenuItem
                onClick={e =>
                  this.handleClickMenu(
                    { level, category, type: 'EDIT_FIRST' },
                    e
                  )
                }
              >
                修改名称
              </MenuItem>
            ) : null}
            {!isMedicine && (
              <MenuItem
                onClick={e =>
                  this.handleClickMenu(
                    { level, category, type: 'SET_SELLTIME' },
                    e
                  )
                }
              >
                设置限时置顶
              </MenuItem>
            )}
            <MenuItem
              onClick={e =>
                this.handleClickMenu({ level, category, type: 'TO_SECOND' }, e)
              }
              disabled={disableToSecond}
            >
              {disableToSecond ? (
                <Tooltip placement="top" title="有子分类时，不能设为二级分类">
                  设为二级分类
                </Tooltip>
              ) : (
                '设为二级分类'
              )}
            </MenuItem>
            {!specialTag ? (
              <MenuItem
                onClick={e =>
                  this.handleClickMenu(
                    { level, category, type: 'NEW_SECOND' },
                    e
                  )
                }
              >
                新增二级分类
              </MenuItem>
            ) : null}
            <MenuItem
              onClick={e =>
                this.handleClickDeleteMenu(
                  { level, category, type: 'DEL_FIRST' },
                  e
                )
              }
            >
              删除
            </MenuItem>
          </Menu>
        ) : (
          <Menu>
            {!specialTag ? (
              <MenuItem
                onClick={e =>
                  this.handleClickMenu(
                    { level, category, type: 'EDIT_SECOND' },
                    e
                  )
                }
              >
                修改名称
              </MenuItem>
            ) : null}
            <MenuItem onClick={e => this.handleToFirst(category.id, 0, e)}>
              设为一级分类
            </MenuItem>
            <MenuItem
              onClick={e =>
                this.handleClickDeleteMenu(
                  { level, category, type: 'DEL_SECOND' },
                  e
                )
              }
            >
              删除
            </MenuItem>
          </Menu>
        )

      return (
        <div
          class={`set-cate ${category.id === hoveredTagId ? 'show-set' : ''}`}
        >
          <Dropdown
            overlay={menu}
            placement="bottomCenter"
            onVisibleChange={visible =>
              !visible && this.handleMouseOverCategory(null)
            }
          >
            <CustomerIcon class="set-icon" type="set" />
          </Dropdown>
        </div>
      )
    },

    renderLoop (data, level = 0) {
      return data.map(item => this.renderItem(item, level))
    },

    renderCategory (category, level, options = {}) {
      const { name, productCount, subTags } = category
      const { open = false, selected = false } = options
      const hasChildren = subTags && subTags.length
      const isSubCategory = level > 0
      const clsName = {
        category: true,
        selected: selected,
        open: open,
        'has-child': isSubCategory
      }
      return (
        <div
          class={clsName}
          onMouseEnter={() => this.handleMouseOverCategory(category.id)}
        >
          {hasChildren > 0 ? (
            <CustomerIcon
              class="arrow"
              type={open ? 'down-fill-arrow' : 'right-fill-arrow'}
            />
          ) : null}
          <div class="title">{name}</div>
          <div class="desc">
            <span>{`商品${productCount || 0}`}</span>
            {hasChildren > 0 ? <span>{`子分类${hasChildren}`}</span> : null}
          </div>
          {!isSubCategory ? this.renderCategoryExtra(category) : null}
          {this.showCateSetMenu ? this.renderSetMenus(level, category) : null}
        </div>
      )
    },

    renderItem (item, level) {
      const { id, subTags } = item
      const isLeaf = !subTags || subTags.length === 0
      const isOpen = !isLeaf && id === this.openIdSelf[level]
      const isActive = id === this.value
      const handleClick = e => {
        e.stopPropagation()
        if (!isLeaf) {
          this.handleOpen(id, level)
          return
        }
        this.handleSelect(id, level)
      }
      return (
        <div
          class={{ item: true, open: isOpen }}
          onClick={handleClick}
          data-level={level}
          key={id}
        >
          {this.renderCategory(item, level, {
            open: isOpen,
            selected: isActive
          })}
          {!isLeaf ? (
            <CollpaseAnimate vShow={isOpen}>
              <div class="sub-list">{this.renderLoop(subTags, level + 1)}</div>
            </CollpaseAnimate>
          ) : (
            ''
          )}
        </div>
      )
    },

    renderContent () {
      const { dataSource, showAllButton } = this
      if (dataSource.length === 0) {
        return null
      }
      return (
        <div
          class="content"
          onMouseleave={() =>
            setTimeout(() => {
              this.handleMouseOverCategory(null)
            }, 100)
          }
          ref="nodeRef"
        >
          {showAllButton ? this.renderItem(this.allProduct, 0) : null}
          {this.renderLoop(dataSource)}
        </div>
      )
    }
  },
  components: {
    CategorySetModal
  },
  render () {
    let content = this.renderContent()
    if (this.fixed) {
      content = <Affix>{content}</Affix>
    }
    // console.log(content);
    // console.log(this.$slots);
    return (
      <div class="tree" ref="container">
        {this.$slots.header}
        {content}
        <CategorySetModal
          visible={this.cateSetModalStatus}
          list={this.dataSource}
          setModalStatus={this.setModalStatus}
          type={this.cateSetModalType}
          options={this.modalOptions}
          close={this.handleModalClose}
          saveProductTag={this.saveProductTag}
          deleteTag={this.deleteTag}
          deleteTagAndProduct={this.deleteTagAndProduct}
          changeTagLevel={this.changeTagLevel}
        />
      </div>
    )
  }
}
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
