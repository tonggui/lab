import isFunction from 'lodash/isFunction'

export const ActionNames = {
  SELECT_LIST_ITEM: 'SELECT_LIST_ITEM',
  SET_ITEM_SELECTION: 'SET_ITEM_SELECTION'
}

const ActionMap = {
  [ActionNames.SELECT_LIST_ITEM]: 'selectListItem',
  [ActionNames.SET_ITEM_SELECTION]: 'setItemSelection'
}

export default (options) => {
  const { dataKey = 'dataSource', actionMap = {} } = options || {}
  const ActionName = Object.assign({}, ActionMap, actionMap)
  return {
    data () {
      return {
        selectionIndex: -1
      }
    },
    watch: {
      [dataKey] (list = []) {
        if (list.length === 1) {
          this.selectionIndex = 0
        } else {
          this.selectionIndex = -1
        }
      }
    },
    computed: {
      isSelectionActive () {
        return this[dataKey].length > 0
      }
    },
    methods: {
      $_triggerAction (actionName, ...args) {
        if (isFunction(this[actionName])) {
          return this[actionName](...args)
        }
      },
      handleKeyDownEvent (event) {
        if (!this.isSelectionActive) {
          return false
        }
        if (event.key === 'ArrowUp') {
          event.preventDefault()
          this.moveSelection('up')
          return true
        } else if (event.key === 'ArrowDown') {
          event.preventDefault()
          this.moveSelection('down')
          return true
        } else if (event.key === 'Enter') {
          event.preventDefault()
          // 选项为空时，表明未选中状态下的回车操作
          this.$_triggerAction(
            ActionName[ActionNames.SELECT_LIST_ITEM],
            this[dataKey][this.selectionIndex],
            this.selectionIndex
          )
          return true
        }

        return false
      },
      isSelectionDisabled (item, idx) {
        if (!item && idx !== undefined) {
          item = this[dataKey][idx]
        }
        if ('disabled' in item) {
          return item.disabled
        }
        return false
      },
      moveSelection (direction, cursor = this.selectionIndex, maxTimes = this[dataKey].length) {
        if (maxTimes < 1) {
          return
        }
        let step = 0
        if (direction === 'up') {
          step = -1
        } else if (direction === 'down') {
          step = 1
        } else {
          return
        }

        const dataLength = this[dataKey].length
        cursor += step
        const newSelectionIndex = (cursor + dataLength) % dataLength
        const newSelectionItem = this[dataKey][newSelectionIndex]

        // 如果当前项禁止意图选中，则继续延续当前方向查找
        if (this.isSelectionDisabled(newSelectionItem, newSelectionIndex)) {
          return this.moveSelection(direction, cursor, --maxTimes)
        }
        this.selectionIndex = newSelectionIndex
        this.$_triggerAction(
          ActionName[ActionNames.SET_ITEM_SELECTION],
          newSelectionItem,
          newSelectionIndex
        )
        return true
      }
    }
  }
}
