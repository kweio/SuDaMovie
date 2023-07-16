<template>
  <div class="cinema-detail">
    <!-- 顶部topBar部分 -->
    <TopBar
        bgc="#fff"
        @backIconClick="backIconClick"
        :center-content="'场次信息'"
    >
      <!--      :centerContent="cinemaData.name ? cinemaData.name : '影院'"-->
    </TopBar>
    <!-- 轮播图部分 -->
    <div class="swiper-bgc" v-if="movieData">
      <img :src="movieData.icon"/>
      <div class="triangle"></div>
    </div>
    <!-- 电影详情部分 -->
    <div class="movieDetail" v-if="movieData">
      <div class="movieDetail-title">
        <div class="movie-name">{{ movieData.name }}</div>
      </div>
      <div class="movieDetail-content">
        <div class="movieDetail-content-center">
          <span>{{ movieData.director }}</span>
          <span class="sign">|</span>
          <span>{{
              movieData.category.toString()
            }}</span>
          <span class="sign">|</span>
          <span>{{
              movieData.actor.split("/")[0] + ',' + movieData.actor.split("/")[1]
            }}</span>
        </div>
      </div>
    </div>
    <!-- Tab标签页 -->
    <div class="tab" v-if="movieData">
      <van-tabs
          v-model="active"
          title-active-color="#ee0a24"
          line-width="30vw"
          line-height="0.2308rem"
      >
        <van-tab
            :title="tabTitle[index]"
            v-for="(item,index) in getPlanArr"
            :key="index"
        >
          <div class="movie-plan"
               v-for="(item1, index1) in item"
               :key="index1"
          >
            <div class="movie-plan-left">
              <div class="inTime">{{ item1.inTime }}</div>
              <div class="outTime">{{ item1.leaveTime }}散场</div>
            </div>
            <div class="movie-plan-center">
              <div class="type">
                <div class="language">
                  {{ movieData.language }}
                </div>
                <div class="position ellipsis">{{ item1.hall }}</div>
              </div>
              <div class="money">{{ item1.price }}元</div>
            </div>
            <div class="movie-plan-right"  @click.stop="payClick(item1)">
              <div class="pay">购票</div>
            </div>
          </div>
          <div v-if="!movieData.plans.length" class="bgc-show1">
            <div class="bgc-show-center">
              <div class="logo"><i class="iconfont icon-nothing"></i></div>
              <div class="content"><span>暂无上映场次</span></div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import TopBar from "@/components/TopBar.vue";
import MovieSwiper from "@/components/MovieSwiper.vue";

export default {
  name: "planDetail",
  components: {
    TopBar,
    MovieSwiper,
  },
  computed: {
    getPlanArr() {
      let planArr = [];
      let planArr1 = []
      let planArr2 = []
      for (let i = 0; i < this.planData.length; i++) {
        //获取放映日期的值进行比较
        const planTime = new Date(this.planData[i].outDate).getTime();
        //明天的场次放进一个数组
        if (planTime === this.tomorrowTime) {
          planArr1.push(this.planData[i]);
        }
        //后台的场次放进一个数组
        else if(planTime === this.afterTomorrowTime){
          planArr2.push(this.planData[i]);
        }
      }
      planArr.push(planArr1,planArr2)
      // console.log(planArr)
      return planArr
    },
  },
  data() {
    return {
      todayTime:"",  //今天的时间
      tomorrowTime:"", //明天的时间
      afterTomorrowTime:"", //后天的时间

      hallId: "", //影院Id
      movieId: "", //电影Id
      planId: "",  //排片Id
      planData: "", //电影排片数据
      movieData: "", //热映的电影列表
      active: 0, //tab栏默认获取索引值
      // currentActive: 0, //当前轮播图活动索引
      tabTitle: [], // tab栏的标题
    };

  },
  methods: {
    // 顶部返回按钮点击触发
    backIconClick() {
      this.$router.back();
    },
    // 根据影院Id查询影院
    async getMovieDetail() {
      console.log(this.movieId)
      const {
        data: {movieDetailData},
      } = await this.$http.get(`/movieDetail/${this.movieId}`);
      this.movieData = {...movieDetailData};
      this.planData = this.movieData.plans
    },
    // 点击购票触发
    async payClick(moviePlan) {
      // 先判断是否登录
      if (await this.isLogin()) {
        // console.log(moviePlan);
        await this.$router.push({
          path: "/seatSelect",
          query: {
            planId: moviePlan._id,
          },
        });
      }
    },
  },
  //生命周期，模板渲染成HTML或模板编译进路由前调用
  created() {
    this.planId = this.$route.query.planId;
    this.movieId = this.$route.query.movieId;
    const today = this.$options.filters.date(new Date(), "YYYY-MM-DD");
    this.todayTime = new Date(today).getTime();
    this.tomorrowTime = this.todayTime + 1 * 24 * 60 * 60 * 1000;
    this.afterTomorrowTime = this.todayTime + 2 * 24 * 60 * 60 * 1000;
    const tomorrowMM = this.$options.filters.date(new Date(this.tomorrowTime), "MM");
    const tomorrowDD = this.$options.filters.date(new Date(this.tomorrowTime), "DD");
    const afterTomorrowMM = this.$options.filters.date(
        new Date(this.afterTomorrowTime),
        "MM"
    );
    const afterTomorrowDD = this.$options.filters.date(
        new Date(this.afterTomorrowTime),
        "DD"
    );
    this.tabTitle.push(`明天${tomorrowMM}月${tomorrowDD}日`);
    this.tabTitle.push(`后天${afterTomorrowMM}月${afterTomorrowDD}日`);
  },
  //生命周期，已完成模板渲染或el对应HTML渲染后调用
  mounted() {
    // this.movieId = this.$route.query.movieId;
    // console.log(this.movieId)
    this.getMovieDetail();
  },
};
</script>

<style lang="less" scoped>
// 最外层容器
.cinema-detail {
  background-color: #fff;
  height: 100vh;
  width: 100vw;
  padding: 1.5rem 0.7692rem;
}

// 影院信息部分
.cinemaDetail {
  width: 100vw;
  height: 7.6923rem;
  padding: 0.7692rem;
  text-align: justify;
  font-size: 1.0769rem;
  color: rgb(137, 137, 137);

  .title {
    color: #000;
    // height: 30%;
  }

  .address {
    height: 50%;
    width: 100%;
    display: flex;
    align-items: center;
  }

  .phone {
    height: 20%;
  }
}

// 轮播图部分
.swiper-bgc {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 15.3846rem;
  width: 100vw;
  background-color: #fff;

  img {
    padding-top: 2.12rem;
    width: 9.2308rem;
    height: 12.9231rem;
  }

  // 轮播图部分里面的小三角
  .triangle {
    z-index: 10;
    bottom: -0.0769rem;
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
    width: 0rem;
    height: 0rem;
    border-bottom: 0.7692rem solid #fff;
    border-left: 0.7692rem solid transparent;
    border-right: 0.7692rem solid transparent;
  }
}

// 电影描述部分
.movieDetail {
  margin: 0.3846rem 0;
  height: 4.2308rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  .movieDetail-title {
    display: flex;

    div {
      font-size: 1.2308rem;
      margin: 0 0.7692rem;
    }

    .movie-score {
      color: #ffb400;
    }
  }

  .movieDetail-content {
    display: flex;
    align-items: center;
    justify-content: center;
    align-items: center;
    font-size: 1.0769rem;
    color: rgb(145, 145, 145);

    .movieDetail-content-center {
      .sign {
        margin: 0 0.3846rem;
      }
    }
  }
}

// Tab标签页
.tab {
  .movie-plan {
    padding: 1.1538rem 0.7692rem;
    display: flex;
    border-bottom: 1px solid #ccc;
    height: 5.7692rem;

    .movie-plan-left {
      height: 100%;
      width: 25%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: flex-start;

      .inTime {
        font-size: 1.2308rem;
        font-weight: 700;
      }

      .outTime {
        color: rgb(171, 171, 171);
      }
    }

    .movie-plan-center {
      height: 100%;
      width: 55%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: left;

      .type {
        width: 60%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: flex-start;

        .position {
          width: 100%;
          color: rgb(171, 171, 171);
        }
      }

      .money {
        width: 35%;
        color: #ee0a24;
        font-size: 1.1538rem;
      }
    }

    .movie-plan-right {
      width:20%;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .pay {
        border: 0.0769rem solid #ee0a24;
        padding: 0.2308rem 0.7692rem;
        border-radius: 1.5385rem;
        color: #ee0a24;
      }
    }
  }
}

// 在明天或后天栏目里面没有排电影时显示的背景
.bgc-show1 {
  .bgc-show-center {
    margin-top: 1.9231rem;
    font-size: 1.3846rem;

    i {
      font-size: 6.1538rem;
    }

    .content {
      text-align: center;
      margin-top: 1.9231rem;
    }
  }
}

// 占位背景
.bgc-show {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgb(240, 239, 239);

  .bgc-show-center {
    color: rgb(159, 159, 159);

    .logo {
      i {
        font-size: 11.5385rem;
      }
    }

    .content {
      margin-top: 2.3077rem;
      font-size: 1.5385rem;
    }
  }
}
</style>