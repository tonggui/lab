'use strict'
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = {
  context: path.resolve(__dirname, './'),
  resolve: {
    extensions: ['.js', '.vue', '.jsx', 'ts', 'tsx'],
    alias: {
      '@': resolve('src'),
      '@components': resolve('src/components')
    }
  }
}
