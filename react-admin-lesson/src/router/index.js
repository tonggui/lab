const router = [

    {
      title: '任务创建',
      icon: 'laptop',
      key: '/task/create',
      breadcrumbName: '任务创建'
    },
    {
      title: '任务管理',
      icon: 'bars',
      key: '/task/list',
    }
  ]
//
// function itemRender(route, params, routes, paths) {
//   const last = routes.indexOf(route) === routes.length - 1;
//   return last ? (
//       <span>{route.breadcrumbName}</span>
//   ) : (
//       <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
//   );
// }
//
// return <Breadcrumb itemRender={itemRender} routes={routes} />;

  export default router;
