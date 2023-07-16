<template>
  <div class="login">
    <!-- 登录内容部分 -->
    <div class="login-container">
      <!--       登录头部部分-->
      <div class="login-header">
        <i class="eng-title">欢迎注册</i>
      </div>
      <!-- 登录内容部分 -->
      <div class="login-content">
        <!-- 注册部分 -->
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
                    type="number"
                    placeholder="请输入手机号"
                    v-model="user.phone"
                />
                <button
                    @click.prevent="getValidateCode"
                    :class="['codeBtn', checkPhone ? 'active-code' : '']"
                    v-if="countDown === 0"
                >
                  获取验证码
                </button>
                <div class="codeBtn" v-else>重新获取({{ countDown }}s)</div>
              </section>
              <!-- 验证码输入框部分 -->
              <section class="login-info">
                <input
                    type="number"
                    placeholder="请输入验证码"
                    v-model="phoneCode"
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
                <input
                    type="password"
                    placeholder="请再次输入密码"
                    v-model="user.re_password"
                />
              </section>
            </div>
            <button class="login-submit" @click.prevent="register(user)">注册</button>
            <section class="login-info login-tip">
              <van-checkbox class="read" v-model="checked">阅读并同意
                <a href="#">《用户协议》</a>与
                <a href="#">《隐私政策》</a>
              </van-checkbox>
            </section>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "MyRegister",
  data() {
    return {
      phoneCode: "", // 输入的手机验证码
      phoneIdentifyCode: "", //生成的手机验证码
      phoneIdentifyCodes: "1234567890", //生成手机验证码的依据
      countDown: 0, //倒计时,获取验证码与重新获取验证码切换状态
      checked: false,
      //-------------分割线--------------
      // 用户信息
      user: {
        name: "", //用户名
        phone: "", //手机号
        password: "", //密码
        re_password: "",
        sup:false
      },
    };
  },
  computed: {
    //正则匹配验证手机号
    checkPhone() {
      const phoneCheck =/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
      return phoneCheck.test(this.user.phone)
    },
  },
  methods: {
    // 注册按钮触发
    async register() {
      // 密码登录
      // 表单验证
      if (!this.user.name) {
        return this.$toast({
          title: "fail",
          message: "请输入用户名",
          duration: 1000,
        });
      } else if (!this.user.password) {
        return this.$toast({
          type: "fail",
          message: "密码不可为空",
          duration: 1000,
        });
      } else if (!this.user.re_password) {
        return this.$toast({
          type: "fail",
          message: "请确认密码",
          duration: 1000,
        });
      } else if (this.user.password !== this.user.re_password) {  //两次密码是否相等
        return this.$toast({
          type: "fail",
          message: "密码不一致",
          duration: 1000,
        });
      } else if (this.checked != true) {       //有无勾选《用户协议》与《隐私政策》
        return this.$toast({
          type: "fail",
          message: "请仔细阅读《用户协议》与《隐私政策》后再注册",
          duration: 1000,
        });
      } else {
        const params = {
          name: this.user.name,
          phone: this.user.phone,
          password: this.user.password,
          sup: this.user.sup
        }
        const res = await this.$http.post('/register', params)// eslint-disable-line no-unused-vars
        if (res.data.status !== 300) {
          return this.$dialog.alert({
            title: "提示",
            message: res.data.message,
            theme: "round-button",
            confirmButtonColor: "#6F9839",
          });
        } else {
          this.$toast({
            type: 'success',
            message: '登录成功'
          });
          await this.$router.push('/')
        }
      }
    },
    // 点击获取验证码触发
    getValidateCode() {
      // 计时中无法触发函数
      if (this.countDown !== 0) {
        return;
      }
      // 先判断手机号是否输入正确
      if (!this.checkPhone) {
        return this.$dialog.alert({
          title: "提示",
          message: "请输入正确格式的手机号",
          theme: "round-button",
          confirmButtonColor: "#6F9839",
        });
      }
      this.countDown = 10;
      // 计时10秒
      let timer = setInterval(() => {
        this.countDown--;
        if (this.countDown === 0) {
          clearInterval(timer);
        }
      }, 1000);
      // 在每次获取时清空上次获取的验证码值
      this.phoneIdentifyCode = "";
      // 获取验证码
      this.makePhoneIdentifyCode(4);
      this.$dialog.alert({
        title: "提示",
        message: `手机验证码为:${this.phoneIdentifyCode}`,
        theme: "round-button",
        confirmButtonColor: "#6F9839",
      });
    },
    // 生成l位数的随机验证码
    makePhoneIdentifyCode(l) {
      for (let i = 0; i < l; i++) {
        this.phoneIdentifyCode += this.phoneIdentifyCodes[
            this.randomNum(0, this.phoneIdentifyCodes.length)
                ];
      }
    },
    // 生成单个验证码
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
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
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

// 登录内容部分
.login-container {
  // 登录头部部分
  .login-header {
    padding-top: 2.0385rem;
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
      padding: 0.7692rem 3.0769rem;
      .login-info {
        position: relative;
        width: 100%;
        height: 3.0769rem;
        //padding-top: 1.5385rem;
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
        .register-submit {
          float: right;
        }
        input {
          width: 100%;
          height: 100%;
          //border: none;
          border-radius: 2.5rem;
          padding: 0 1rem;
          font-size: 1.0769rem;
          box-sizing: border-box;
          border: 0.0769rem solid transparent;
        }
      }
      .login-phone {
        height: 25.5385rem;
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
        border-radius: 2.5rem;
      }
      .read{
          margin-top: 1rem;
          font-size:smaller;
      }
    }
  }
}
</style>
