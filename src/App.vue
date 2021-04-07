<template>
  <!-- v-slot='{ Component }'  动态命名插槽 ？ 这个好像是固定写法-->
  <router-view class="router-view" v-slot='{ Component }'>
    <!-- 路由过渡切换效果 -->
    <transition :name='transitionName'>
      <!-- <component :is='Component'>   动态路由组-->
      <component :is='Component' />
    </transition>
  </router-view>
</template>
<script>
import { reactive , toRefs} from 'vue'
import { useRouter } from 'vue-router'
export default {
  name: "App",
  setup(){
    const router = useRouter()
    const state = reactive({//相当于 data(){}
      transitionName : 'slide-left'
    })

    // 利用 router 钩子 判断路由切换的级别，选择过渡效果  router.beforeEach点击导航前，即router切换之前  router.afterEach则是完成切换后  
    router.beforeEach((to,from) => {
      if(to.meta.index > from.meta.index){  //由主级到次级， 第一级的index是1 子级小 index大
        state.transitionName = 'slide-left'//左滑动
      }else if(to.meta.index < from.meta.index){
        state.transitionName = 'slide-right'
      }else{
        state.transitionName = '' 
      }

    })

    return{
      ...toRefs(state) //toRefs函数将reactive响应式对象解构为普通对象
    }
  }

}

</script>
<style>
html, body {
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
}
#app {
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.router-view{
    width: 100%;
    height: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: 0 auto;
    -webkit-overflow-scrolling: touch;
}

.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active{
    height: 100%;
    will-change: transform;
    transition: all 500ms;
    position: absolute;
    backface-visibility: hidden;
}
.slide-right-enter{
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active{
    opacity: 0;
    transform: translate3d(100%, 0, 0);
}
.slide-left-enter{
    opacity: 0;
    transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active{
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
}

.van-badge--fixed {
  z-index: 1000;
}
</style>
