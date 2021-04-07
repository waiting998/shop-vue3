<template>
    <div class="about">
        <s-header :name="'关于我们'"></s-header>
        <div class="about-body">
            <img class="intro-img" src="https://s.yezgea02.com/1604046067055/WechatIMG30231.jpeg" alt="/">
            <van-divider dashed :style="{color: '#1baeae',borderColor: '#1baeae',fontSize: '20px',fontWeight: 500}">简介</van-divider>
            <div>本项目为熟悉vue3.0 Demo</div>
            <van-divider dashed :style="{color: '#1baeae',borderColor: '#1baeae',fontSize: '20px',fontWeight: 500}">后端数据</van-divider>
            <div>后端数据采用第三方开源API，用以配合前端页面构建</div>
        </div>
    </div>
</template>

<script>
import sHeader from '@/components/SimpleHeader'
export default {
    name:'about',
    components:{
        sHeader
    }
}
</script>

<style lang="less" scoped>
  .about {
    box-sizing: border-box;
    padding: 20px;
    .intro-img {
      width: 100%;
    }
    .about-body {
      font-size: 16px;
      a {
        color: #007fff;
      }
    }
  }
</style>