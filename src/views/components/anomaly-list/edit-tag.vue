<template>
  <Edit
    v-bind="$attrs"
    :size="size"
    :value="value"
    :border="false"
    class="edit-tag"
    @on-cancel="handleCancel"
  >
    <template v-slot:editing="{ change, confirm }">
      <div class="input-wrapper">
        <TagList class="input" :size="size" :value="value" @change="handleTagChange" :source="data" />
      </div>
    </template>
    <template slot="displayContent">
      <template v-if="value.length > 0">
        <span v-for="(v, index) in value" :key="index">{{ v.name }}</span>
      </template>
      <span v-else>--</span>
    </template>
  </Edit>
</template>
<script>
  import Edit from '@/components/edit'
  import TagList from '@/components/taglist'
  import { getPathById } from '@/components/taglist/util'

  export default {
    name: 'edit-tag',
    components: {
      Edit,
      TagList
    },
    props: {
      size: {
        type: String,
        validator (size) {
          return ['default', 'small', 'large'].includes(size)
        },
        default: 'default'
      },
      data: {
        type: Array,
        default: () => []
      },
      tagId: {
        type: Array,
        default: () => []
      }
    },
    data () {
      const value = this.getValue()
      return {
        value: value,
        prevValue: value
      }
    },
    computed: {
      valueDisplay () {
        return this.value.map(v => v.name).join(',')
      }
    },
    watch: {
      tagId () {
        const value = this.getValue()
        this.value = value
        this.prevValue = value
      },
      data () {
        const value = this.getValue()
        this.value = value
        this.prevValue = value
      }
    },
    methods: {
      getValue () {
        const value = []
        this.tagId.forEach(id => {
          const newPath = getPathById(id, this.data)
          if (newPath <= 0) {
            return
          }
          const namePath = []
          newPath.forEach(({ id, name }) => {
            namePath.push(name)
          })
          value.push({ id, name: namePath.join('/') })
        })
        return value
      },
      handleTagChange (value) {
        this.value = value
      },
      handleCancel () {
        this.value = this.prevValue
      }
    }
  }
</script>
<style lang='less' scoped>
.edit-tag {
  // min-width: 220px;
  .input {
    width: 100% !important;
    /deep/ .withSearch {
      width: 100% !important;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: none;
      &:focus {
        box-shadow: none;
        outline: none;
      }
    }
    /deep/ .boo-poptip-rel {
      vertical-align: middle;
    }
  }
  .input-wrapper {
    display: inline-flex;
    align-items: center;
    width: 100%;
  }
}
</style>
