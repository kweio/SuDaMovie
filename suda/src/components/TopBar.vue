<template>
  <div>
    <!-- 顶部栏 -->
    <div class="header-search" :style="`background-color: ${bgc};color:${cor}`">
      <!-- 左边坐标区域 -->
      <div class="left" @click="backIconClick">
        <div><van-icon name="arrow-left" /></div>
      </div>
      <!-- 中间切换栏区域 -->
      <div class="center">
        <span class="ellipsis">{{ centerContent }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["bgc", "cor", "centerContent"],
  methods: {
    // 点击顶部放回按钮触发
    backIconClick() {
      this.$emit("backIconClick");
    },
  },
};
</script>

<style lang="less" scoped>
// 顶部导航栏样式
.header-search {
  //margin-top: 1.7rem;
  z-index: 100;
  left: 0;
  right: 0;
  top: 0;
  position: fixed;
  height: 3.8462rem;
  display: flex;
  text-align: center;
  // 左边左边盒子
  .left {
    width: 15%;
    font-size: 2.3077rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  // 中间盒子
  .center {
    width: 70%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5385rem;
  }
  // 右边盒子
  //.right {
  //  width: 15%;
  //  margin-right:0.9rem;
  //  display: flex;
  //  align-items: center;
  //  justify-content: center;
  //}
}
// 占位盒子
.position-box {
  height: 3.8462rem;
}
</style>