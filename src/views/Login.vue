<template>
  <div class="login">
    <sHeader :name="type == 'login' ? '登录' : '注册'" :back="'/home'"></sHeader>
    <img class="logo" src="https://s.yezgea02.com/1604045825972/newbee-mall-vue3-app-logo.png" alt="">
    <!-- 判断是注册还是登录 -->
    <div v-if="type == 'login'" class="login-body login">
      <van-form @submit="onSubmit">
        <van-field
          v-model="username"
          name="username"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />

        <van-field
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />

        <van-field
          center
          clearable
          label="验证码"
          placeholder="输入验证码"
          v-model="verify"
        >
        <template #button>
            <vue-img-verify ref="verifyRef" /><!-- ref="xxx"的绑定方式 可取到子组件的值 解决 组件单向传递数据的不足 -->
          </template>
        </van-field>

        <div style="margin: 16px;">
          <div class="link-register" @click="toggle('register')">立即注册</div>
          <van-button color="#1baeae" round block type="primary" native-type="submit">
            登录
          </van-button>
        </div>
      </van-form>
    </div>
    <div v-else class="login-body register">
      <van-form @submit="onSubmit">
        <van-field
          v-model="username1"
          name="username1"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="password1"
          type="password"
          name="password1"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <van-field
          center
          clearable
          label="验证码"
          placeholder="输入验证码"
          v-model="verify"
        >
          <template #button>
            <vue-img-verify ref="verifyRef" />
          </template>
        </van-field>
        <div style="margin: 16px;">
          <div class="link-login" @click="toggle('login')">已有登录账号</div>
          <van-button round block color="#1baeae" native-type="submit">注册</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>
<script>
import { reactive,  ref, toRefs } from 'vue' 
import sHeader from '@/components/SimpleHeader'
import vueImgVerify from '@/components/VueImageVerify'
import { Toast } from 'vant'
import { login , register } from '@/service/user'
import { setLocal } from '@/common/js/untils'
import md5 from 'js-md5'
export default {
  setup() {
    const verifyRef = ref(null)
    const state = reactive({
      type: 'login',
      username:'',
      password:'',
      username1:'',
      password1:'',
      imgCode: '',
      verify:''
    })

    // 提交登录或注册
    const onSubmit = async () => {
      console.log('verifyRef.value.imgCode', verifyRef.value.imgCode)//在调用VueImageVerify组件时 通过ref="verifyRef"绑定了，所以可以verifyRef.value.imgCode 调用VueImageVerify中的imgCode,verifyRef是ref数据类型需要通过verifyRef.value调用
      state.imgCode = verifyRef.value.imgCode || ''
      if(state.imgCode.toLowerCase() != state.verify.toLowerCase()){//判断验证码是否输入正确
        Toast.fail('验证码有误')
        return
      }
      // 验证码正确后 提交账号密码到登录接口
      if(state.type == 'login'){
        const { data } = await login({//此处的login方法是从service中的user.js引入的
          'loginName': state.username,
          'passwordMd5': md5(state.password)
        })
        //因为 上面的login方法中使用了封装的axios，提交之后会根据后台接口返回的resultCode状态码， 返回对应的提示 返回的data值 设定token token用于判断登录状态
        setLocal('token', data);
        // 刷新页面 是为了axios.js中的token重置
        window.location.href = "/"
      }else{
        // 注册
        console.log("password1:"+md5(state.password1));
        await register({
          'loginName': state.username1,
          'password': state.password1
        })
        Toast.success('注册成功')
        state.type = 'login'
        state.verify = ''
      }
    }
    // 切换登录注册
    const toggle = (v) => {
      state.type = v;
      state.verify = '';
    }
    return {
      ...toRefs(state),//...toRefs解构之后，在template中就可以直接使用 state中的值，否则在template中就需要用 state.xxx 使用
      onSubmit,
      toggle,
      verifyRef
    }
  },
  components:{
    sHeader,
    vueImgVerify
    
  }

}
</script>
<style lang="less">
  .login {
    .logo {
      width: 120px;
      height: 120px;
      display: block;
      margin: 80px auto 20px;
    }
    .login-body {
      padding: 0 20px;
    }
    .login {
      .link-register {
        font-size: 14px;
        margin-bottom: 20px;
        color: #1989fa;
        display: inline-block;
      }
    }
    .register {
      .link-login {
        font-size: 14px;
        margin-bottom: 20px;
        color: #1989fa;
        display: inline-block;
      }
    }
    .verify-bar-area {
      margin-top: 24px;
      .verify-left-bar {
        border-color: #1baeae;
      }
      .verify-move-block {
        background-color: #1baeae;
        color: #fff;
      }
    }
    .verify {
      >div {
        width: 100%;
      }
      display: flex;
      justify-content: center;
      .cerify-code-panel {
        margin-top: 16px;
      }
      .verify-code {
        width: 40%!important;
        float: left!important;
      }
      .verify-code-area {
        float: left!important;
        width: 54%!important;
        margin-left: 14px!important;
        .varify-input-code {
          width: 90px;
          height: 38px!important;
          border: 1px solid #e9e9e9;
          padding-left: 10px;
          font-size: 16px;
        }
        .verify-change-area {
          line-height: 44px;
        }
      }
    }
  }
</style>
