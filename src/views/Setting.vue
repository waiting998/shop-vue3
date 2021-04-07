<template>
    <div class="seting-box">
        <s-header :name="'账号管理'"></s-header>
        <div class="input-item">
            <van-field v-model="nickName" label="昵称" />
            <van-field v-model="introduceSign" label="个性签名" />
            <van-field v-model="password" type="password" label="修改密码" />
        </div>
        <van-button round class="save-btn" color="#1baeae" type="primary" block @click="save">保存</van-button>
        <van-button round class="save-btn" color="#1baeae" type="primary" block @click="handleLogout">退出登录</van-button>
    </div>
</template>

<script>
import sHeader from '@/components/SimpleHeader'
import md5 from 'js-md5'
import { onMounted, reactive, toRefs } from 'vue'
import { getUserInfo, EditUserInfo, logout } from '@/service/user'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
import { setLocal } from '@/common/js/untils' 
export default {
    name: 'setting',
    components: {
        sHeader
    },
    setup(){
        const router = useRouter()
        const state = reactive({
            nickName:'',
            introduceSign:'',
            password:''
        })

        onMounted(async () => {
            const { data } = await getUserInfo()
            state.nickName = data.nickName
            state.introduceSign = data.introduceSign
        })

        const save = async () => {
            const params = {
                introduceSign: state.introduceSign,
                nickName: state.nickName
            }

            if(state.password){
                params.passwordMd5 = md5(state.password)
            }

            await EditUserInfo(params)
            Toast.success('保存成功')
            router.push({ path : '/user' })

        }

        const handleLogout = async () => {
            const { resultCode } = await logout()
            if(resultCode == 200){
                setLocal('token','')
                router.push({ path : '/home' })
            }
        }


        return{
            ...toRefs(state),
            handleLogout,
            save
        }
    }
}
</script>

<style lang="less" scoped>
  .seting-box {
    .save-btn {
      width: 80%;
      margin: 20px auto ;
    }
  }
</style>