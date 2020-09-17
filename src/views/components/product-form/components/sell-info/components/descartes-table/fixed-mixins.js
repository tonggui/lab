import { get } from 'lodash'

export default {
  data () {
    return {
      fixedPosition: {}
    }
  },
  watch: {
    columns () {
      this.$nextTick(this.updateFixedPosition)
      // this.updateFixedPosition()
    }
  },
  methods: {
    fixStyles (col) {
      const styles = {}
      if (col.fixed === 'left') {
        styles.position = 'sticky'
        styles.left = `${this.fixedPosition[col.id]}px`
      } else if (col.fixed === 'right') {
        styles.position = 'sticky'
        styles.right = `${this.fixedPosition[col.id]}px`
      }
      return styles
    },
    fixClass (col) {
      let fixLeftLast = null
      let fixRightFirst = null
      this.columns.forEach(c => {
        if (c.fixed === 'left') {
          fixLeftLast = c
        } else if (c.fixed === 'right' && !fixRightFirst) {
          fixRightFirst = c
        }
      })
      return {
        'fix-left': col.fixed === 'left',
        'fix-left-last': fixLeftLast === col,
        'fix-right': col.fixed === 'right',
        'fix-right-first': fixRightFirst === col
      }
    },
    updateFixedPosition () {
      const fixedPosition = {}
      let leftOffset = 0
      let rightOffset = 0
      for (let i = 0, l = this.columns.length; i < l; i++) {
        const col = this.columns[i]
        if (col.fixed === 'left') {
          fixedPosition[col.id] = leftOffset
        }
        leftOffset += get(this.$refs, `${col.id}[0].offsetWidth`) || 0
      }
      for (let j = this.columns.length - 1; j >= 0; j--) {
        const col = this.columns[j]
        if (col.fixed === 'right') {
          fixedPosition[col.id] = rightOffset
        }
        const width = get(this.$refs, `${col.id}[0].offsetWidth`) || 0
        leftOffset += width
        rightOffset += width
      }
      this.fixedPosition = fixedPosition
    }
  },
  mounted () {
    this.updateFixedPosition()
  }
}
