import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const demofiles = require.context("./components", true, /demo\.vue$/);
// console.dir(demofiles);
// console.log(demofiles.keys());
// console.log(demofiles(demofiles.keys()[0]));

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      name: "productList",
      path: "/product/list",
      component: () =>
        import(
          /* webpackChunkName: "product-list" */ "./views/product-list/index.vue"
        )
    },
    {
      path: "/",
      redirect: { name: "productList" }
    },
    {
      path: "/demo",
      component: () =>
        import(/* webpackChunkName: "demo" */ "./views/demo/index.vue"),
      children: demofiles.keys().map(key => ({
        name: demofiles(key).default.name,
        path: demofiles(key).default.name,
        component: demofiles(key).default
      }))
    }
  ]
});
