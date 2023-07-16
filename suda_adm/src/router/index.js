import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path:'/register',
    name:'register',
    component: ()=>import ('../views/Login/MyRegister.vue'),
  },
  {
    path:'/',
    name:'login',
    component: ()=>import ('../views/Login/MyLogin.vue'),
  },
  {
    path: '/home',
    name: 'main',
    component:()=>import('../views/Home/MyMain.vue'),
    children:[
      {
        path:'/home/userList',
        component:()=>import('../views/Home/User/UserList.vue'),
      },

      {
        path:'/home/movieList',
        component:()=>import('../views/Home/Movie/MovieList.vue'),
      },
      {
        path:'/home/movieCategory',
        component:()=>import('../views/Home/Category/MovieCategory.vue'),
      },
      {
        path:'/home/addMovie',
        component:()=>import('../views/Home/Movie/AddMovie.vue'),
      },
      {
        path:'/home/movieAdvertise',
        component:()=>import('../views/Home/Advertise/MovieAdvertise.vue'),
      },
      {
        path: '/home/moviePlan',
        component:()=>import('../views/Home/Plan/MoviePlan.vue'),
      },
      {
        path:'/home/movieHall',
        component:()=>import('../views/Home/Hall/MovieHall.vue'),
      },
      {
        path:'/home/orderList',
        component:()=>import('../views/Home/Order/OrderList.vue'),
      }
    ],

  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
