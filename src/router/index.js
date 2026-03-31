import { createRouter, createWebHistory } from 'vue-router';
import { message } from 'ant-design-vue';
const files = import.meta.glob('./modules/*.js', {
  eager: true,
});

// 路由暂存
const routeModuleList = [];
// 遍历路由模块
Object.keys(files).forEach((key) => {
  const module = files[key].default || {};
  const moduleList = Array.isArray(module) ? [...module] : [module];
  routeModuleList.push(...moduleList);
});
// 存放动态路由
const asyncRouterList = [...routeModuleList];
// 存放固定路由
const defaultRouterList = [];

const routes = [...defaultRouterList, ...asyncRouterList];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return {
      el: '#app',
      top: 0,
      behavior: 'smooth',
    };
  },
});
router.beforeEach((to, from, next) => {
  // next(); // 必须调用 next()，否则页面会卡住
  // 条件判断决定next是否调用
  // 用户是否存在token来判断用户是否登录
  console.log('to:', to, 'from:', from, next);
  if (to.path === '/login') {
    next();
  } else {
    console.log(localStorage.getItem('token'));
    // 判断用户是否存在token
    if (localStorage.getItem('token')) {
      next();
    } else {
      message.error('请先登录');
      // 若果没有token，则跳转到登录页面
      next('/login'); // 参数格式与useRouter拿到的路由实例的push函数类似
    }
  }
});
// router.beforeEach((to, from, next) => {
//   console.log('to:', to, 'from:', from);
//   if (to.path === '/login') {
//     next();
//   } else {
//     const token = localStorage.getItem('token');
//     console.log('Token:', token);
//     if (token) {
//       next();
//     } else {
//       console.error('请先登录');
//       next('/login');
//     }
//   }
// });
export default router;
