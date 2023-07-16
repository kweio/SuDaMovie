<template>
  <div id="movie-manage">
    <div class="movie-table">
      <el-table
          border
          :data="movieInfo.slice((currentPage-1)*pageSize,currentPage*pageSize)">
      <el-table-column
            label="影片 ID"
            align="center"
            width="100"
            prop="_id">
        </el-table-column>
        <el-table-column
            label="影片海报"
            align="center"
            prop="icon">
          <template v-slot="scope">
            <img :src="scope.row.icon" style="width: 80%;height:80%">
          </template>
        </el-table-column>
        <el-table-column
            label="影片名称"
            show-overflow-tooltip
            prop="name">
        </el-table-column>
        <el-table-column
            label="影片类别"
            show-overflow-tooltip
            prop="category"
            :formatter="categoryArr">
        </el-table-column>
        <el-table-column
            label="影片语言"
            show-overflow-tooltip
            prop="language">
        </el-table-column>
        <el-table-column
            label="导演"
            prop="director">
        </el-table-column>
        <el-table-column
            label="主演"
            prop="actor">
        </el-table-column>
        <el-table-column
            label="上映日期"
            prop="inDate">
        </el-table-column>
        <el-table-column
            width="200"
            align="center"
            label="操作">
          <template v-slot="scope">
            <el-button
                size="mini"
                @click="movieEdit(scope.row)">
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

    <!--dialog-->
    <div>
      <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" v-if="dialogFormVisible"
                 :showClose="false" width="50%">
        <el-form  v-model="movieData" @submit.native.prevent="editSave(movieData)">
          <el-form-item label="影片名称">
            <el-input v-model="movieData.name" autocomplete="off"></el-input>
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
          <el-form-item label="影片类别">
            <el-select v-model="movieData.category" multiple placeholder="请选择" @focus="categoryFetch">
              <el-option
                  v-for="item in options"
                  :key="item._id"
                  :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="影片海报:">
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
          <el-form-item label="导演">
            <el-input v-model="movieData.director" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="主演">
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
          <el-form-item label="影片介绍">
            <el-input
                type="textarea"
                autosize
                placeholder="请输入内容"
                v-model="movieData.introduce">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" native-type="submit">保存</el-button>
            <el-button @click="dialogFormVisible = false">取 消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <el-pagination
        align="center"
        small
        @size-change = "handleSizeChange"
        @current-change = "handleCurrentChange"
        :current-page="currentPage"
        layout="total,sizes,prev,pager,next,jumper"
        :total="movieInfo.length"
        :page-size="pageSize"
        :page-sizes="[1,5,10]">
    </el-pagination>
  </div>

</template>

<script>
export default {
  name: 'MovieList',
  data() {
    return {
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 5 ,// 每页的数据条数
      // imageURL: '',
      options: [],
      movieInfo: [],
      movieData: {},
      dialogTitle: '编辑影片',
      dialogFormVisible: false,
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
  methods: {
    // 展示电影信息
    async fetch() {
      const res = await this.$http.get('/movie')
      this.movieInfo = res.data
    },
    //获取类别列表
    async categoryFetch() {
      const res = await this.$http.get('/category')
      this.options = res.data
    },
    //修改影片信息
    async editSave() {
      const res = await this.$http.put('/movie', this.movieData)// eslint-disable-line no-unused-vars
      await this.$router.go(0)
      this.$message({
        type: 'success',
        message: '修改成功',
      })
    },
    //编辑按钮事件
    movieEdit(row) {
      this.movieData = row
      // this.name = row.name
      this.dialogFormVisible = true
    },
    //删除电信信息
    async remove(row) {
      this.$confirm(`此操作将删除电影信息"${row.name}", 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`/movie`, {data: {_id: row._id}}) // eslint-disable-line no-unused-vars
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        await this.$router.go(0)
      })
    },
    //影片类别显示规范化
    categoryArr(row) {
      let newArr = []
      newArr = row.category.join(",");
      return newArr;
    },
    handleAvatarSuccess(res) {
      this.$set(this.movieData, 'icon', res.url)
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
    //每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
  },
  // 自动执行
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

.movie-table {
  width: 90%;
  min-width: 900px;
  margin: 0 auto 30px;
}

.avatar-uploader .el-upload {
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
  width: 140px;
  height: 200px;
  line-height: 200px;
  text-align: center;
}

.avatar {
  width: 150px;
  height: 200px;
  display: block;
}

</style>