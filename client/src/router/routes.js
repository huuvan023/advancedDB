
const routes = [
  {
    path: '/login',
    component: () => import('layouts/Login.vue'),
  },
  {
    path: '/',
    name: 'home',
    redirect: '/login',
    component: () => import('layouts/MainLayout.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'chattt', component: () => import('pages/Chat.vue') },
      { path: 'chat', component: () => import('pages/Realtime.vue') }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
