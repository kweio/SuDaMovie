<template>
  <div class="adPlan">
    <!--搜索-->
    <div class="top">
      <el-input placeholder="请输入内容" class="input-with-select" style="width: 30%">
        <template v-slot:append>
          <el-button icon="el-icon-search">搜索</el-button>
        </template>
      </el-input>
      <el-button type="primary" size="small" @click="addAdvertise" style="margin-left: 15px;">
        添加广告
      </el-button>
    </div>
    <!-- 表格 -->
    <div class="plan-table">
      <el-table border
                :data="adInfo.slice(
                    (currentPage-1)*pageSize,
                    currentPage*pageSize
                )">
        <el-table-column
            label="电影名"
            width="200"
            show-overflow-tooltip
            prop="name"
            align="center"
        ></el-table-column>
        <el-table-column label="宣传海报" width="300" align="center">
          <template v-slot="scope">
            <img :src="scope.row.adImage" style="height: 5rem; width: 100%"/>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template v-slot="scope">
            <el-button size="mini" @click="adEdit(scope.row)"
            >编辑
            </el-button
            >
            <el-button
                size="mini"
                type="danger"
                @click="adDelete(scope.row)"
            >撤销
            </el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页器 -->

    <el-pagination
        align="center"
        small
        @size-change = "handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        layout="total,sizes,prev,pager,next,jumper"
        :total="adInfo.length"
        :page-size="pageSize"
        :page-sizes="[1,5,10]">
    </el-pagination>
    <!-- 添加或编辑排片对话框 -->
    <div>
      <el-dialog
          :title="dialogTitle"
          :visible.sync="dialogFormVisible"
          :modal-append-to-body="false"
          v-if="dialogFormVisible"
          :showClose="false"
          :close-on-click-modal="false"
          top="10vh"
      >
        <el-form
            label-width="150px"
            :model="adData"
            ref="planInfoForm"
        >
          <el-form-item label="电影名" prop="movieId">
            <el-select v-model="adData.movieId" @change="UpdateMovieName">
              <el-option
                  v-for="item in movieList"
                  :key="item._id"
                  :value="item._id"
                  :label="item.name">
              </el-option>
            </el-select>

          </el-form-item>
          <el-form-item label="宣传海报" prop="adImage">
            <el-upload
                class="avatar-uploader"
                :action="$http.defaults.baseURL + '/upload/'"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
              <img v-if="adData.adImage" :src="adData.adImage" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>

          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="editSave">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 每页显示的条数
      pageSize: 5,
      // 当前页数
      currentPage: 1,
      // 总页数
      total: 20,
      // 对话框显示标题
      dialogTitle: "",
      // 对话框显示状态
      dialogFormVisible: false,
      adData: {
        name: "",
        movieId: "",
        adImage: "",
      },
      // 宣传列表数据
      adInfo: [],
      // 电影列表数据
      movieList: [],
      // 搜索框内容
      searchContent: "",
    };
  },
  methods: {
    //获取宣传
    async fetch() {
      const res = await this.$http.get('/advertise')
      this.adInfo = res.data
    },
    // 选中电影名后(得到是电影id),将电影名赋值给name
    UpdateMovieName(val) {
      this.adData.name = "";
      // console.log(val);
      this.movieList.some((item) => {
        if (item._id == val) {
          this.adData.name = item.name;
          return item._id == val;
        }
      });
    },
    // 获取电影列表
    async movieFetch() {
      const res = await this.$http.get('/movie')
      this.movieList = res.data
    },
    // 弹出添加宣传
    addAdvertise() {
      // 清空排片列表
      this.adData = {};
      this.dialogTitle = "添加广告";
      this.dialogFormVisible = true;
    },
    //确认对话框
    // 取消对话框
    cancel() {
      // 清空planInfo数据
      this.adData = {};
      this.dialogFormVisible = false;
    },
    // 编辑宣传
    adEdit(row) {
      this.dialogTitle = "编辑广告";
      this.adData = JSON.parse(JSON.stringify(row));
      this.adData.movieId = this.adData.movieId._id;
      this.dialogFormVisible = true;
    },
    // 删除宣传
    async adDelete(row) {
      this.$confirm(`此操作将删除宣传信息"${row.name}", 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`/advertise`, {data: {_id: row._id}}) // eslint-disable-line no-unused-vars
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        await this.$router.go(0)
      })
    },

    async editSave() {
      // 新增宣传信息
      if (this.dialogTitle === "添加广告") {
        const res = await this.$http.post('/advertise', this.adData)// eslint-disable-line no-unused-vars
        this.$message({
          type: 'success',
          message: '添加成功',
        })
        await this.$router.go(0)
        this.dialogFormVisible = false
      } else {
        const res = await this.$http.put('/advertise', this.adData)// eslint-disable-line no-unused-vars
        this.$message({
          type: 'success',
          message: '修改成功',
        })
        await this.$router.go(0)
        this.dialogFormVisible = false
      }
    },
    // 分页器当前页面变动时触发
    handleCurrentChange(val) {
      this.currentPage = val;
      // this.fetch();
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      // this.fetch();
    },
    handleAvatarSuccess(res) {
      this.$set(this.adData, 'adImage', res.url)
      this.adData.adImage = res.url
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

  },
  created() {
    this.fetch()
    this.movieFetch()
  },
};
</script>

<style lang="less" scoped>
.top {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px 0;
  margin-bottom: 30px;
}

.adPlan {
  width: 90%;
  min-width: 900px;
  margin: 0 auto 30px;
}

// 海报图片样式
.avatar-uploader-icon {
  width: 276px;
  height: 92px;
  line-height: 92px;
}

.avatar {
  width: 276px;
  height: 92px;
}
</style>