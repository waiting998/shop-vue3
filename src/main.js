import { createApp } from 'vue'
import { Form, Field, Button, Icon, Swipe, SwipeItem, Skeleton, Tab, Tabs, List, PullRefresh, ActionBar, ActionBarIcon, ActionBarButton, Stepper, CheckboxGroup, Checkbox, SwipeCell, SubmitBar, AddressList, AddressEdit, Divider, Popup, Card } from 'vant';
import App from './App.vue'
import router from './router'
import store from './store'
import 'lib-flexible/flexible' //vant 移动端自适应框架
import 'vant/lib/index.css'; // vant全局引入样式

const app = createApp(App);



app.use(store).use(router)
    .use(Form)
    .use(Field)
    .use(Button)
    .use(ActionBar)
    .use(ActionBarIcon)
    .use(ActionBarButton)
    .use(Icon)
    .use(Swipe)
    .use(SwipeItem)
    .use(Skeleton)
    .use(Tab)
    .use(Tabs)
    .use(List)
    .use(PullRefresh)
    .use(Stepper)
    .use(Checkbox)
    .use(CheckboxGroup)
    .use(SwipeCell)
    .use(SubmitBar)
    .use(AddressList)
    .use(AddressEdit)
    .use(Divider)
    .use(Popup)
    .use(Card)
    .mount('#app')

// 注册全局过滤器  用于请求返回的数据  解决其路径问题
app.config.globalProperties.$filters = {
    prefix(url) {
        if (url && url.startsWith('http')) {
            return url
        } else {
            url = `http://47.99.134.126:28019${url}`
            return url
        }
    }
}