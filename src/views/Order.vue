<template>
    <div class="order-box">
        <s-header :name="'我的订单'" :back="'/user'"></s-header>
        <van-tabs @click="onChangeTab" :color="'#1baeae'" :title-active-color="'#1baeae'" class="order-tab"  swipeable>
            <van-tab title="全部" name=""></van-tab>
            <van-tab title="待付款" name="0"></van-tab>
            <van-tab title="待确认" name="1"></van-tab>
            <van-tab title="待收货" name="2"></van-tab>
            <van-tab title="已发货" name="3"></van-tab>
            <van-tab title="交易完成" name="4"></van-tab>
        </van-tabs>
        <div class="content">
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh" class="order-list-refresh">
                <van-list
                    v-model:loading="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="onLoad"
                    @offset="10"
                >
                    <div class="order-item-box" v-for="(item,index) in list" :key="index" @click="goTo(item.orderNo)">
                        <div class="order-item-header">
                            <span>订单时间： {{ item.createTime }}</span>
                            <span>{{ item.orderStatusString }}</span>
                        </div>
                        <van-card 
                            v-for="one in item.newBeeMallOrderItemVOS"
                            :key="one.orderId"
                            :num="one.goodsCount"
                            desc="全场包邮"
                            :title="one.goodsName"
                            :thumb="$filters.prefix(one.goodsCoverImg)"
                        />
                    </div>
                </van-list>
            </van-pull-refresh>
        </div>

    </div>
</template>

<script>
import { reactive, toRefs, ref, watch } from 'vue'
import { getOrderList } from '@/service/order'
import { useRouter } from 'vue-router'  
import sHeader from '@/components/SimpleHeader'
export default {
    name: 'Order',
    components: {
        sHeader,
    },
    setup() {
        const router = useRouter()
        const state = reactive({
            list:[],
            finished: false,
            loading: false,
            refreshing: false,
            page: 1,
            totalPage: 0,
            status
        })

        const loadData = async () =>{
            const { data, data: { list } } = await getOrderList({ pageNumber: state.page, status: state.status })
            state.list = state.list.concat(list)
            state.totalPage = data.totalPage
            state.loading = false;
            if(state.page >= data.totalPage) state.finished = true
        }
        //下拉刷新
        const onRefresh = () => {
            state.refreshing = true
            state.finished = false
            state.loading = true
            state.page = 1
            onLoad()
        }

        const onLoad = () => {

            //如果不是下拉刷新，且没到最后一页，则是向上滑动获取更多的数据
            if( !state.refreshing && state.page < state.totalPaeg){
                state.page += 1;
            }
            // 如果是下拉刷新，清空数组重新加载
            if(state.refreshing){
                state.list = [];
                state.refreshing = false;
            }
            loadData()
        }

        const onChangeTab = (name) => {//在标签指定 name 属性的情况下，v-model:active等绑定的值为当前标签的 name，如果没绑定name值，则返回从0开始的索引
            state.status = name
            onRefresh()
        }

        const goTo = (id) => {
            router.push({ path: '/order-detail', query: { id } })
        }

        return{
            ...toRefs(state),
            loadData,
            onLoad,
            onRefresh,
            onChangeTab,
            goTo
        }

    }
}
</script>


<style lang="less" scoped>
  @import '../common/style/mixin';
  .order-box {
    .order-header {
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
      .order-name {
        font-size: 14px;
      }
    }
    .order-tab {
      position: fixed;
      left: 0;
      z-index: 1000;
      width: 100%;
      border-bottom: 1px solid #e9e9e9;
    }
    .skeleton {
      margin-top: 60px;
    }
    .content {
      height: calc(~"(100vh - 70px)");
      overflow: hidden;
      overflow-y: scroll; 
      margin-top: 34px;
    }
    .order-list-refresh {
      .van-card__content {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      .van-pull-refresh__head {
        background: #f9f9f9;
      }
      .order-item-box {
        margin: 20px 10px;
        background-color: #fff;
        .order-item-header {
          padding: 10px 20px 0 20px;
          display: flex;
          justify-content: space-between;
        }
        .van-card {
          background-color: #fff;
          margin-top: 0;
        }
      }
    }
  }
</style>
