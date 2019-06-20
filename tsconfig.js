{
  "compilerOptions": {
    "outDir": "./dist/",
    "sourceMap": true,
    "experimentalDecorators": true,
    "strictNullChecks": true,
    "noUnusedParameters": true,
    "noUnusedLocals": true,
    "allowJs": true,
    // 与 Vue 的浏览器支持保持一致
    "target": "es5",
    // 这可以对 `this` 上的数据属性进行更严格的推断
    "strict": true,
    // 如果使用 webpack 2+ 或 rollup，可以利用 tree-shake:
    "module": "es2015",
    "moduleResolution": "node"
  },
  "include": [
    "./src/data/**/*"
  ]
}
