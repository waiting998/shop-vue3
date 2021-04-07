<template>
    <div class="cart-box">
        <s-header :name="'购物车'" :noback="true"></s-header>
        <div class="cart-body">
            <!-- van-checkbox-group  复选框组，  绑定了通过v-model绑定了result，在groupChange函数里面，可以直接拿到result，result返回选中的van-checkbox中绑定的name的值 -->
            <van-checkbox-group @change="groupChange" v-model="result" ref="checkboxGroup">
                <van-swipe-cell :right-width="50" v-for="(item , index) in list" :key="index">
                    <div class="good-item">
                        <!--这里name绑定的值，如果与初始化之后 result 里面每个下标对应的值不一致，就会被认为是数组以外的值，这个vant的checkboxGroup里面的每个值是唯一的，才能完成选中与未选中切换 -->
                        <!-- 简单点说就是，数组里面的值跟:name绑定的值一样才能完成选中与未选中切换，如果值不一样，就会判断为新的一个选项值 -->
                        <van-checkbox :name="item.cartItemId" />   
                        <div class="good-img">
                            <img :src="$filters.prefix(item.goodsCoverImg)" :alt="item.goodsName">    
                        </div>
                        <div class="good-desc">        
                            <div class="good-title">
                                <span>{{ item.goodsName }}</span>
                                <span>x{{ item.goodsCount }}</span>
                            </div>
                            <div class="good-btn">
                                <div class="price">¥{{ item.sellingPrice }}</div>
                                <van-stepper 
                                integer 
                                :min="1" 
                                :max="5"
                                v-model="item.goodsCount"
                                :name="item.cartItemId"
                                @change="onChange"
                                />
                            </div>
                        </div>
                    </div>
                    <template #right>
                        <van-button square icon="delete" type="danger" class="delete-button" @click="deleteGood(item.cartItemId)"/>
                    </template>
                </van-swipe-cell>
            </van-checkbox-group>
        </div>
        <van-submit-bar 
            v-if="list.length > 0 "
            class="submit-all van-hairline--top"
            :price="total * 100"
            button-text="结算"
            @submit="onSubmit"
        >
            <van-checkbox @click="allCheck" v-model="checkAll">全选</van-checkbox>
        </van-submit-bar>
        <div class="empty" v-if="!list.length">
            <img class="empty-cart" src="https://s.yezgea02.com/1604028375097/empty-car.png" alt="空购物车">
            <div class="title">购物车空空如也</div>
            <van-button round color="#1baeae" type="primary" @click="goTo" block>前往选购</van-button>
        </div>
        <nav-bar></nav-bar>
    </div>
</template>


<script>
import sHeader from '@/components/SimpleHeader'
import navBar from '../components/NavBar.vue'
import { computed, onMounted, reactive, toRefs } from 'vue'
import { Toast } from 'vant'
import { getCart, modifyCart, deleteCartItem } from '@/service/cart'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
    components: { 
        navBar,
        sHeader
    },
    setup(){
        const router = useRouter() 
        const store = useStore()
        const state = reactive({
            list:[],
            result: [],
            checkAll: true,
            total: 1
        })

        onMounted(()=>{
            init()
        })


        const init = async ()=> {
            Toast.loading({message:'loading...',forbidClick:true});
            const { data } = await getCart({pageNumber: 1})
            state.list = data
            state.result = data.map(item => item.cartItemId) //map遍历， item=>item.cartItemId  返回符合条件的item到一个新数组，有cartItemId的item才会返回且只返回  cartItemId
            Toast.clear()
        }

        const onChange = async (value,detail) => {//如果函数的内部用到await 则需要在函数参数前添加 async
            // value 是这个van-stepper的值，detail返回这个组件的信息，如绑定的name等
            
            if(value > 5){
                Toast.fail('超出单个商品的最大购买数量')
                return
            }
            if(value < 1){
                Toast.fail('商品不得小于1')
                return
            }

            // 从购物车列表（list）中通过filter内的逻辑过滤(item.cartItemId == detail.name，detail.name绑定了每个商品的id)，判断当前产品goodsCount的是不是跟value（van-stepper的值）一样，如果一样则直接返回
            // if(state.list.filter(item => item.cartItemId == detail.name)[0].goodsCount === value) {
            //     console.log('waiting-value:',value)
            //     return
            // }
            Toast.loading({message:'修改中',forbidClick: true})
            const params = {
                cartItemId: detail.name,
                goodsCount: value
            }
            // 发请求 修改购物车的数据
            await modifyCart(params)
            state.list.forEach(item => {
                // 更新商品的数量，就不用重新init
                if(item.cartItemId == detail.name){
                    item.goodsCount = value
                }
            })
            Toast.clear();
        }

        const groupChange = (result) => {
            // 根据商品选中情况判断是否全选
            if(result.length == state.list.length){
                state.checkAll = true
            }else{
                state.checkAll = false
            }
            console.log("state.result:", state.result)
        }

        const allCheck = () => {
            //将全选按钮与数据绑定 
            console.log('checkAll:',state.checkAll)
            if(state.checkAll){
                state.result = state.list.map(item => item.cartItemId)
            }else{
                state.result = []
            }
        }

        // 结算金额计算
        const total = computed(() => {
            let sum = 0
            // 过滤返回包含cartItemId的数据
            let _list = state.list.filter(item => state.result.includes(item.cartItemId))
            _list.forEach(item => {
                sum += item.goodsCount * item.sellingPrice
            })
            return sum
        })

        const deleteGood = async (id) => {
          await deleteCartItem(id)
          store.dispatch('updateCart')
          init()
        }

        const onSubmit = () => {
          if(state.result.length == 0){
            Toast.fail('请选择商品进行结算')
            return
          }  
          // 转成字符转用于传递参数 CreateOrder
          const params = JSON.stringify(state.result)
          router.push({
            path: '/create-order',query:{ cartItemIds: params}
          })
        }

        const goTo = () => {
          router.push({path: '/home'})
        }

        return{
            ...toRefs(state),
            groupChange,
            onChange,
            allCheck,
            onSubmit,
            goTo,
            total,
            deleteGood
        }
    }

}
</script>


<style lang="less">
  @import '../common/style/mixin';
  .cart-box {
    .cart-header {
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
      .cart-name {
        font-size: 14px;
      }
    }
    .cart-body {
      margin: 16px 0 100px 0;
      padding-left: 10px;
      .good-item {
        display: flex;
        .good-img {
          img {
            .wh(100px, 100px)
          }
        }
        .good-desc {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
          padding: 20px;
          .good-title {
            display: flex;
            justify-content: space-between;
          }
          .good-btn {
            display: flex;
            justify-content: space-between;
            .price {
              font-size: 16px;
              color: red;
              line-height: 28px;
            }
            .van-icon-delete {
              font-size: 20px;
              margin-top: 4px;
            }
          }
        }
      }
      .delete-button {
        width: 50px;
        height: 100%;
      }
    }
    .empty {
      width: 50%;
      margin: 0 auto;
      text-align: center;
      margin-top: 200px;
      .empty-cart {
        width: 150px;
        margin-bottom: 20px;
      }
      .van-icon-smile-o {
        font-size: 50px;
      }
      .title {
        font-size: 16px;
        margin-bottom: 20px;
      }
    }
    .submit-all {
      margin-bottom: 50px;
      .van-checkbox {
        margin-left: 10px
      }
      .van-submit-bar__text {
        margin-right: 10px
      }
      .van-submit-bar__button {
        background: @primary;
      }
    }
    .van-checkbox__icon--checked .van-icon {
      background-color: @primary;
      border-color: @primary;
    }
  }
</style>
