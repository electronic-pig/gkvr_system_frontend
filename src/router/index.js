import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
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

export default router