<template>
  <div id="login">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>登录</span>
      </div>
      <el-form>
        <el-form-item label="用户名:">
          <el-input clearable placeholder="请输入用户名" v-model="user.name"></el-input>
        </el-form-item>
        <el-form-item label="密码:">
          <el-input placeholder="请输入密码" show-password v-model="user.password"></el-input>
        </el-form-item>
        <el-form-item style="margin-top: 30px ;text-align:center">
          <el-button type="primary" size="medium" @click="login">登录</el-button>
          <hr style="margin-top: 25px">
          <i style="margin-top: 30px">如果没有账号？
            <el-button type="text" size="medium" @click="register">注册</el-button>
          </i>
        </el-form-item>
      </el-form>
    </el-card>


  </div>
</template>
<script>
export default {
  name: "MyLogin",
  data() {
    return {
      user:{},
      tabPosition: 'top'
    };
  },
  methods: {
    async login() {
      // console.log(res)
      const res = await this.$http.post('login',this.user) // eslint-disable-line
      //保存token
      //保存token
      window.localStorage.setItem("WebToken", res.data.token);
      window.localStorage.setItem("userId", res.data.userID);
      //跳转路由,进主界面
      await this.$router.push('/sudaMovie')
      this.$message({
        type:'success',
        message:'登录成功'
      })
    },

    register() {
      this.$router.push('/register')
    }
  }
}
</script>
<style scoped>
/*html,body{*/
/*  height: 100%;*/
/*}*/
/*#login{*/
/*  width: 100%;*/
/*  height: 100%;*/
/*  margin-top: 50px;*/
/*  background-size: cover;*/
/*  display: flex;*/
/*  justify-content: center;*/
/*  align-items: center;*/
/*  flex-flow: column;*/

/*}*/
.box-card {
  width: 30rem;
  margin: 10rem auto;
}


</style>