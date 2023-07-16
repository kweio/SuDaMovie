<template>
  <div>
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
// 分页组件
export default {
  name: "Page",
  props: {
  },
  data() {
    return {
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 5 ,// 每页的数据条数
    };
  },
  methods: {
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
  },

};
</script>

<style scoped lang="less">
.coyPag {
  .block {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
}
</style>