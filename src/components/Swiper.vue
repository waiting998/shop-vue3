<template>
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="#1baeae" lazy-render>
        <van-swipe-item v-for="(item,index) in list " :key="index">
            <img :src="item.carouselUrl" alt="banner" @click="goTo(item.redirectUrl)" />
        </van-swipe-item>
    </van-swipe>
</template>

<script>
export default {
    name: 'swiper',
    props:{
        list: Array
    },
    methods:{
        goTo(url){
            window.open(url)
        }
    }
}
</script>

<style lang='less' scoped>
  .my-swipe {
    img {
      width: 100%;
      height: 100%;
    }
  }
</style>