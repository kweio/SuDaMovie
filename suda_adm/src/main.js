import Vue from 'vue'
import App from './App.vue'
import router from './router'

import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from "element-ui";

Vue.config.productionTip = false

Vue.use(ElementUI)

import Http from './http';
Vue.prototype.$http = Http

// 定义全局混入
Vue.mixin({
  methods: {
    // 判断是否登录
    async isLogin() {
      const userId = window.localStorage.getItem("userId");
      const WebToken = window.localStorage.getItem("WebToken");
      // 先判断userId与token是否存在,或者userId是否伪造
      if (!userId || !WebToken) {
        this.$message({
          type: "fail",
          message: "请先登录",
          duration: 3000,
        });
        // 清除token
        window.localStorage.removeItem('WebToken')
        // 清除userId
        window.localStorage.removeItem('userId')
        // 保存跳转前所处页面路径
        // window.localStorage.setItem("fromPath", this.$route.fullPath);
        // setTimeout(() => {
        //   this.$router.push("/");
        // }, 1000);
        return false
      }
      // 判断userId与token是否伪造
      // 这里如果userId是伪造，不会返回Ok，如果token是伪造，会返回401错误，由http拦截处理
      // const { data } = await this.$http.get(`/oneUser/${userId}`)
      // if (data.status !== 300) {
      //   this.$message({
      //     type: "fail",
      //     message: "请先登录",
      //     duration: 3000,
      //   });
      //   // 清除token
      //   window.localStorage.removeItem('WebToken')
      //   // 清除userId
      //   window.localStorage.removeItem('userId')
      //   // 保存跳转前所处页面路径
      //   window.localStorage.setItem("fromPath", this.$route.fullPath);
      //   setTimeout(() => {
      //     this.$router.push("/");
      //   }, 1000);
      //   return false
      // }
      return true;
    },
  }
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
