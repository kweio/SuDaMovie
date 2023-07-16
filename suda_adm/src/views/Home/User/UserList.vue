<template>
  <div id="user-manage">
    <div class="user-table">
      <el-table
          border
          :data="userInfo">
        <el-table-column
            label="用户 ID"
            align="center"
            prop="_id">
        </el-table-column>
        <el-table-column
            label="昵称"
            align="center"
            show-overflow-tooltip
            prop="name">
        </el-table-column>
        <el-table-column
            label="用户头像"
            align="center"
            show-overflow-tooltip
            prop="icon">
          <template v-slot="scope">
            <img :src="scope.row.icon" style="width: 80%;height:80%">
          </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="手机号"
            prop="phone">
        </el-table-column>
        <el-table-column
            label="性别"
            align="center"
            show-overflow-tooltip
            prop="sex">
        </el-table-column>
        <el-table-column
            label="年龄"
            align="center"
            show-overflow-tooltip
            prop="age">
        </el-table-column>
        <el-table-column
            label="用户权限"
            align="center"
            show-overflow-tooltip
            prop="sup">
          <template v-slot="scope">
            <span v-if="scope.row.sup===false"> 普通用户 </span>
            <span v-else-if="scope.row.sup===true"> 管理员 </span>
          </template>
        </el-table-column>
        <el-table-column
            width="200"
            align="center"
            label="操作">
          <template v-slot="scope">
            <el-button
                size="mini"
                @click="userEdit(scope.row)">
              编辑
            </el-button>
            <el-button
                size="mini"
                type="danger"
                @click="remove(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
<!--    修改-->
    <div>
      <el-dialog title="编辑用户信息" :visible.sync="dialogFormVisible">
        <el-form >
          <el-form-item label="用户名:" prop="name">
            <el-input v-model="userData.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号:" prop="phone">
            <el-input v-model.number="userData.phone"></el-input>
          </el-form-item>
          <el-form-item label="密码:" prop="pass">
            <el-input type="password" v-model="userData.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="年龄:" prop="age">
            <el-input v-model="userData.age"></el-input>
          </el-form-item>
          <el-form-item label="性别:" prop="sex">
            <el-radio v-model="userData.sex" label="女" @change="changeRadio">女</el-radio>
            <el-radio v-model="userData.sex" label="男" @change="changeRadio">男</el-radio>
          </el-form-item>
          <el-form-item label="头像:" prop="headPic">
            <el-upload
                class="avatar-uploader"
                :action="$http.defaults.baseURL + '/user/upload/'"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
              <img v-if="userData.icon" :src="userData.icon" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="用户权限:" prop="sup" >
              <el-switch
                  style="display: block;"
                  v-model="userData.sup"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="管理员"
                  inactive-text="普通用户"
                  :active-value=true
                  :inactive-value=false
                  >
              </el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="editSave">修改</el-button>
            <el-button type="danger" @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserList',
  data() {
    return {
      //编辑修改
      userData: {},
      //页面展示
      userInfo: [],
      dialogFormVisible: false,
    }
  },
  methods: {
    async fetch() {
      const res = await this.$http.get('/user')
      this.userInfo = res.data
    },
    //删除用户
    async remove(row) {
      if (row.name ==="admin"){
        this.$confirm(`此操作无法删除初始管理员用户"${row.name}"`, '提示', {
          cancelButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        })
      }else{
        this.$confirm(`此操作将删除用户"${row.name}", 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const res = await this.$http.delete(`/user`, {data: {_id: row._id}}) // eslint-disable-line no-unused-vars
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          await this.$router.go(0)
        })
      }
    },
    //保存，更新
    async editSave(){
      const res = await this.$http.put('/user',this.userData)// eslint-disable-line no-unused-vars
      await this.$router.go(0)
      this.$message({
        type:'success',
        message:'修改成功',
      })
    },
    userEdit(row) {
      this.userData = row
      this.name = row.name
      this.dialogFormVisible = true
    },
    //头像上传
    handleAvatarSuccess(res) {
      this.$set(this.userData,'icon',res.url)
      this.userData.icon = res.url
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
    // 取消对话框
    cancel() {
      // 清空planInfo数据
      this.userData = {};
      this.dialogFormVisible = false;
    },
    changeRadio(val) {
      this.userData.sex = val
    },
  },
  //自动执行
  created() {
    this.fetch()
  },
}
</script>

<style scoped>
.top {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 0;
  margin-bottom: 30px;
}

.user-table {
  width: 90%;
  min-width: 900px;
  margin: 0 auto 30px;
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