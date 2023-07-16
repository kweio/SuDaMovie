<template>
  <div class="order-table">
    <el-table
        border
        :data="orderInfo">
      <el-table-column
          label="订单ID"
          align="center"
          prop="userId._id">
      </el-table-column>
      <el-table-column
          label="用户昵称"
          align="center"
          show-overflow-tooltip
          prop="userId.name">
      </el-table-column>
      <el-table-column
          align="center"
          label="手机号"
          prop="userId.phone">
      </el-table-column>
      <el-table-column
          label="影片名"
          align="center"
          show-overflow-tooltip
          prop="movieId.name">
      </el-table-column>
      <el-table-column
          label="取票码"
          align="center"
          show-overflow-tooltip
          prop="ticketCode">
      </el-table-column>
<!--      <el-table-column-->
<!--          label="座位"-->
<!--          align="center"-->
<!--          show-overflow-tooltip-->
<!--          prop="age">-->
<!--      </el-table-column>-->
      <el-table-column
          width="200"
          align="center"
          label="操作">
        <template v-slot="scope">
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
</template>

<script>
export default {
  name: 'OrderList',
  data() {
    return {
      //页面展示
      orderInfo: [],
      dialogFormVisible: false,
    }
  },
  methods: {
    async fetch() {
      const {
        data: { orderList },
      } = await this.$http.get(`/order`);
      this.orderInfo = JSON.parse(JSON.stringify(orderList));
      console.log(this.orderInfo)
    },
    //删除用户
    async remove(row) {
      this.$confirm(`此操作将删除该订单, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`/order`, {data: {_id: row._id}}) // eslint-disable-line no-unused-vars
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        await this.$router.go(0)
      })
    },
    // 取消对话框
    cancel() {
      // 清空planInfo数据
      this.userData = {};
      this.dialogFormVisible = false;
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