export default [
  {
    path: '/',
    redirect: '/index', // 添加重定向规则
  },

  // {
  //   path: '/pinia',
  //   name: 'pinia',
  //   component: () => import('@/views/PiniaView.vue'),
  // },
  {
    path: '/dictionary',
    name: 'dictionary',
    meta: {
      title: '数据字典',
    },
    component: () => import('@/pages/dictionary/Dictionary.vue'),
  },
  {
    path: '/FarmManage',
    name: 'FarmManage',
    meta: {
      title: '牧场管理',
    },
    component: () => import('@/pages/farmManage/Farm.vue'),
  },
  {
    path: '/index',
    name: 'index',
    meta: {
      title: '主页',
    },
    component: () => import('@/pages/index.vue'),
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      layout: false,
    },
    component: () => import('@/pages/login/login.vue'),
  },
  {
    path: '/PenManage',
    name: 'PenManage',
    meta: {
      title: '圈舍管理',
    },
    component: () => import('@/pages/penManage/PenManage.vue'),
  },
  {
    path: '/userManage',
    name: 'userManage',
    meta: {
      title: '人员管理',
    },
    component: () => import('@/pages/userManage/user.vue'),
  },
];
