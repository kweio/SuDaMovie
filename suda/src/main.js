import Vue from 'vue'
// 引入vant组件
import Vant from 'vant';
// 引入vant样式
import 'vant/lib/index.css'
Vue.use(Vant)
import App from './App.vue'
// 全局引用并使用轮播图组件
// import VueAwesomeSwiper from 'vue-awesome-swiper'
import router from './router'
import Http from './http';
Vue.prototype.$http = Http
// Vue.use(VueAwesomeSwiper, /* { default options with global component } */)

Vue.config.productionTip = false
// 定义全局混入
Vue.mixin({
  methods: {
    // 判断是否登录
    async isLogin() {
      const userId = window.localStorage.getItem("userId");
      const WebToken = window.localStorage.getItem("WebToken");
      // 先判断userId与token是否存在,或者userId是否伪造
      if (!userId || !WebToken) {
        this.$toast({
          type: "fail",
          message: "请先登录",
          duration: 3000,
        });
        // 清除token
        window.localStorage.removeItem('WebToken')
        // 清除userId
        window.localStorage.removeItem('userId')
        return false
      }
      return true;
    },
  }
})

// 定义全局过滤器
import { date } from './filter/dateFormate'
Vue.filter('date', date)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
