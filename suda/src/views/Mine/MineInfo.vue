<template>
  <div class="MineInfo">
    <!-- 顶部topBar部分 -->
    <TopBar bgc="#fff" centerContent="我的资料" @backIconClick="backIconClick"></TopBar>
    <div class="main">
      <!-- 头像 -->
      <div class="avatar public">
        <div class="left">
          <span class="title">头像</span>
        </div>
        <div class="right">
          <van-uploader :after-read="afterImage">
<!--            :after-read="afterImage"-->
            <img :src="userInfo.icon" >
          </van-uploader>
<!--          <van-icon name="arrow" />-->
        </div>
      </div>
      <!-- 昵称 -->
      <div class="name public" @click="showUsernamePicker = true">
        <div class="left">
          <span>昵称</span>
        </div>
        <div class="right">
          <span> {{ userInfo.name }} </span>
<!--          <van-icon name="arrow" />-->
        </div>
      </div>
      <!-- 年龄-->
      <div class="age public" @click="showUserAgePicker = true">
        <div class="left">
          <span>年龄</span>
        </div>
        <div class="right">
          <span> {{ userInfo.age }} </span>
        </div>
      </div>
      <!-- 性别 -->
      <div class="sex public">
        <div class="left">
          <span>性别</span>
        </div>
        <div class="right">
          <span>
            <van-field
                style="text-align: center"
                input-align="center"
                readonly
                clickable
                :value="userInfo.sex"
                placeholder="选择性别"
                @click="showSexPicker = true"
            />
          </span>
          <!--          <van-icon name="arrow" />-->
        </div>
      </div>
      <!-- 手机 -->
      <div class="phone public" @click="phoneClick">
        <div class="left">
          <span>手机</span>
        </div>
        <div class="right">
          <span> {{ userInfo.phone }} </span>
          <!--          <van-icon name="arrow" />-->
        </div>
      </div>
    </div>

    <!-- 按钮部分 -->
    <div class="Btn">
      <!-- 修改密码按钮 -->
      <van-button round type="info" class="outBtn" @click="UpdatePwdClick"
        >修改密码</van-button
      >
      <!-- 退出登录按钮 -->
      <van-button round type="info" class="outBtn" @click="logout"
        >退出登录</van-button
      >
    </div>
    <!-- 昵称部分弹出层 -->
    <van-popup v-model="showUsernamePicker" round @close="UpdateUserInfo">
      <van-field
        style="width: 100%"
        v-model="userInfo.name"
        label="昵称"
        placeholder="请输入昵称"
        label-width="3rem"
      />
    </van-popup>
    <!--年龄部分弹出框-->
    <van-popup v-model="showUserAgePicker" round @close="UpdateUserInfo">
      <van-field
          style="width: 100%"
          v-model="userInfo.age"
          label="年龄"
          placeholder="请输入年龄"
          label-width="3rem"
      />
    </van-popup>
    <!-- 性别选择器弹出层 -->
    <van-popup
      v-model="showSexPicker"
      round
      position="bottom"
      @close="UpdateUserInfo"
    >
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="showSexPicker = false"
        @confirm="SexOnConfirm"
      />
    </van-popup>
    <!-- 修改密码部分弹出层 -->
    <van-popup v-model="showUpdatePwdPicker" round @close="UpdatePwd">
      <van-field
        type="password"
        style="width: 80vw"
        label="旧密码"
        placeholder="请输入旧密码"
        label-width="5rem"
        v-model="changePwd.oldPwd"
      />
      <van-field
        type="password"
        style="width: 80vw"
        label="新密码"
        placeholder="请输入新密码"
        label-width="5rem"
        v-model="changePwd.newPwd"
      />
      <van-field
        type="password"
        style="width: 80vw"
        label="确认密码"
        placeholder="请再次输入新密码"
        label-width="5rem"
        v-model="changePwd.confirmPwd"
      />
    </van-popup>
  </div>
</template>

<script>
import TopBar from "@/components/TopBar.vue";
export default {
  name: "MineInfo",
  data() {
    return {
      userId: "",
      userInfo: "", //用户信息
      // 性别选择器与弹出框部分
      showSexPicker: false,
      columns: ["男", "女"],
      // 昵称弹出框部分
      showUsernamePicker: false,
      showUserAgePicker: false,
      selectDate: "",
      // 修改密码弹出框部分
      showUpdatePwdPicker: false,
      // 修改密码部分
      changePwd: {
        oldPwd: "",
        newPwd: "",
        confirmPwd: "",
      },
    };
  },
  components: {
    TopBar,
  },
  methods: {
    // 顶部返回按钮点击触发
    backIconClick() {
      this.$router.back();
    },
    // 获取用户信息
    async getUserInfo() {
      // 先判断是否为登录状态
      if (await this.isLogin()) {
        const {
          data: {userInfo}
        } = await this.$http.get(`/oneUser/${this.userId}`)
        this.userInfo = userInfo
      }
    },
    // 性别选择器部分
    SexOnConfirm(value) {
      this.userInfo.sex = value;
      this.showSexPicker = false;
    },
    // 点击手机触发
    phoneClick() {
      this.$toast({
        type: "fail",
        message: "手机号已用于注册，不可修改",
      });
    },

    // 弹出层关闭触发，发送请求更新用户信息
    async UpdateUserInfo() {
      const { data } = await this.$http.put(
          `/oneUser/${this.userInfo._id}`,
          this.userInfo
      );
      this.$toast({
        type: "success",
        message: data.message,
      });
    },
    // 退出登录
    async logout() {
      const result = await this.$dialog
          .confirm({
            title: "警告",
            message: "是否确定退出登录？",
            confirmButtonColor: "#1989fa",
          })
          .catch((err) => err);
      if (result === "confirm") {
        window.localStorage.removeItem("WebToken");
        window.localStorage.removeItem("userId");
        this.$toast({
          type: "success",
          message: "退出登录成功",
        });
        setTimeout(() => {
          this.$router.replace("/home");
        }, 1000);
      }
    },
    // 点击修改密码触发
    UpdatePwdClick() {
      this.changePwd = {
        oldPwd: "",
        newPwd: "",
        confirmPwd: "",
      };
      this.showUpdatePwdPicker = true;
    },
    // 修改密码弹出框关闭触发
    async UpdatePwd() {
      const params = {
        changePwd:this.changePwd,
        userId:this.userId
      }
      // 表单验证
      if (!this.changePwd.oldPwd) {
        return this.$toast({
          type: "fail",
          message: "旧密码不可为空",
          duration: 1000,
        });
      }
      if (!this.changePwd.newPwd) {
        return this.$toast({
          type: "fail",
          message: "新密码不可为空",
          duration: 1000,
        });
      }
      if (!this.changePwd.confirmPwd) {
        return this.$toast({
          type: "fail",
          message: "确认密码不可为空",
          duration: 1000,
        });
      }
      if (this.changePwd.confirmPwd !== this.changePwd.newPwd) {
        return this.$toast({
          type: "fail",
          message: "新密码与确认密码不一致",
          duration: 1000,
        });
      }
      if (this.changePwd.oldPwd === this.changePwd.newPwd) {
        return this.$toast({
          type: "fail",
          message: "旧密码与新密码不能一致",
          duration: 1000,
        });
      }
      const { data } = await this.$http.post(
          `/oneUser/${this.userId}`,
          params
      );

      // 后台验证不通过，弹出错误信息
      if (data.status !== "300") {
        return this.$dialog.alert({
          title: "提示",
          message: data.message,
          theme: "round-button",
          confirmButtonColor: "#fa209f",
        });
      }
      // 后台通过
      return this.$toast({
        type: "success",
        message: data.message,
        duration: 1000,
      });
    },
    //上传头像
    async afterImage(file){
      let formData = new FormData();
      formData.append("file", file.file);
      const { data } = await this.$http.post("/user/upload", formData);
      console.log(data);
      this.userInfo.icon = data.url;
      // 更新数据
      this.UpdateUserInfo();
    }
  },
  created() {
    this.userId = window.localStorage.getItem("userId");
    this.getUserInfo();
  },
}
</script>
<style lang="less" scoped>
// 最外层容器
.MineInfo {
  background-color: #fff;
  height: 100vh;
  width: 100vw;
}
// 公共部分代码
.public {
  display: flex;
  justify-content: space-between;
  font-size: 1.2308rem;
  border-bottom: 0.0769rem solid #ccc;
  padding: 1.5385rem 0;
}
// 主体内容区域
.main {
  width: 100%;
  margin-top: 4.5rem;
  .public{
    //padding: 1.2692rem 0;
    .left{
      width: 75%;
      display: flex;
      align-items: center;
      text-align: left;
      margin-left: 1.5rem;
    };
    .right{
      display: flex;
      width: 25%;
      margin-right: 2.5rem;
      text-align: center;
      align-items: center;
      justify-content: center;
      img {
        width: 5.3846rem;
        height: 5.3846rem;
        border-radius: 100%;
      };
    }
  }
  // 头像部分
  .avatar {
    .left {
      .title {
        width: 20%;
      }
      .content {
        width: 80%;
      }
    }
  }
  // 性别部分
  .sex {
    padding: 0.9385rem 0;
    .left {
      flex: 1;
      display: flex;
      align-items: center;
    }
  }
}
// 按钮部分样式
.Btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 2.3077rem;
  // 退出登录按钮样式
  // margin: 0.3846rem 0;
  .outBtn {
    margin-top: 0.7692rem;
    width: 90%;
  }
}
</style>