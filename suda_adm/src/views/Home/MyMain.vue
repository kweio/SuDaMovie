<template>
  <el-container style="height: 100vh;">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu router :default-openeds="['1', '3']">
        <el-menu-item index="/home/userList">
          <i class="el-icon-s-custom"></i>用户管理
        </el-menu-item>
        <el-submenu>
          <template slot="title"><i class="el-icon-video-camera-solid"></i>影片管理</template>
          <el-menu-item index="/home/addMovie">新增电影</el-menu-item>
          <el-menu-item index="/home/movieList">电影列表</el-menu-item>
        </el-submenu>
        <el-menu-item index="/home/moviePlan">
          <i class="el-icon-s-order"></i>场次管理
        </el-menu-item>
        <el-menu-item index="/home/movieCategory">
          <i class="el-icon-s-flag"></i>分类管理
        </el-menu-item>
        <el-menu-item index="/home/movieHall">
          <i class="el-icon-s-home"></i>影厅管理
        </el-menu-item>
        <el-menu-item index="/home/OrderList">
          <i class="el-icon-s-ticket"></i>订单管理
        </el-menu-item>
        <el-menu-item index="/home/movieAdvertise">
          <i class="el-icon-picture"></i>广告管理
        </el-menu-item>
      </el-menu>
        <div class="block">
          <div class="head_portrait"><el-avatar  :size="100" :src="userAvatar"></el-avatar></div>
<!--          <div class="head_portrait"><img :src="userInfo.icon" style="width: 80%;height:80%"></div>-->
          <div class="admName"><i>SuDa影院后台管理系统</i></div>
          <div class="exit"><el-button type="danger" size="mini" style="margin: 0 auto" v-on:click="exit">退出</el-button></div>
        </div>
    </el-aside>
    <el-container>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

export default {
  name: 'MyMain',
  data() {
    return {
      userAvatar: "",
    };
  },
  methods:{
    async getUserInfo() {
      // 先判断是否为登录状态
      if (await this.isLogin()) {
        const userId = window.localStorage.getItem("userId");
        const {
          data:{userInfo}
        } = await this.$http.get(`/oneUser/${userId}`)
        this.userAvatar = userInfo.icon
      }
    },
    async exit(){
      // 清除token
      window.localStorage.removeItem('WebToken')
      // 清除userId
      window.localStorage.removeItem('userId')
      await this.$router.push({
        path: `/`,
      });
    }
  },
  mounted() {
    this.getUserInfo();
  }
};
</script>

<style scoped>
.head_portrait{
  text-align: center;
  margin-top: 30%;
}
.admName{
  text-align: center;
  margin-top: 10%;
  font-size:large;
}
.exit{
  width: 50px;
  margin: 30px auto;
}
</style>
