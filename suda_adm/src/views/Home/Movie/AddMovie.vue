<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>新增影片信息</span>
      </div>
      <!--        新增影片信息表单-->
      <el-form :model="movieData" @submit.native.prevent="save">
        <el-form-item label="影片名称">
          <el-input v-model="movieData.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="影片类别" >
          <el-select v-model="movieData.category" multiple placeholder="请选择" @focus="categoryFetch">
            <el-option
                v-for="item in options"
                :key="item._id"
                :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="影片语言" >
          <el-select v-model="movieData.language">
            <el-option
                v-for="item in languageOptions"
                :key="item._id"
                :value="item.value"
                :label="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="影片海报:" >
          <el-upload
              class="avatar-uploader"
              :action="$http.defaults.baseURL + '/movie/upload/'"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
            <img v-if="movieData.icon" :src="movieData.icon" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="导演" >
          <el-input v-model="movieData.director" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="主演" >
          <el-input v-model="movieData.actor" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上映日期" prop="inDate">
          <el-col :span="16">
            <el-date-picker
                v-model="movieData.inDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                style="width: 100%">
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="影片介绍" >
          <el-input
              type="textarea"
              autosize
              placeholder="请输入内容"
              v-model="movieData.introduce">
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" native-type="submit">保存</el-button>
        </el-form-item>

      </el-form>
    </el-card>
  </div>
</template>

<script>

export default {
  name: "AddMovie",
  data(){
    return{
      options:[],
      movieData:{},
      // 语言类型
      languageOptions: [
        {
          value: "粤语",
          label: "粤语",
        },
        {
          value: "国语",
          label: "国语",
        },
        {
          value: "英语",
          label: "英语",
        },
        {
          value: "日语",
          label: "日语",
        },
        {
          value: "其它",
          label: "其它",
        },
      ],
    }
  },
  methods:{
    //获取类别列表
    async categoryFetch(){
      const res = await this.$http.get('/category')
      this.options = res.data
    },
    // 保存新增电影信息
    async save() {
      //http://localhost:3000/admin/api/
      const res = await this.$http.post('/movie', this.movieData)// eslint-disable-line no-unused-vars
      this.$message({
        type: 'success',
        message: '添加成功',
      })
      await this.$router.push('/home/MovieList')
    },
    handleAvatarSuccess(res) {
      this.$set(this.movieData,'icon',res.url)
      this.movieData.icon = res.url
    },
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
  }
}
</script>

<style scoped>
.avatar{
  width:170px;
  height: 240px;
}
.avatar-uploader-icon {
  width: 170px;
  height: 240px;
  line-height: 240px;
}
</style>