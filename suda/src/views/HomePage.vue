<template>
  <div class="home">
    <!-- 登录头部部分 -->
    <div class="login-header">
      <i class="eng-title">SuDa Movie</i>
    </div>
    <!-- 轮播图区域 -->
    <div class="swiper-area">
      <ImageSwiper :list="adList"> </ImageSwiper>
    </div>
    <!-- 即将上映 -->
    <ShowingList
        :Image="willMovieData"
        title="即将上映"
        v-if="willMovieData.length"
        payBgc="#faaf00"
        style="margin-top: 1rem"
    >
    </ShowingList>
    <!-- 电影列表 -->
    <ShowingList :Image="nowMovieData"
                 title="正在热映"
                 v-if="nowMovieData.length"
                 pay="购票"
                 payBgc="#faaf00">
    </ShowingList>
    <TabBar></TabBar>
  </div>
</template>

<script>
import ImageSwiper from "@/components/ImageSwiper.vue";
import ShowingList from "@/components/ShowingList.vue";
import TabBar from "@/components/TabBar.vue";
export default {
  name: "HomePage",
  data() {
    return {
      // 轮播图数据
      adList: [],
      // 即将上映电影
      willMovieData: [],
      // 正在放映的电影
      nowMovieData: [],
    };
  },
  components: {
    TabBar,
    ImageSwiper,
    ShowingList,
  },
  methods: {
    // 获取电影列表
    async getMovieList() {
      // 获取首页即将上映数据
      const {
        data: { willMovieData },
      } = await this.$http.get("/willMovie");
      console.log(willMovieData)
      this.willMovieData = willMovieData;
      // 获取首页电影列表数据
      const {
        data:{nowMovieData}
      } = await this.$http.get("/nowMovie");
      this.nowMovieData = nowMovieData.map((obj) =>{
        return obj.movieId
      })
    },
    // 获取电影宣传列表（轮播图数据）
    async getAdList() {
      const {data} = await this.$http.get('/advertise')
      this.adList = data
    },
  },
  created() {
    this.getAdList()
    this.getMovieList()
  },
};
</script>

<style lang="less" scoped>
// 外部样式
.home {
  height: calc(100vh - 4.5rem);
  width: 100vw;
  //height: 100vh ;
  position: relative;
  z-index: 1;
  overflow: scroll;
  //background-color: #009c7f;
}
.login-header {
  padding-top: 1.5385rem;
  font-size: 2.5385rem;
  color: #6F9839;
  text-align: center;
}
// 顶部导航栏样式
.header-search {
  background-color:#FFFFFF;
  left: 0;
  right: 0;
  top: 0;
  z-index: 1000;
  //padding-top: 1rem;
  position: fixed;
  height: 3.8462rem;
  display: flex;
  .search {
    margin: 0 auto;
    height: 100%;
    //background-color: #009c7f;
    display: flex;
    .serach-icon {
      display: flex;
      align-items: center;
      margin-left: 1rem;
    }
    input {
      text-align: center;
      background-color: #fff;
      margin-left: 0.7692rem;
      border-radius: 1.5385rem;
      border: none;
      outline: none;
    }
  }
}
// 轮播图区域样式
.swiper-area {
  margin: 1rem 0.9rem 0 0.55rem ;
  border-radius: 0.7692rem;
  overflow: hidden;
}
</style>
