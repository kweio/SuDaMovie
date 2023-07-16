<template>
  <div class="tab-bar">
    <!-- 4个大盒子 -->
    <div
        :class="['wrap', $route.path === item.path ? 'highLight' : '']"
        v-for="(item, index) in tabBarData"
        :key="index"
        @click="switchTo(item.path)"
    >
      <div class="inner-top">
        <img :src="$route.path === item.path ? item.active : item.normal" />
      </div>
      <div class="inner-bottom">{{ item.text }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TabBar",
  data() {
    return {
      // 导航栏数据
      tabBarData: [
        {
          normal: require("@/assets/image/tab-bar/shouye.png"),
          active: require("@/assets/image/tab-bar/shouye_1.png"),
          text: "首页",
          path: "/home",
        },
        {
          normal: require("@/assets/image/tab-bar/dianyingpiao.png"),
          active: require("@/assets/image/tab-bar/dianyingpiao_1.png"),
          text: "影票",
          path: "/order",
        },
        {
          normal: require("@/assets/image/tab-bar/wode.png"),
          active: require("@/assets/image/tab-bar/wode_1.png"),
          text: "我的",
          path: "/mine",
        },
      ],
    };
  },
  methods: {
    // 点击路由跳转
    switchTo(path) {
      if (this.$route.path !== path) {
        this.$router.replace(path);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.tab-bar {
  text-align: center;
  z-index: 50;
  position:fixed;
  bottom: 0;
  background-color: #ffffff;
  border-top: 1px solid rgb(220, 220, 220);
  width: 100%;
  display: flex;
  .wrap {
    flex: 1;
    padding: 0.3846rem 0;
  }
}
// 图片样式
img {
  width: 2.6923rem;
  height: 2.6923rem;
}
// 高亮样式
.highLight {
  color: #6F9839;
}
</style>