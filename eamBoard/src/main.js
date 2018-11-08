// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'
import ElementUI from 'element-ui'
import echarts from 'echarts'
import axios from 'axios'
import md5 from 'js-md5'
import '@/static/rem'

import 'element-ui/lib/theme-chalk/index.css';
import './static/iconfont/iconfont.css'
import 'swiper/dist/css/swiper.css'
import '@/static/reset.css'
import '@/static/common.css'

let url = '';


axios.defaults.headers.get['Content-Type'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';
axios.defaults.headers.common['accessToken'] = store.state.token;

if(localStorage.DEVHOST){
	let dev = JSON.parse(localStorage.DEVHOST);
	store.state.devHost = dev.host;
	store.state.loginPort = dev.loginPort;
	store.state.photoPort = dev.photoPort;
	store.state.serPort = dev.serPort;
}
//url = store.state.devHost+':'+store.state.serPort+'/';
process.env.NODE_ENV === 'development'?url = '/api/':url = 'http://192.168.1.124:9527/';

Vue.use(ElementUI);
import { MessageBox } from 'element-ui';
Vue.config.productionTip = false
Vue.prototype.$axios= axios;
Vue.prototype.$md5 = md5;
Vue.prototype.$echarts = echarts;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  data(){
  	return{
  		URL:url,
  	}
  },
  router,
  store,
  components: { App },
  template: '<App/>',
})


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
	if (error.response) {
		switch (error.response.status) {
			case 400:
			MessageBox('请求错误','提示')
			break;
			case 401:
			store.commit('del_token');
			router.replace({
				path: '/login',
				query: {redirect: router.currentRoute.fullPath}//登录成功后跳入浏览的当前页面
			})
			break;
			case 403:
			MessageBox('拒绝访问','提示')
			break;
			case 404:
			MessageBox('请求地址出错:'+error.response.config.url,'提示')
			break;
			case 408:
			MessageBox('请求超时','提示')
			break;
			case 500:
			MessageBox('服务器内部错误','提示')
			break;
			case 501:
			MessageBox('服务未实现','提示')
			break;
			case 502:
			MessageBox('网关错误','提示')
			break;
			case 503:
			MessageBox('服务不可用','提示')
			break;
			case 504:
			MessageBox('网关超时','提示')
			break;
			case 505:
			MessageBox('HTTP版本不受支持','提示')
			break;
			default:
			MessageBox('请求失败','提示')
		}
	}
	return Promise.reject(error.response.data)
});