<template>
    <div class="address-box">
        <s-header :name="'地址管理'" :back="from == 'create-order' ? '' : '/user'"></s-header>
        <div class="address-item">
            <van-address-list
                v-if="from != 'mine'"
                v-model="chosenAddressId"
                :list="list"
                default-tag-text="默认"
                @add="onAdd"
                @edit="onEdit"
                @select="select"

            />
            <van-address-list
                v-else
                v-model="chosenAddressId"
                :list="list"
                default-tag-text="默认"
                @add="onAdd"
                @edit="onEdit"
            />
        </div>
    </div>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue'
import sHeader from '@/components/SimpleHeader'
import { Toast } from 'vant'
import { getAddressList } from '@/service/address'
import { useRouter, useRoute } from 'vue-router'
export default {
    name: 'address',
    components:{
        sHeader
    },
    setup() {
        const route = useRoute()
        const router = useRouter()
        const state = reactive({
            list:[],
            chosenAddressId: '1',
            from: route.query.from
        })

        onMounted(async () => {
            const { data } = await getAddressList()
            
            if(!data){
                state.list = []
                return
            }

            state.list = data.map(item => {
                return {
                    id: item.addressId,
                    name: item.userName,
                    tel: item.userPhone,
                    address: `${item.provinceName} ${item.cityName} ${item.regionName} ${item.detailAddress}`,
                    isDefault: item.defaultFlag
                }
            })
        })


        const onAdd = () => {
            router.push({ path: '/address-edit', query: { type: 'add', from: state.from } })
        }
        
        const onEdit = (item) => {
            router.push({path: '/address-edit', query: { type: 'edit', addressId: item.id, from: state.from } })
        };

        const select = (index) => {
            // 如果不是个人信息入口进来的，就都是订单，需要可切换地址，点击选择地址的时候带着该地址的ID跳转，在订单页面通过id判断选择了哪个地址
            router.push( { path: 'create-order', query: { addressId: index.id, from: state.from}} )
        }


        return {
            ...toRefs(state),
            onAdd,
            onEdit,
            select
        };
    },
};
</script>


<style lang="less">
  @import '../common/style/mixin';
  .address-box {
    .van-radio__icon {
      display: none;
    }
    .address-item {
      .van-button {
        background: @primary;
        border-color: @primary;
      }
    }
  }
</style>