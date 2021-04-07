<template>
  <div class="product-detail">
    <s-header :name="'商品详情'"></s-header>
    <div class="detail-content">
      <div class="detail-swipe-wrap">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="#1baeae">
          <van-swipe-item v-for="(item , index) in detail.goodsCarouselList" :key="index">
            <img class="waiting" :src="$filters.prefix(item)" alt="" />
          </van-swipe-item>
        </van-swipe>    
      </div>
      <div class="product-info">
        <div class="product-title">
          {{ detail.goodsName || '' }}
        </div>
        <div class="product-desc">免邮费 顺丰快递</div>
        <div class="product-price">
          <span>¥{{ detail.sellingPrice }}</span>
        </div>
      </div>
      <div class="product-intro">
        <ul>
          <li>概述</li>
          <li>参数</li>
          <li>安装服务</li>
          <li>常见问题</li>
        </ul>
        <van-skeleton title :row="3" :loading="loading" >
          <div class="product-content" v-html="detail.goodsDetailContent || ''"></div>
        </van-skeleton>
      </div>
    </div>
    
    <van-action-bar>
      <van-action-bar-icon icon="chat-o" text="客服" />
      <van-action-bar-icon icon="cart-o" text="购物车" :badge="!count ? '': count " @click="goTo()"/>
      <van-action-bar-button type="warning" text="加入购物车" @click="handleAddCart()"/>
      <van-action-bar-button type="danger" text="立即购买" @click="goToCart()"/>
    </van-action-bar>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getDetail } from '@/service/good'
import { prefix } from '@/common/js/untils'
import sHeader from '@/components/SimpleHeader'
import { useStore } from 'vuex'
import { addCart } from '@/service/cart'
import { Toast } from 'vant'
export default {
    name: 'ProductDetail',
    components:{
      sHeader
    },
    setup(){

        const route = useRoute()
        const router = useRouter()
        const store = useStore()

        const state = reactive({
            detail: {
                goodsCarouselList: []
            },
            loading: true
        })

        const goToCart = async () => {
          // 加入购物车 写进数据库
          await addCart({goodsCount: 1, goodsId: state.detail.goodsId})
          store.dispatch('updateCart')//调用action的updateCart方法，updateCart方法获取到购物车数量 再调用 mutations里面的改变state.cartCount的数值,由于添加到购物车是添加到数据库 没有直接改变vuex的值。所以需要调用此方法去让vuex重新从数据库获取数据
          router.push({ path: '/cart' })
        }
        // 跳转购物车
        const goTo = () => {
          router.push({ path: '/cart' })
        }
        // 加入购物车
        const handleAddCart = async () => {
          const { resultCode } = await addCart({goodsCount: 1, goodsId: state.detail.goodsId})
          if(resultCode == 200) Toast.success('添加成功')
          store.dispatch('updateCart')
        }


        const count = computed(()=>{
          // 获取购物车数量
          console.log('car count:',store.state.cartCount)
          return store.state.cartCount
        })

        onMounted( async ()=> {
            const { id } = route.params
            const { data } = await getDetail(id)
            data.goodsCarouselList = data.goodsCarouselList.map( i => prefix(i)) 
            state.detail = data
            state.loading = false
            console.log('goodsCarouselList:',state.detail.goodsCarouselList)
            store.dispatch('updateCart')
        })

        return{
            ...toRefs(state),
            goTo,
            count,
            goToCart,
            handleAddCart
        }
        
    } 

        
    
}
</script>

<style lang="less">
  @import '../common/style/mixin';
  .product-detail {
    .detail-header {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 10000;
      .fj();
      .wh(100%, 44px);
      line-height: 44px;
      padding: 0 10px;
      .boxSizing();
      color: #252525;
      background: #fff;
      border-bottom: 1px solid #dcdcdc;
      .product-name {
        font-size: 14px;
      }
    }
    .detail-content {
      height: calc(100vh - 50px);
      overflow: hidden;
      overflow-y: auto;
      .detail-swipe-wrap {
        .my-swipe .van-swipe-item {
          img {
            width: 100%;
            // height: 300px;
          }
        }
      }
      .product-info {
        padding: 0 10px;
        .product-title {
          font-size: 18px;
          text-align: left;
          color: #333;
        }
        .product-desc {
          font-size: 14px;
          text-align: left;
          color: #999;
          padding: 5px 0;
        }
        .product-price {
          .fj();
          span:nth-child(1) {
            color: #F63515;
            font-size: 22px;
          }
          span:nth-child(2) {
            color: #999;
            font-size: 16px;
          }
        }
      }
      .product-intro {
        width: 100%;
        padding-bottom: 50px;
        ul {
          .fj();
          width: 100%;
          margin: 10px 0;
          li {
            flex: 1;
            padding: 5px 0;
            text-align: center;
            font-size: 15px;
            border-right: 1px solid #999;
            box-sizing: border-box;
            &:last-child {
              border-right: none;
            }
          }
        }
        .product-content {
          padding: 0 20px;
          img {
            width: 100%;
          }
        }
      }
    }
    .van-action-bar-button--warning {
      background: linear-gradient(to right,#6bd8d8, @primary)
    }
    .van-action-bar-button--danger {
      background: linear-gradient(to right, #0dc3c3, #098888)
    }
  }
</style>
