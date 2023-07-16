<template>
  <div class="login">
    <!-- 登录内容部分 -->
    <div class="login-container">
      <!-- 登录头部部分 -->
      <div class="login-header">
        <i class="eng-title">SuDa Movie</i>
      </div>
      <!-- 登录内容部分 -->
      <div class="login-content">
        <!-- 登录部分 -->
        <div class="login-main">
          <form>
            <!-- 密码登录部分 -->
            <div class="login-phone">
              <section class="login-info">
                <input
                    type="text"
                    placeholder="请输入用户名"
                    v-model="user.name"
                />
              </section>
              <section class="login-info">
                <input
                    type="password"
                    placeholder="请输入密码"
                    v-model="user.password"
                />
              </section>
              <section class="login-info">
                <!-- 验证码组件 -->
                <input
                    type="text"
                    placeholder="请输入验证码"
                    v-model="passwordCode"
                />
                <div @click.prevent="refreshIdentifyCode">
                  <SIdentify :identifyCode="identifyCode" class="codeBtn">
                  </SIdentify>
                </div>
              </section>
            </div>
            <button class="login-submit" @click.prevent="login">登录</button>
            <a class="register-submit" @click="register">立即注册</a>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 引入登录验证组件
import SIdentify from "@/components/SIdentify";

export default {
  name: "MyLogin",
  data() {
    return {
      // 密码登录部分
      user:{
        name: "", //用户名
        password: "", //密码
      },
      passwordCode: "", //输入的验证码
      identifyCode: "", //密码登录图形验证码
      identifyCodes: "1234567890", //生成图形验证码的依据
    };
  },
  computed: {},
  components: {SIdentify},
  methods: {
    register(){
       this.$router.push('/register')
    },
    // 登录按钮触发
    async login() {
      // 密码登录
      if (!this.user.name) {
        return this.$dialog.alert({
          title: "提示",
          message: "请输入用户名",
          theme: "round-button",
          confirmButtonColor: "#6F9839",
        });
      }
      if (!this.user.password) {
        return this.$dialog.alert({
          title: "提示",
          message: "请输入密码",
          theme: "round-button",
          confirmButtonColor: "#6F9839",
        });
      }
      if (!this.passwordCode) {
        return this.$dialog.alert({
          title: "提示",
          message: "请输入验证码",
          theme: "round-button",
          confirmButtonColor: "#6F9839",
        });
      }
      if (this.passwordCode !== this.identifyCode) {
        return this.$dialog.alert({
          title: "提示",
          message: "请输入正确的验证码",
          theme: "round-button",
          confirmButtonColor: "#6F9839",
        });
      }
      // 验证通过,发送登录请求
      const res = await this.$http.post('/userLogin',this.user) // eslint-disable-line
      //保存token
      window.localStorage.setItem("WebToken", res.data.token);
      window.localStorage.setItem("userId", res.data.userID);

      if (res.data.status !== 300) {
        return this.$dialog.alert({
          title: "提示",
          message: res.data.message,
          theme: "round-button",
          confirmButtonColor: "#6F9839",
        });
      }else {
        this.$toast({
          type:'success',
          message:'登录成功'
        });
        await this.$router.push('/mine')
      }
    },
    // 登录验证码部分
    // 刷新验证码
    refreshIdentifyCode() {
      this.identifyCode = "";
      this.makeIdentifyCode(4);
    },
    // 生成l位数的随机验证码
    makeIdentifyCode(l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode +=
            this.identifyCodes[this.randomNum(0, this.identifyCodes.length)];
      }
    },
    // 生成单个验证码
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
  },
  mounted() {
    // 初始化验证码
    this.identifyCode = "";
    this.makeIdentifyCode(4);
  },
}

</script>

<style lang="less" scoped>
.body {
  margin: 0;
}
/* 外部容器样式 */
.login {
  width: 100vw;
  height: 100vh;
  /* 渐变背景 */
  background: linear-gradient(125deg, #ffbe32, #b3fffa, #b6f597, #fdff79);
  /* 指定背景图像的大小 */
  background-size: 500%;
  /* 执行动画：动画名 时长 线性的 无限次播放 */
  animation: bgAnimation 15s linear infinite;
}

/* 定义动画 */
@keyframes bgAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
// 登录内容部分
.login-container {
  // 登录头部部分
  .login-header {
    padding-top: 3.5385rem;
    font-size: 2.5385rem;
    color: #6F9839;
    text-align: center;
    span {
      font-size: 7.6923rem;
    }
  }
  // 登录内容部分
  .login-content {
    // 登录部分
    .login-main {
      padding: 2.7692rem 3.0769rem;
      margin-top: 1rem;
      .login-info {
        position: relative;
        width: 100%;
        height: 3.0769rem;
        input {
          width: 100%;
          height: 100%;
          //border: none;
          border-radius:  2.5rem;
          padding: 0 1rem;
          font-size: 1.0769rem;
          box-sizing: border-box;
          border: 0.0769rem solid transparent;
        }
        // 验证码按钮样式
        .codeBtn {
          position: absolute;
          right: 0.9692rem;
          border: none;
          //padding-left: 3.3846rem;
          background: transparent;
          top: 50%;
          transform: translate(10%, -50%);
        }
        。register-submit{
          float: right;
        }
      }
      .login-phone {
        height: 15.5385rem;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        // 提示部分样式
        .login-tip {
          text-align: justify;
          color: rgb(150, 150, 150);
        }
      }
      // 登录按钮部分
      .login-submit {
        margin-top: 0.7692rem;
        width: 100%;
        font-size: 1.2308rem;
        padding: 1.1538rem 0;
        color: #fff;
        background-color: #6F9839;
        border: none;
        border-radius:  2.5rem;
      }
      // 注册文本部分
      .register-submit{
        margin: 1rem 1rem;
        float: right;
      }
    }
  }
}
</style>
