<template>
    <div class="address-edit-box">
        <s-Header :name="`${type=='add' ? '新增地址' : '地址编辑'}`"></s-Header>
        <van-address-edit
            class="edit"
            :area-list="areaList"
            :address-info="addressInfo"
            :show-delete="type == 'edit'"
            show-set-default
            :area-columns-placeholder="['请选择', '请选择', '请选择']"
            @save="onSave"
            @delete="onDelete"
        />
    </div>

</template>

<script>
import sHeader from '@/components/SimpleHeader'
import { onMounted, reactive, toRefs } from 'vue'
// import { Toast } from 'vant'
import { getAddressDetail } from '@/service/address'
import { tdist } from '@/common/js/untils'
import { useRoute, useRouter } from 'vue-router'
import { addAddress, EditAddress, DeleteAddress } from '@/service/address'
import { Toast } from 'vant'

export default {
    components:{
        sHeader
    },
    setup(){
        const route = useRoute()
        const router = useRouter()
        const state = reactive({
            areaList: {
                province_list: {},
                city_list: {},
                county_list: {}
            },
            type: 'add',
            addressId: '',
            addressInfo: {}
        })

        const onSave = async (content) => {
            const params = {
                userName: content.name,
                userPhone: content.tel,
                provinceName: content.province,
                cityName: content.city,
                regionName:content.county,
                detailAddress: content.addressDetail,
                defaultFlag: content.isDefault ? 1 : 0
            }
            if(state.type == 'edit'){
                params['addressId'] = state.addressId
            }
            await state.type == 'add' ? addAddress(params) : EditAddress(params)
            Toast('保存成功')
            setTimeout(()=>{
                router.back()
            },1000)
        }


        const onDelete = async () => {
            await DeleteAddress(state.addressId)
            Toast('删除成功')
            setTimeout(()=>{
                router.back()
            },1000)
        }


        onMounted( async () => {
            let _province_list = {}
            let _city_list = {}
            let _county_list = {}
            // 将tdist通过getLev1函数得到的返回值遍历   这里因为tdist中数据的问题，通过下面逻辑解析添加到省份、城市、区对应的对象中
            tdist.getLev1().forEach(p => {
                _province_list[p.id] = p.text
                tdist.getLev2(p.id).forEach( c => {
                    _city_list[c.id] = c.text
                    tdist.getLev3(c.id).forEach(q => _county_list[q.id] = q.text)
                })
            });
            // 分类好后赋值到当前几个变量中
            state.areaList.province_list = _province_list
            state.areaList.city_list = _city_list
            state.areaList.county_list = _county_list
            console.log('state.areaList:',state.areaList)
            // 获取url 参数
            const { addressId, type, from }  = route.query
            state.addressId = addressId
            state.type = type
            state.from = from || ''

            if(type == 'edit'){
           
                // 获取原始地址信息（原先已填写的地址）  
                const { data: addressDetail } = await getAddressDetail(addressId)
                console.log('addressDetail:',addressDetail)
                let _areaCode = ''
                // 筛选出所有省份
                const province = tdist.getLev1()
                // Object.entries返回一个给定对象自身可枚举的键值对数组 即[ ['foo', 'bar'], ['baz', 42] ]这种形式，  在进行遍历，判断是否跟返回的数据一致
                
                Object.entries(state.areaList.county_list).forEach(([id,text]) => {
                    // 先找到区
                    if(text == addressDetail.regionName){
                       
                        // 再找到对应的省  findIndex返回（）内符合条件的第一个的索引位置
                        const provinceIndex = province.findIndex(item => item.id.substr(0,2) == id.substr(0, 2))
                        // 找对应的市区
                        const cityItem = Object.entries(state.areaList.city_list).filter(([cityId,cityName]) => cityId.substr(0,4) == id.substr(0,4))[0]
                        // 最后判断找到的省份是否相等，因为某些区会重名
                        if(province[provinceIndex].text == addressDetail.provinceName && cityItem[1] == addressDetail.cityName){
                            _areaCode = id
                            // 绕一圈就为了地区编码  areaCode是必填项
                        }
                    }
                })
               
                // 赋值初始化
                state.addressInfo = {
                    id: addressDetail.addressId,
                    name: addressDetail.userName,
                    tel: addressDetail.userPhone,
                    province: addressDetail.provinceName,
                    city: addressDetail.cityName,
                    county: addressDetail.regionName,
                    addressDetail: addressDetail.detailAddress,
                    areaCode: _areaCode,
                    isDefault: addressDetail.defaultFlag == 1 ? true : false
                }
                console.log('addressInfo:',state.addressInfo);
            }
        })
 
        return {
            ...toRefs(state),
            onDelete,
            onSave
        }
    }
}

</script>

<style>

</style>