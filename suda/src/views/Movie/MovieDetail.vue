<template>
  <div class="movieDetail">
    <!-- 顶部topBar部分 -->
    <TopBar
        bgc="rgb(76, 106, 114)"
        centerContent="电影"
        cor="#FFF"
        @backIconClick="backIconClick"
    >
    </TopBar>
    <!-- 中间主体内容部分 -->
    <div class="main" v-if="movieData">
      <!-- 电影展示部分 -->
      <div class="movie-show">
        <!-- 电影图片部分 -->
        <div class="movie-image">
          <img :src="movieData.icon"/>
        </div>
        <!-- 电影信息部分 -->
        <div class="movie-info">
          <!-- 电影名字 -->
          <div class="movie-name">
            <p>{{ movieData.name }}</p>
          </div>
          <!-- 电影详情 -->
          <div class="movie-detail">

            <span>主演:{{ movieData.actor }}</span>
            <p>
              <span v-if="movieData.category" class="ellipsis">
                {{ movieData.category.toString() }}
              </span>
              <span class="ellipsis">{{ movieData.language }}</span>
            </p>
            <p>{{ movieData.inDate}}上映</p>
          </div>
        </div>
      </div>
      <!-- 电影简介 -->
      <div class="movie-desc">
        <h3>简介</h3>
        <p>{{ movieData.introduce }}</p>
      </div>
    </div>
    <!-- 底部特惠购票部分 -->
    <div class="footer" >
      <span v-if="movieData.plans.length" @click.stop="toSelectCinema()">特惠购票</span>
    </div>
  </div>
</template>

<script>
import TopBar from "@/components/TopBar.vue";

export default {
  name: "MovieDetail",
  components: {
    TopBar,
  },
  props: ["id"],
  data() {
    return {
      planId:"",
      movieData: {},
      //电影详情数据
      planData: {},
    };
  },
  methods: {
    // 顶部返回按钮点击触发
    backIconClick() {
      this.$router.back();
    },
    // 获取电影详情数据
    async getMovieDetail() {
      const {
        data: { movieDetailData },
      } = await this.$http.get(`/movieDetail/${this.id}`);
      this.movieData = { ...movieDetailData };
    },
    // 点击特惠购票触发
    async toSelectCinema() {
      await this.$router.push({
        path: `/planDetail`,
        query: {
          movieId: this.id,
        },
      });
    },
  },
  created() {
    this.getMovieDetail();
  },
};
</script>

<style lang="less" scoped>
// 外部盒子样式
.movieDetail {
  width: 100vw;
  height: 100vh;
  background-color: rgb(76, 106, 114);
}

// 内容主体部分
.main {
  margin: 3.5385rem 0;
  padding: 1rem;
  // 电影展示部分
  .movie-show {
    margin-bottom: 0.7692rem;
    text-align: left;
    display: flex;
    // 电影图片部分
    .movie-image {
      width: 50%;
      img {
        border-radius: 0.7692rem;
        width: 100%;
      }
    }

    // 电影信息部分
    .movie-info {
      color: #9bacb3;
      width: 70%;
      padding: 0 0.7692rem;
      // 电影标题部分
      .movie-name {
        margin-bottom: 0.3692rem;
        //height: 40%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        p:nth-child(1) {
          //overflow: hidden;
          //text-overflow:ellipsis;
          //white-space: nowrap;
          color: #ffffff;
          font-size: 1.8rem;
        }
      }

      // 电影详情部分
      .movie-detail {
        height: 40%;
        p:nth-child(2){
          margin-top: 0.55rem;
          span:nth-child(2){
            float: right;
            margin-right: 2.26rem;
            color: rgb(240, 239, 239);
            //font-size: 1rem;
            //background-color: #354e55;
            //border-radius: 0.3846rem;
          }
        }
        p:nth-child(3){
          height: 30%;
          margin-top: 0.55rem;
          float: bottom;
          color: #ffffff;
        }
        //span:nth-child(1) {
        //  margin-right: 0.7692rem;
        //}


        //p {
        //  margin-top: 0.3846rem;
        //}
      }

      // 兴趣部分
      .interesting {
        height: 25%;
        display: flex;
        justify-content: space-between;
        padding-top: 0.6154rem;

        div {
          height: 100%;
          width: 45%;
          background-color: #6d858b;
          border-radius: 0.7692rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;

          span:nth-child(2) {
            margin-left: 0.3846rem;
          }
        }
      }
    }
  }

  // 电影简介部分
  .movie-desc {
    color: #ffffff;
    text-align: justify;
    padding: 1.1538rem;
    background-color: #314c53;
    border-radius: 0.7692rem;

    h3 {
      margin-bottom: 1.1538rem;
    }

    p {
      line-height: 1.3077rem;
    }
  }

}

// 底部TabBar
.footer {
  border-radius: 0.7692rem 0.7692rem 0 0;
  position: fixed;
  bottom: 0;
  //background-color: #ffffff;
  height: 4.5rem;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  span {
    width: 95%;
    color: #ffffff;
    font-size: 1.5385rem;
    padding: 0.7692rem 0;
    border-radius: 1.5385rem;
    background-color: #009c7f;
  }
}

</style>