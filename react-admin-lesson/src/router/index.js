const router = [
    {
      title: '控制台',
      icon: 'laptop',
      key: '/index',
      breadcrumbName: '控制台',
    },
    {
      title: '用户管理',
      icon: 'laptop',
      key: '/index/user',
        breadcrumbName: '用户管理',
      child: [
        {key: '/index/user/list', title: '用户列表', icon: '',breadcrumbName: '用户列表'},
        {
          key: '/index/user/add',
          title: '添加用户',
          icon: '',
            breadcrumbName: '添加用户'
        }
      ]
    },
    {
      title: '部门管理',
      icon: 'bars',
      key: '/index/department',
      child: [
        {key: '/index/department/list', title: '部门列表', icon: ''},
        {key: '/index/department/add', title: '添加部门', icon: ''},
      ]
    },
    {
      title: '职位管理',
      icon: 'edit',
      key: '/home/entry',
      child: [
        {key: '/home/entry/form/basic-form', title: '职位列表', icon: ''},
        {key: '/home/entry/form/step-form', title: '添加职位', icon: ''}
      ]
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
