<template>
  <div class="PlanManage">
<!--    搜索-->
    <div class="top">
      <el-input placeholder="请输入内容" class="input-with-select" style="width: 30%">
        <template v-slot:append>
          <el-button icon="el-icon-search">搜索</el-button>
        </template>
      </el-input>
      <el-button type="primary" size="small" @click="addPlan" style="margin-left: 15px;">
        安排电影
      </el-button>
    </div>
    <!-- 表格 -->
    <div class="plan-table">
      <el-table border :data="planInfo.slice((currentPage-1)*pageSize,currentPage*pageSize)">
        <el-table-column
            label="电影名"
            show-overflow-tooltip
            prop="name"
        ></el-table-column>
        <el-table-column
            label="放映大厅"
            show-overflow-tooltip
            prop="hall"
        ></el-table-column>
        <el-table-column
            label="放映日期"
            show-overflow-tooltip
            prop="outDate"
        ></el-table-column>
        <el-table-column
            label="放映时间"
            show-overflow-tooltip
            prop="inTime"
        ></el-table-column>
        <el-table-column
            label="售价(元)"
            show-overflow-tooltip
            prop="price"
        ></el-table-column>
        <el-table-column align="center" width="150" label="操作">
          <template v-slot="scope">
            <el-button size="mini" @click="planEdit(scope.row)"
            >编辑
            </el-button
            >
            <el-button
                size="mini"
                type="danger"
                @click="planDelete(scope.row)"
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        layout="total,sizes,prev,pager,next,jumper"
        :total="planInfo.length"
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
          top="5vh"
      >
        <el-form
            label-width="80px"
            :model="planData"
            ref="planInfoForm"
        >
          <el-form-item label="电影名" prop="name">
            <el-col :span="16">
              <el-select
                  v-model="planData.name"
                  clearable
                  placeholder="请选择电影名"
                  style="width: 100%"
                  @change="getMovieIdData"
              >
                <el-option
                    v-for="item in movieList"
                    :key="item._id"
                    :value="item.name"
                    :label="item.name"
                ></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="影厅名" prop="hall">
            <el-col :span="16">
              <el-select
                  v-model="planData.hall"
                  clearable
                  placeholder="请选择影厅名"
                  style="width: 100%"
                  @change="getHallList"
              >
                <el-option
                    v-for="item in hallList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                ></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="放映时间" prop="outTime">
            <el-col :span="16">
              <el-time-picker
                  v-model="planData.inTime"
                  placeholder="请选择放映时间"
                  style="width: 100%"
                  format="HH:mm"
                  value-format="HH:mm">
              </el-time-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="散场时间" prop="leaveTime">
            <el-col :span="16">
              <el-time-picker
                  v-model="planData.leaveTime"
                  placeholder="请选择结束时间"
                  style="width: 100%"
                  format="HH:mm"
                  value-format="HH:mm">
              </el-time-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="放映日期" prop="outDate">
            <el-col :span="16">
              <el-date-picker
                  v-model="planData.outDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  style="width: 100%"
                  :picker-options="datePickerOptions"
              >
              </el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="电影售价" prop="sale">
            <el-col :span="16">
              <el-input
                  v-model="planData.price"
                  placeholder="请输入电影售价"
              ></el-input>
            </el-col>
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
  name: "MoviePlan",
  data() {
    return {
      currentPage: 1, // 当前页码
      total: 0, // 总条数
      pageSize: 5,// 每页的数据条数
      // 对话框显示标题
      dialogTitle: "",
      // 对话框显示状态
      dialogFormVisible: false,
      // 表单展示的
      planData: {
      },
      // table展示的
      planInfo: [],
      // 电影列表数据
      movieList: [],
      // 影厅列表数据
      hallList: [],
      // 放映日期设置时间只能往后选，之前的禁用
      datePickerOptions: {
        disabledDate: this.disabledDate,
      },
      // 搜索框内容
      searchContent: "",
    };
  },
  methods: {
    // 获取电影列表
    async movieFetch() {
      const res = await this.$http.get('/movie')
      this.movieList = res.data
    },
    async hallFetch(){
      const res = await this.$http.get('/hall')
      this.hallList = res.data
    },
    // 获取选中的电影数据，从而取出对应电影上映时间数据
    async getMovieIdData(val) {
      const data = this.movieList.filter((item) => item.name == val);
      this.planData.movieId = data[0]._id;
    },
    // 获取选中的影院数据，从而取出影厅数据
    async getHallList(val) {
      if (!val) {
        // 在点击清空的时候，val为空，清空数据
        this.planInfo.hall = "";
        this.hallList = [];
      } else {
        const data = this.hallList.filter((item) => item.name == val);
        this.planData.hallId = data[0]._id;
      }
    },
    // 获取排片列表
    async fetch() {
      const res = await this.$http.get('/plans')
      this.planInfo = res.data
    },
    // 添加排片
    addPlan() {
      // 清空排片列表
      this.planData = {};
      this.dialogTitle = "添加排片";
      this.dialogFormVisible = true;
    },
    // 取消对话框
    cancel() {
      // 清空planInfo数据
      this.planData = {};
      this.dialogFormVisible = false;
    },
    // 编辑排片
    planEdit(row){
      this.dialogTitle = "编辑排片";
      // 这里拿到的row直接赋值是浅拷贝，JSON赋值是深拷贝
      // 如果浅拷贝，Bug：点击编辑出现对话框修改数据，点击取消列表数据会变
      // 但其实并没发请求，刷新后又变回原样
      this.planData = JSON.parse(JSON.stringify(row));
      this.dialogFormVisible = true;
    },
    //排片确认信息
    async editSave(){
      if(this.dialogTitle === "添加排片"){
        const res = await this.$http.post('/plan', this.planData)// eslint-disable-line no-unused-vars
        this.$message({
          type: 'success',
          message: '添加成功',
        })
        console.log(this.planData)
        await this.$router.go(0)
      }else{
        const res = await this.$http.put('/plan', this.planData)// eslint-disable-line no-unused-vars
        await this.$router.go(0)
        this.$message({
          type: 'success',
          message: '修改成功',
        })
      }

    },
    // 撤销电影
    async planDelete(row) {
      this.$confirm(`此操作将撤销上映电影"${row.name}", 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`/plan`, {data: {_id: row._id}}) // eslint-disable-line no-unused-vars
        this.$message({
          type: 'success',
          message: '撤销成功!'
        });
        await this.$router.go(0)
      })
    },
    // 搜索框搜索
    //每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSize = val;
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
    //限制可选日期
    disabledDate(time) {
      let curDate = new Date().getTime();
      const two = 2 * 24 * 60 * 60 * 1000;
      const twoDays = curDate + two;
      return time.getTime() < Date.now() || time.getTime() > twoDays; //小于当前的禁止，大于2天前的禁止
    },
  },
  created() {
    // 获取排片列表
    this.fetch();
    // 获取电影列表
    this.movieFetch();
    this.hallFetch();
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