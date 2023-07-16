import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    // 登录页
  {
    path: '/',
    name: 'login',
    component: () => import('../views/login/MyLogin.vue'),
    meta:{
      index:50
    }
  },
  // 注册页
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/login/MyRegister.vue'),
    meta:{
      index:50
    }
  },
  // 首页
  {
    path: '/Home',
    name: 'Home',
    component: () => import('../views/HomePage.vue'),
    meta: {
      showTabBar: true,
      index: 1
    }
  },
  // 订单页
  {
    path: '/order',
    name: 'mineOrder',
    component: () => import('../views/Mine/MineOrder.vue'),
    meta: {
      showTabBar: true,
      index: 3
    }
  },
  // 个人中心页
  {
    path: '/mine',
    name: 'mine',
    component: () => import('../views/Mine/Mine.vue'),
    meta: {
      showTabBar: true,
      index: 4
    },
  },
  // 个人信息页面
  {
    path: '/mineInfo',
    name: 'mineInfo',
    component: () => import('../views/Mine/MineInfo.vue'),
    meta: {
      index: 5
    }
  },
  // 电影详情页面
  {
    path: '/movieDetail/:id',
    name: 'movieDetail',
    component: () => import('../views/Movie/MovieDetail.vue'),
    props: true,
    meta: {
      index: 6
    }
  },
  // 场次选择页面
  {
    path: '/planDetail',
    name: 'planDetail',
    component: () => import('../views/Select/PlanDetail.vue'),
    meta: {
      index: 8
    }
  },
  // 座位选择页面
  {
    path: '/seatSelect',
    name: 'seatSelect',
    component: () => import('../views/Select/SeatSelect.vue'),
    meta: {
      index: 8
    }
  },
  //
  {
    path: '/orderSubmit',
    name: 'orderSubmit',
    component: () => import('../views/Order/OrderSubmit.vue'),
    meta: {
      index: 9
    }
  },
  {
    path: '/orderPay',
    name: 'orderPay',
    component: () => import('../views/Order/OrderPay.vue'),
    meta: {
      index: 10
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
