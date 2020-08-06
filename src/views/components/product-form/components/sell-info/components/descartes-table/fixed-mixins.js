export default {
  data () {
    return {
      fixedPosition: {}
    }
  },
  watch: {
    columns () {
      this.updateFixedPosition()
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
      for (let i = 0, j = this.columns.length - 1; j > 0; i++, j--) {
        if (this.columns[i].fixed === 'left') {
          fixedPosition[this.columns[i].id] = leftOffset
        }
        if (this.columns[j].fixed === 'right') {
          fixedPosition[this.columns[j].id] = rightOffset
        }
        leftOffset += (this.$refs.col && this.$refs.col[i] && this.$refs.col[i].offsetWidth) || 0
        rightOffset += (this.$refs.col && this.$refs.col[j] && this.$refs.col[j].offsetWidth) || 0
      }
      this.fixedPosition = fixedPosition
    }
  },
  mounted () {
    this.updateFixedPosition()
  }
}
