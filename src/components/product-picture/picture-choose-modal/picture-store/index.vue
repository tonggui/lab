<template>
  <div class="container">
    <Input
      :value="keywords"
      search
      enter-button
      placeholder="请输入搜索关键词"
      @on-search="handleSearch"
    />
    <div v-if="keywords" class="desc">
      <span v-if="error" style="color: red">{{ error }}</span>
      <template v-else>
        找到关键词为 <span>{{ keywords }}</span> 的图片
        <span>{{ total }}</span> 个
      </template>
    </div>
    <template v-if="total > 0">
      <div class="table">
        <div v-for="(item, idx) in list" :key="idx" class="pic">
          <img :src="item" />
          <div class="select" @click="handleSelect(item)">确定使用</div>
        </div>
      </div>
      <Page
        style="margin: 20px 0;"
        :current="current"
        :total="total"
        :page-size="pageSize"
        @on-change="handlePageChange"
      />
    </template>
  </div>
</template>

<script>
  import { fetchGetPictureListByName } from '@/data/repos/common'
  export default {
    name: 'ProductStore',
    props: {
      keywords: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        current: 1,
        total: 0,
        pageSize: 12,
        error: null
      }
    },
    watch: {
      keywords: {
        immediate: true,
        handler (val) {
          this.keywordsSelf = val
        }
      }
    },
    mounted () {
      const keywords = this.keywordsSelf
      if (keywords) {
        this.triggerSearch(
          {
            current: 1,
            keywords,
            pageSize: this.pageSize
          },
          true
        )
      }
    },
    methods: {
      handleSearch (keywords) {
        if (!keywords) {
          this.$Message.warning('请输入关键字进行查询')
          return
        }
        this.triggerSearch({
          current: 1,
          keywords,
          pageSize: this.pageSize
        })
      },
      handleSelect (src) {
        this.$emit('confirm', src)
      },
      handlePageChange (pageNumber) {
        this.triggerSearch({
          keywords: this.keywordsSelf,
          current: pageNumber,
          pageSize: this.pageSize
        })
      },
      async triggerSearch (conditions, isAuto = false) {
        const { keywords, current, pageSize } = conditions
        try {
          const result = await fetchGetPictureListByName(keywords, { current, pageSize })
          const { list, pagination } = result
          const { pageNum, total } = pagination
          this.keywordsSelf = keywords
          this.list = list
          this.current = pageNum
          this.pageSize = pageSize
          this.total = total
          this.error = null
          this.$emit('search-end', result, isAuto)
        } catch (e) {
          this.error = (e && e.message) || e || '搜索失败，请重试！'
        }
      }
    }
  }
</script>

<style scoped lang="less">
.container {
  :global {
    .boo-input-with-search {
      width: 100%;
    }

    .boo-page {
      text-align: right;
      margin-top: 20px;
    }
  }

  .desc {
    font-size: 12px;
    letter-spacing: 0;
    margin-top: 10px;
    margin-bottom: 20px;
    > span {
      color: #f89800;
    }
  }
}

.table {
  width: 780px;
  margin: -5px;
  margin-top: 15px;

  .pic {
    margin: 5px;
    width: 120px;
    height: 90px;
    display: inline-block;
    vertical-align: top;
    border: 1px solid #e2e2e2;
    position: relative;

    > img {
      display: block;
      width: 100%;
      max-height: 100%;
      overflow: hidden;
      align-self: center;
    }

    > .select {
      display: none;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: #f89800;
      color: #fff;
      font-size: 12px;
      line-height: 24px;
      cursor: pointer;
      text-align: center;
    }

    &:hover {
      border: 1px solid #f89800;

      > .select {
        display: block;
      }
    }
  }
}
</style>
