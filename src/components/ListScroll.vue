<template>
  <div ref="wrapper" class="scroll-wrapper">
    <slot></slot><!--插槽 等于前面调用组件<组件名>xxxx</组件名> 时传递的值 xxxx  -->
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
    name: 'listScroll',
    props:{
        scrollData:{
            type: Array,
            default: null
        }
    },

    mounted() {
        // 在 DOM 渲染完毕后初始化 better-scroll
        this.$nextTick(() => {
            this.initScroll()
        })
    },
    methods: {
    initScroll() {
        // better-scroll 初始化
        this.bs = new BScroll(this.$refs.wrapper, {
            probeType: 3,
            click: true
        })
        console.log(this.bs);
    } 
  }
}
</script>

<style lang="less" scoped>
  .scroll-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    overflow-y: scroll;
  }
</style>