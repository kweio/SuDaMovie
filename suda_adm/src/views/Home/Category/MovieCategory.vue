<template>
  <div>
    <div class="addCategory">
      <el-form @submit.native.prevent="addCategory">
        <h1>新建类别</h1>
        <el-form-item label="名称">
          <el-input style="width: 150px" v-model="model.name"></el-input>
          <el-button style="margin-left: 15px" type="primary" native-type="submit">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="categoryList">
      <h1>类别列表</h1>
      <el-table :data="items.slice((currentPage-1)*pageSize,currentPage*pageSize)">
        <el-table-column prop="_id" label="ID" width="300px"></el-table-column>
        <el-table-column prop="name" label="类别名称"></el-table-column>
        <el-table-column
            width="200"
            align="center"
            label="操作">
          <template v-slot="scope">

            <el-button
                size="mini"
                @click="categoryEdit(scope.row)"
            >
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
    <!--    编辑表单-->
    <div>
      <el-dialog title="编辑类别" :visible.sync="dialogFormVisible">
        <el-form>
          <el-form-item label="类别名称" label-width="100px" prop="name">
            <el-input v-model="categoryInfo.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editSave(categoryInfo)">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <!--分页-->
    <el-pagination
        align="center"
        small
        @size-change = "handleSizeChange"
        @current-change = "handleCurrentChange"
        :current-page="currentPage"
        layout="total,sizes,prev,pager,next,jumper"
        :total="items.length"
        :page-size="pageSize"
        :page-sizes="[1,5,10]">
    </el-pagination>
  </div>
</template>

<script>
// import Page from "@/components/Page.vue";
export default {
  name: "MovieCategory",
  // components: {Page},
  props: {
    id:{},
  },
  data() {
    return {
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 5 ,// 每页的数据条数
      model: {},
      items: [],
      categoryInfo: {},
      form: {
        name: '',
      },
      dialogFormVisible: false,
    }


  },

  methods: {
    //保存新增分类
    async addCategory() {
      //http://localhost:3000/admin/api/
      const res = await this.$http.post('category', this.model)// eslint-disable-line no-unused-vars
      //跳转路由
      await this.$router.go(0)
      this.$message({
        type: 'success',
        message: '新增成功',
      })
    },
    //删除类别
    async remove(row) {
      this.$confirm(`此操作将删除分类"${row.name}", 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`/category`, {data: {_id: row._id}}) // eslint-disable-line no-unused-vars
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        await this.$router.go(0)
      })
    },
    //编辑类别
    categoryEdit(row) {
      this.categoryInfo = row
      this.name = row.name
      this.dialogFormVisible = true
    },
    //修改保存
    async editSave() {
      const res = await this.$http.put('/category', this.categoryInfo)// eslint-disable-line no-unused-vars
      await this.$router.go(0)
      this.$message({
        type: 'success',
        message: '修改成功',
      })
    },
    //查找分类
    async fetch() {
      const res = await this.$http.get('/category')
      this.items = res.data
    },
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
    // initData(){
    //   const dataA = {}
    //   for(let k in this.$refs["childData"]){
    //     dataA[k] = this.$refs["childData"][k]
    //   }
    //  return dataA
    // },
  },
  //自动执行
  created() {
    this.fetch()
  },
  mounted() {

  },
}
</script>

<style scoped lang="less">
.personal_top,
.personal_ctn {
  .el-button--primary:focus,
  .el-button--primary:hover {
    background: #009c7f;
  }
}
</style>