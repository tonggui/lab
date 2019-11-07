<template>
  <div class="poi-search-table">
    <div ref="topSection" class="top-section">
      <div ref="searchContainer" class="search-container">
        <slot name="search" v-bind:search="search">
          <CitySelector v-model="query.city" placeholder="请输入城市名称搜索" clearable />
          <Input
            v-model="query.name"
            placeholder="输入门店名称"
          />
          <Button icon="search" size="default" type="primary" @click="search">搜索</Button>
        </slot>
      </div>
      <div ref="selectAllContainer" class="select-all-container">
        <Checkbox :disabled="disabledSelectionAll" class="check-all" :value="selectionOfAll" :indeterminate="indeterminate" @on-change="handleSelectionOfAllChange" />
        <Select v-model="typeOfSelectAll" style="width:150px" v-if="supportSelectAll">
          <Option v-for="item in typeOfSelectAllOptions" :key="item.label" :value="item.value">{{ item.label }}</Option>
        </Select>
        <span v-else>全选本页</span>
        <span class="selected-count">
          已选择门店数：{{ selectedCount }}
        </span>
      </div>
    </div>
    <PoiTable
      :height="tableHeight"
      :pagination="pagination"
      stripe
      :columns="cols"
      :data="dataWithSelectionInfo"
      @paginationChange="getList"
      @on-select="handleSelectEvent"
      @on-select-cancel="handleSelectCancelEvent"
      ref="poiTable">
      <Button
        v-if="confirm"
        slot="footer-extras"
        type="primary"
        :loading="adding"
        @click="add"
      >添加</Button>
    </PoiTable>
  </div>
</template>

<script>
  import CitySelector from '@components/city-selector'
  import PoiTable from '../poi-table'
  import storage, { KEYS } from '@/common/local-storage'

  const DEFAULT_POI_COLUMNS = [
    {
      title: '门店ID',
      align: 'left',
      key: 'id'
    }, {
      title: '门店名称',
      align: 'left',
      key: 'name'
    }, {
      title: '门店地址',
      align: 'left',
      key: 'address'
    }
  ]

  export default {
    name: 'SearchTable',
    components: {
      PoiTable,
      CitySelector
    },
    props: {
      confirm: Boolean,
      disabledMap: {
        type: Object,
        default: () => ({})
      },
      supportSelectAll: {
        type: Boolean,
        default: true
      },
      fetchPoiList: Function,
      fetchAllPoiList: Function,
      height: Number,
      // TODO 后续需要调整，需要支持三种模式 1. 不设定高度，2. 设定高度 3. 撑满并锁定表头
      autoresize: Boolean
    },
    mounted () {
      if (this.autoresize) {
        window.addEventListener('resize', this.handleResizeEvent)
        setTimeout(this.handleResizeEvent, 300)
        // this.handleResizeEvent()
      }
      this.search()
    },
    destroy () {
      if (this.autoresize) {
        window.removeEventListener('resize', this.handleResizeEvent)
      }
    },
    data () {
      return {
        data: [],
        query: {
          city: null,
          name: ''
        },
        adding: false,
        selectAll: false,
        typeOfSelectAll: this.supportSelectAll ? 1 : 0,
        typeOfSelectAllOptions: ['全选本页', '全选所有'].map((v, i) => ({ value: i, label: v })),
        pagination: {
          current: 1,
          total: 0,
          pageSize: storage[KEYS.POI_SELECT_PAGE_SIZE] || 20
        },
        tableHeight: this.height,
        include: [], // 已选的poi
        exclude: [], // 选全部情况下没选的poi
        // 添加此项解决目前on-select-all-cancel缺数据的场景
        tableList: []
      }
    },
    computed: {
      cols () {
        return [{ type: 'selection', width: 50, align: 'left' }].concat(DEFAULT_POI_COLUMNS)
      },
      includeIds () {
        return this.include.map(item => item.id)
      },
      excludeIds () {
        return this.exclude.map(item => item.id)
      },
      // 使用include的逻辑
      useInclude () {
        return this.typeOfSelectAll === 0 || !this.selectAll
      },
      disabledSelectionAll () {
        return this.typeOfSelectAll === 0 ? this.data.filter(item => !this.disabledMap[item.id]).length === 0 : this.availableTotal <= 0
      },
      selectionOfAll () {
        if (!this.data.length) return false
        return this.typeOfSelectAll === 0 ? this.data.every(v => this.disabledMap[v.id] || this.includeIds.includes(v.id)) : this.selectAll
      },
      indeterminate () {
        if (this.typeOfSelectAll === 0) {
          const valid = this.dataWithSelectionInfo.filter(item => !item._disabled)
          const checkedCount = valid.filter(item => item._checked).length
          return checkedCount > 0 && checkedCount < valid.length
        }
        return this.selectAll ? this.exclude.length > 0 : this.include.length > 0
      },
      // 带selection信息的数据
      dataWithSelectionInfo () {
        const { disabledMap, useInclude, includeIds, excludeIds } = this
        return this.data.map(item => {
          if (disabledMap[item.id]) {
            return { ...item, _checked: true, _disabled: true }
          }
          if (useInclude) {
            return { ...item, _checked: includeIds.includes(item.id) }
          }
          return { ...item, _checked: !excludeIds.includes(item.id) }
        })
      },
      // disabled的个数
      disabledCount () {
        return Object.keys(this.disabledMap).length
      },
      // 可选择的个数
      availableTotal () {
        return this.pagination.total - this.disabledCount
      },
      // 已选门店数
      selectedCount () {
        return this.useInclude ? this.include.length : this.availableTotal - this.exclude.length
      }
    },
    watch: {
      typeOfSelectAll () {
        this.clear()
      },
      pagination () {
        // pagesize 变化记录缓存
        storage[KEYS.POI_SELECT_PAGE_SIZE] = this.pagination.pageSize
      }
    },
    methods: {
      reset () {
        this.query.name = ''
        this.query.city = null
        this.typeOfSelectAll = this.supportSelectAll ? 1 : 0
        this.search()
      },
      search () {
        this.clear()
        this.getList()
      },
      async getList ({ current = 1, pageSize = this.pagination.pageSize } = {}) {
        try {
          const { list, pagination } = await this.fetchPoiList({
            ...(this.query || {}),
            pagination: {
              current,
              pageSize
            }
          })
          this.data = list
          this.pagination = { ...this.pagination, ...pagination }
        } catch (e) {
          this.$Message.error(e.message || e)
        }
      },
      handleSelectionOfAllChange (v) {
        this.selectAll = v
        if (this.typeOfSelectAll === 0) {
          if (v) {
            this.include = this.include.concat(this.dataWithSelectionInfo.filter(v => !v._disabled && !v._checked))
          } else {
            const _set = new Set(this.include)
            this.dataWithSelectionInfo.forEach(v => {
              if (!v._disabled && v._checked) {
                _set.delete(v.id)
              }
            })
            this.include = this.include.filter(item => !this.dataWithSelectionInfo.some(v => v.id === item.id))
          }
        } else {
          this.include = []
          this.exclude = []
        }
      },
      clear () {
        this.include = []
        this.exclude = []
        this.selectAll = false
      },
      add () {
        if (!this.selectedCount) {
          this.$Message.warning('请先选择门店')
          return
        }
        if (this.useInclude) {
          this.$emit('on-select', this.include)
          this.clear()
        } else {
          this.adding = true
          this.fetchAllPoiList(this.query.name, this.query.city, this.excludeIds).then(poiList => {
            this.$emit('on-select', poiList)
            this.clear()
            this.adding = false
          }).catch(err => {
            this.adding = false
            this.$Message.error(err.message)
          })
        }
      },
      handleResizeEvent () {
        const rect = this.$el.getBoundingClientRect()
        let $topSection = this.$refs.topSection
        const topSectionRect = $topSection.getBoundingClientRect()
        this.tableHeight = rect.height - topSectionRect.height
      },
      handleSelectEvent (selection, item) {
        const { useInclude, include, exclude, availableTotal } = this
        // 如果是本页全选，则选中时直接将本项加入到include中
        if (useInclude) {
          include.push(item)
          if (include.length === availableTotal) {
            this.selectAll = true
          }
        } else {
          const index = exclude.findIndex(v => v.id === item.id)
          if (index >= 0) {
            exclude.splice(index, 1)
            if (exclude.length === 0) {
              this.selectAll = true
            }
          }
        }
      },
      handleSelectCancelEvent (selection, item) {
        const { useInclude, include, exclude, availableTotal } = this
        // 如果是本页全选，则选中时直接include中删除
        if (useInclude) {
          const index = include.findIndex(v => v.id === item.id)
          if (index >= 0) {
            include.splice(index, 1)
            if (include.length === 0) {
              this.selectAll = false
            }
          }
        } else {
          exclude.push(item)
          if (exclude.length === availableTotal) {
            this.selectAll = false
          }
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .search-container {
    display: flex;
    align-items: center;
    padding: 8px 0 16px;
    margin: 0 -8px;

    > * {
      flex: 1;
      margin: 0 8px;
    }
    button {
      flex: none;
      height: 36px;
    }
  }
  .select-all-container {
    display: flex;
    align-items: center;
    padding-bottom: 16px;
    font-size: @font-size-base;
    .check-all {
      margin: 0 5px 0 0;
    }
    .selected-count {
      flex: 1;
      text-align: right;
      margin-left: 10px;
      font-size: @font-size-base;
    }
  }
</style>
