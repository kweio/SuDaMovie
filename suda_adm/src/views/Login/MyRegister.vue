<template>
  <div id="register">
    <div class="box">
      <!--      :rules="rules"-->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>注册</span>
        </div>
        <!--        注册用户信息表单-->
        <el-form :model="userRegister" :rules="rules" ref="ruleForm" @submit.native.prevent="registerUser">
          <el-form-item label="用户名:" prop="name">
            <el-input v-model="userRegister.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号:" prop="phone">
            <el-input v-model.number="userRegister.phone"></el-input>
          </el-form-item>
          <el-form-item label="密码:" prop="pass">
            <el-input type="password" v-model="userRegister.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码:" prop="checkPass">
            <el-input type="password" v-model="userRegister.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="年龄:" prop="age">
            <el-input v-model.number="userRegister.age"></el-input>
          </el-form-item>
          <el-form-item label="性别:" prop="sex">
            <el-radio v-model="radio" label="女" @change="changeRadio">女</el-radio>
            <el-radio v-model="radio" label="男" @change="changeRadio">男</el-radio>
          </el-form-item>
          <el-form-item label="头像:" prop="headPic">
            <el-upload
                class="avatar-uploader"
                :action="$http.defaults.baseURL + '/upload'"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
              <img v-if="userRegister.icon" :src="userRegister.icon" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" native-type="submit">立即注册</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>

export default {
  name: "MyRegister",
  data() {
    // 提示的判断
    const phone = (rule, value, callback) => {
      if (value.toString().length !== 11 || typeof value !== 'number'){
         return callback(new Error("请输入正确手机号"))
      }
    };
    const checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('年龄不能为空'));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'));
        } else {
          if (value < 18) {
            callback(new Error('必须年满18岁'));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.userRegister.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.userRegister.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      radio: '1',
      //存放用户注册信息
      userRegister: {
      },
      rules: {
        pass: [
          {validator: validatePass, trigger: 'blur'}
        ],
        checkPass: [
          {validator: validatePass2, trigger: 'blur'}
        ],
        age: [
          {validator: checkAge, trigger: 'blur'}
        ],
        phone: [
          {validator: phone, trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    //注册提交
    async registerUser(){
      this.$set(this.userRegister,'sup',false)
      const res = await this.$http.post('register', this.userRegister)// eslint-disable-line no-unused-vars
      this.$message({
        type: 'success',
        message: '注册成功',
      })
      //跳转登录页
      await this.$router.push('/')
    },
    //获取单选框值
    changeRadio(val) {
      this.$set(this.userRegister,'sex','')
      this.userRegister.sex = val
    },
    //头像上传
    handleAvatarSuccess(res) {
      this.$set(this.userRegister,'icon',res.url)
      this.userRegister.icon = res.url
    },
    // 上传头像提示
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
  },
}
</script>
<style scoped>

.box-card {
  width: 40%;
  margin: 0 auto;
}

.avatar-uploader .el-upload, i {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}


</style>