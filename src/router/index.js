import { createRouter, createWebHistory } from 'vue-router'

// import store from '../store/index.js'

const routes = [{
  path: '/',
  redirect: '/home'
},
{
  path: '/login',
  name: 'login',
  component: () => import('../views/LoginView.vue'),
},
{
  path: '/home',
  component: () => import('../views/HomeView.vue'),
  children: [{
    path: '',
    redirect: '/home/school'
  },
  {
    path: 'school',
    name: 'school',
    component: () => import('../views/SchoolView.vue'),
  },
  {
    path: 'special',
    name: 'special',
    component: () => import('../views/SpecialView.vue'),
  },
  {
    path: 'recommend',
    name: 'recommend',
    component: () => import('../views/RecommendView.vue'),
  },
  ]
},
{
  path: '/schoolDetail',
  name: 'schoolDetail',
  component: () => import('../views/SchoolDetailView.vue'),
},
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


// router.beforeEach((to, from, next) => { //全局钩子函数
//   to.meta.title && (document.title = to.meta.title);
//   if (to.path === '/login') {
//     next();
//   } else {
//     if (localStorage.getItem('ms_username') === null) {
//       alert("请登录！")
//       next('/login');
//     } else {
//       // next('/login');
//       next();
//     }
//   }
// });

export default router