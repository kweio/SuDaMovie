<template>
  <div id="login">
    <div class="box">
      <el-form :label-position="labelPosition" label-width="50px">
        <h3>SuDa影院后台管理系统</h3>
        <el-form-item label="用户">
          <el-input v-model="userData.name" clearable placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input placeholder="请输入密码" v-model="userData.password" show-password></el-input>
        </el-form-item>
        <el-form-item style="margin-top: 30px ;text-align:center">
          <el-button type="primary" size="medium" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import { login } from "../../api";
import Vue from "vue";
import { Input, Button } from "element-ui";
// import { Input, Button, Message, Form, FormItem } from "element-ui";
Vue.use(Input);
Vue.use(Button);
export default {
  name: "MyLogin",
  data() {
    return {
      labelPosition: "right",
      userData: {},
    };
  },
  methods: {
    async login() {
      // console.log(res)
      const res = await this.$http.post('/login', this.userData) // eslint-disable-line
      //保存token
      window.localStorage.setItem("WebToken", res.data.token);
      window.localStorage.setItem("userId", res.data.userID);
      //跳转路由,进主界面
      if(res.data.status === 422){
        this.$message({
          type:'error',
          message:res.data.message
        });
      } else if (res.data.status !== 422) {
        this.$message({
          type:'success',
          message:'登录成功'
        });
        await this.$router.push('/home/userList')
      }

      // this.$message({
      //   type: 'success',
      //   message: '登录成功'
      // })
    }
  },
}
</script>

<style >
html,body{
  height: 100%;
}
#login{
  width: 100%;
  height: 100%;
  background: url('./images/login.jpg');
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  color: #fff;
}

.box {
  width: 500px;
  height: 400px;
  background-color: rgba(255, 255, 255, .8);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  border-radius: 4px;
  box-shadow: 0 0 8px 8px #ccc;
}

h3 {
  margin-bottom: 40px;
  font-size: 36px;
  letter-spacing: 2px;
  color: #888;
  text-align: center
}
</style>