<template>
  <van-swipe autoplay="3000" class="swiper">
    <van-swipe-item  v-for="(item,index) in list" :key="index">
      <img :src="item.adImage" alt="">
    </van-swipe-item>
  </van-swipe>
</template>

<script>
import Vue from 'vue';
import { Lazyload } from 'vant';

Vue.use(Lazyload);

export default {
  props:{
    list:Array
  },
  data() {
    return {
      options: {
        loop: true,
        autoplay:3000,
      },
    };
  },
  // props: ["Image"],
  methods:{
    async fetch() {
      const res = await this.$http.get('/advertise')
      this.adList = res.data
    },

  },
  // created() {
  //   this.fetch()
  // },
};
</script>

<style lang="less" scoped>
.swiper .van--swiper-item{
  color: #fff;
  font-size: 20px;
  line-height: 150px;
  text-align: center;
  background-color: #39a9ed;
}
.swiper {
  img {
    width: 100%;
    border-radius: 0.6725rem;
  }
}
</style>
<!--<style>-->
<!--.swiper-pagination-bullet {-->
<!--  width: 2rem;-->
<!--  height: 0.3rem;-->
<!--  background-color: rgba(193, 191, 191, 0.5);-->
<!--  opacity: 1;-->
<!--  border-radius: 0.1538rem;-->
<!--}-->
<!--.swiper-pagination-bullet-active {-->
<!--  background-color: #fff;-->
<!--}-->
<!--</style>-->