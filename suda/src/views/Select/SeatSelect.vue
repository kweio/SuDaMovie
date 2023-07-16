<template>
  <div class="wrap">
    <!-- 顶部topBar部分 -->
    <TopBar
        bgc="#fff"
        v-if="planData"
        @backIconClick="backIconClick"
        :centerContent="planData.hall"
    ></TopBar>

    <!-- 电影选座区域 -->
    <div class="seat-select" v-if="planData">
      <div class="screen">
        <div class="screen-shape">
          <img src="@/assets/image/screen.png"/>
        </div>
      </div>
      <div class="seat">
        <div class="left">
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
          <div>5</div>
          <div>6</div>
        </div>
        <div class="right" v-if="hackReset">
          <div class="row" v-for="(itemI, indexI) in seatIJ" :key="indexI">
            <div class="column" v-for="(itemJ, indexJ) in itemI" :key="indexJ">
              <span
                  class="iconfont icon-zuowei1-copy-copy-copy "
                  :class="{
                  selected: itemJ === 1,
                  forbidSelected: itemJ === 2,
                }"
                  @click.stop.prevent="seatSelected(indexI, indexJ)"
              ></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 确认选座部分 -->
    <div class="confirm-seat" v-if="planData">
      <!-- 选座提示部分 -->
      <div class="select-tip">
        <div class="select-tip-item">
          <span class="confirm-btn-active"></span>
          <div>可选</div>
        </div>
        <div class="select-tip-item">
          <span class="forbidSelected"></span>
          <div>不可选</div>
        </div>
        <div class="select-tip-item">
          <span class="selected"></span>
          <div>已选</div>
        </div>
      </div>
      <!-- 确认信息部分 -->
      <div class="confirm-content">
        <!-- 电影信息部分 -->
        <div class="movie-info">
          <div class="movie-title">
            <span>{{ planData.name }}</span>
          </div>
          <div class="movie-content">
            <span>{{ planData.inDate }}</span>
            <span>{{
                planData.outDateMM + "月" + planData.outDateDD + "日"
              }}</span>
            <span>{{ planData.inTime + "-" + planData.leaveTime }}</span><br>
            <span>
              {{ movieData.language }}&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;
              {{ movieData.category }}</span>
          </div>
        </div>
        <!-- 选座信息部分 -->
        <div class="seat-info-list">
          <div
              class="seat-info-item"
              v-for="(item, index) in model.seatInfo"
              :key="index"
          >
            <div class="seat-info-left">
              <div class="seat-info-title">
                {{ item[0] + 1 }}排{{ item[1] + 1 }}座
              </div>
              <div class="seat-info-price">￥{{ planData.price }}</div>
            </div>
            <div
                class="seat-info-right"
                @click.prevent.stop="seatSelected(item[0], item[1])"
            >
              <van-icon name="cross"/>
            </div>
          </div>
        </div>
      </div>
      <!-- 确认选座按钮 -->
      <div
          class="confirm-btn"
          @click.stop.prevent="confirmBtnClick"
      >
        <!--        @click.stop.prevent="confirmBtnClick"-->
        <span>确认选座</span>
      </div>
    </div>
  </div>
</template>

<script>
import TopBar from "@/components/TopBar.vue";

export default {
  data() {
    return {
      planId: "", //排片id
      hallId:"",
      movieData: "",
      //用于添加订单的数据，就是确认选座
      model: {
        hallName: "", //影厅名
        userId: "", //用户id
        seatInfo: [], //选中座位坐标存储
        ticketNum: 0, //购票数量
        totalPrice: 0, //购票总价格
        orderDate: "", //场次日期
        orderTime: "", //场次时间
        movieId: "",
        hallId: "",
      },
      planData: {}, //排片数据
      seatIJ: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
      ], //座位数据
      hackReset: true, //座位dom显示状态
    };
  },
  components: {
    TopBar,
  },
  methods: {
    // 顶部返回按钮点击触发
    backIconClick() {
      this.$router.back();
    },
    // 获取排片数据
    async getPlanData() {
      const {
        data: {planData},
      } = await this.$http.get(`/plan/${this.planId}`);
      this.planData = JSON.parse(JSON.stringify(planData));
      this.movieData = planData.movieId
      this.movieData.category = this.movieData.category.toString()
      //将已经被定的座位设置为不可选
      this.planData.seatInfo.map((item) => {
        this.seatIJ[item[0]][item[1]] = 2;
      });
      // console.log("排片数据", this.planData);
    },
    // 选中座位时触发
    seatSelected(i, j) {
      // 先判断座位是否为不可选中状态
      console.log(i,j)
      if (this.seatIJ[i][j] === 2) {
        return this.$dialog.alert({
          title: "提示",
          message: "该座位已被预订，请选择其他座位",
          theme: "round-button",
        });
      }
      // 判断座位选中个数是否超额(限额6个)
      if (this.seatIJ[i][j] === 0 && this.model.ticketNum === 6) {
        return this.$dialog.alert({
          title: "提示",
          message: "最多只能预定6个座位~",
          theme: "round-button",
        });
      }
      if (this.seatIJ[i][j] === 0) {
        this.seatIJ[i][j] = 1;
        this.model.seatInfo.push([i, j]);
        this.model.ticketNum += 1;
      } else if (this.seatIJ[i][j] === 1) {
        this.seatIJ[i][j] = 0;
        const index = this.model.seatInfo.findIndex((item) => {
          return item[0] === i && item[1] === j;
        });
        this.model.seatInfo.splice(index, 1);
        this.model.ticketNum -= 1;
      }
      this.hackReset = false;
      this.$nextTick(() => {
        this.hackReset = true;
      });
    },
    // 点击确认选座按钮触发
    async confirmBtnClick() {
      if (!this.model.seatInfo.length) {
        return this.$dialog.alert({
          title: "提示",
          message: "请先选座~",
          theme: "round-button",
        });
      }
      this.model.hallName = this.planData.hall;
      this.model.planId = this.planId;
      this.model.movieId = this.movieData._id;
      this.model.hallId = this.planData.hallId._id;
      this.model.totalPrice = (
          this.planData.price * this.model.ticketNum
      ).toFixed(2);
      this.model.ticketPrice = this.planData.price;
      this.model.orderDate = this.planData.outDate;
      this.model.orderTime = this.planData.inTime;
      // 发送请求添加订单
      const { data } = await this.$http.post(`/addOrder`, this.model);
      if (data.status === "200") {
        this.$toast({
          type: "success",
          message: "锁定座位成功",
        });
        await this.$router.push({
          path: "/orderSubmit",
          query: {
            orderId: data.data._id,
          },
        });
      }
    },
  },
  created() {
    this.planId = this.$route.query.planId;
    this.model.userId = window.localStorage.getItem("userId");
    this.getPlanData();
  },
}
</script>

<style lang="less" scoped>

// 外部盒子部分
.wrap {
  width: 100vw;
  height: 100vh;
  background-color: #f1f1f1;
}
// 电影选座区域
.seat-select {
  margin-top: 0.5385rem;
  padding: 0.7692rem;
  .screen {
    position: relative;
    // 屏幕图片部分
    .screen-shape {
      img {
        width: 100%;
      }
    }
    .screen-name {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      font-size: 1.0769rem;
      color: #a7a9ae;
    }
  }
  .seat {
    display: flex;
    justify-content: space-between;
    margin-top: 15%;
    .left {
      text-align: center;
      padding: 0.7692rem 0;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      background-color: #b6b6b6;
      border-radius: 20px;
      width: 5%;
      div {
        color: #fff;
        padding: 1.1538rem 0;
      }
    }
    .right {
      padding: 0.7692rem 0;
      width: 90%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .row {
        display: flex;
        justify-content: space-around;
        align-items: center;
        .column {
          span {
            width: 2rem;
            height: 2rem;
            display: inline-block;
            font-size: 1.8462rem;
            background-color: #fff;
          }
        }
      }
    }
  }
}
// 确认选座部分
.confirm-seat {
  position: absolute;
  //margin-top: 5rem;
  left: 0;
  right: 0;
  bottom: 0;
  //padding: 0.7692rem;
  // 选座提示部分
  .select-tip {
    //margin-bottom: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    //height: 2.3077rem;
    .select-tip-item {
      color: #a7a9ae;
      display: flex;
      align-items: center;
      margin: 0 0.7692rem;
      span {
        display: inline-block;
        width: 1rem;
        height: 1rem;
        color: #fff;
        font-size: 1.3846rem;
        margin-right: 0.3846rem;
      }
    }
  }
  // 确认信息部分
  .confirm-content {
    width: 85vw;
    text-align: center;
    background-color: #fff;
    margin: 0.7692rem auto;
    border-radius: 10px;
    padding: 0.8rem;
    // 电影信息部分
    .movie-info {
      //margin: 1.7692rem 0;
      .movie-title {
        font-size: 1.2308rem;
        margin-bottom: 0.7692rem;
      }
      .movie-content {
        color: #a7a9ae;
        span {
          margin-right: 0.7692rem;
        }
      }
    }
    // 选座信息部分
    .seat-info-list {
      width: 100%;
      display: flex;
      overflow: scroll;
      .seat-info-item {
        flex-shrink: 0;
        width: 30%;
        margin-right: 5%;
        padding: 0.7692rem;
        border-radius: 0.3846rem;
        background-color: rgb(233, 233, 233);
        color: rgb(162, 162, 162);
        display: flex;
        align-items: center;
        justify-content: space-between;
        .seat-info-left {
          width: 100%;
          .seat-info-title {
            margin-bottom: 0.3846rem;
          }
        }
      }
    }
  }
  // 确认选座按钮
  .confirm-btn {
    text-align: center;
    //width: 85vw;
    margin: 0.5rem 1rem;
    color: #ffffff;
    background-color: #6F9839;
    padding: 0.7692rem;
    border-radius: 1.5385rem;
  }
}
// 已选座位样式
.selected {
  background-color: #6dbd00 !important;
}
// 不可选座位样式
.forbidSelected {
  background-color: #dd2724 !important;
}
// 确认选座按钮可选中样式
.confirm-btn-active {
  background-color: #fff !important;
}
</style>