// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Mui from 'vue-awesome-mui'
import Mint from 'mint-ui'
import axios from 'axios'
import router from './router'
import store from './store/store'
import md5 from 'js-md5'
import './static/rem'
import './static/reset.css'
import 'swiper/dist/css/swiper.css'
import 'mint-ui/lib/style.css'
import './static/iconfont/iconfont.css'
import './static/common.css'
import './static/liststyle.css'
Vue.use(Mui)

import { Loadmore,MessageBox,Toast } from 'mint-ui';
import fastClick from 'fastclick'
 
fastClick.prototype.onTouchEnd = function(event) {
	if(event.target.hasAttribute("type") && event.target.getAttribute("type") == "button") {
		event.preventDefault();　　　
		return false;　　
	}
}
fastClick.attach(document.body);
router.afterEach(to => {
	MessageBox.close()
})
Vue.component(Loadmore.name, Loadmore);
axios.defaults.headers.get['Content-Type'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';
axios.defaults.headers.common['accessToken'] = store.state.token;
let url = '';
if(localStorage.DEVHOST){
	let dev = JSON.parse(localStorage.DEVHOST);
	store.state.devHost = dev.host;
	store.state.loginPort = dev.loginPort;
	store.state.photoPort = dev.photoPort;
	store.state.serPort = dev.serPort;
}
//url = store.state.devHost+':'+store.state.serPort+'/';
process.env.NODE_ENV === 'development'?url = '/api/':url = 'http://192.168.1.124:9527/';
Vue.config.productionTip = false
Vue.use(Mint)
Vue.prototype.$md5 = md5;
Vue.prototype.$axios= axios;
Vue.prototype.$MessageBox = MessageBox;
Vue.prototype.$Toast = Toast;


/* eslint-disable no-new */
new Vue({
	el: '#app',
	data(){
		return{
			URL:url,
			iphonex:false
		}
	},
	methods:{
		isIphoneX(){
			return /iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)
		}
	},
	router,
	store,
	components: { App },
	template: '<App/>',
	mounted(){
		if(this.isIphoneX()){
			this.iphonex = true;
		}
	}
})

mui.init({
	keyEventBind: {
		backbutton: true //关闭back按键监听
	}
});
// 添加请求拦截器
axios.interceptors.request.use(config => {
	// 在发送请求之前做些什么
	//判断是否存在token，如果存在将每个页面header都添加token
	if(store.state.token){
		config.headers.common['accessToken'] = store.state.token
	}
	return config;
}, error => {
	// 对请求错误做些什么
	return Promise.reject(error);
});
 
// http response 拦截器
axios.interceptors.response.use(response => {
	return response;
},error => {
	store.commit('hideLoading');
	if (error.response) {
		switch (error.response.status) {
			case 400:
			MessageBox('提示','请求错误');
			break;
			case 401:
			store.commit('del_token');
			router.replace({
				path: '/login',
				query: {redirect: router.currentRoute.fullPath}//登录成功后跳入浏览的当前页面
			})
			break;
			case 403:
			MessageBox('提示','拒绝访问');
			break;
			case 404:
			MessageBox('提示','请求地址出错:'+error.response.config.url);
			router.replace({
				name: 'notFound',
				params: {redirect: router.currentRoute.fullPath,type:'404'}
			})
			break;
			case 408:
			MessageBox('提示','请求超时');
			router.replace({
				name: 'notFound',
				params: {redirect: router.currentRoute.fullPath,type:'404'}
			})
			break;
			case 500:
			MessageBox('提示','服务器内部错误');
			router.replace({
				name: 'notFound',
				params: {redirect: router.currentRoute.fullPath,type:'404'}
			})
			break;
			case 501:
			MessageBox('提示','服务未实现');
			break;
			case 502:
			MessageBox('提示','网关错误');
			break;
			case 503:
			MessageBox('提示','服务不可用');
			router.replace({
				name: 'notFound',
				params: {redirect: router.currentRoute.fullPath,type:'404'}
			})
			break;
			case 504:
			MessageBox('提示','网关超时');
			router.replace({
				name: 'notFound',
				params: {redirect: router.currentRoute.fullPath,type:'404'}
			})
			break;
			case 505:
			MessageBox('提示','HTTP版本不受支持');
			break;
			default:
			MessageBox('提示','请求失败');
		}
	}
	return Promise.reject(error.response.data)
});
