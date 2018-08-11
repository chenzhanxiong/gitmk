// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Mint from 'mint-ui'
import axios from 'axios'
import router from './router'
import store from './store/store'
import md5 from 'js-md5'
import './static/rem'
import './static/reset.css'
import 'mint-ui/lib/style.css'
import './static/iconfont/iconfont.css'
import './static/common.css'
import './static/plusread'

import { Loadmore,MessageBox,Toast } from 'mint-ui';

Vue.component(Loadmore.name, Loadmore);
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.common['accessToken'] = store.state.token;
const url = 'http://192.168.1.174:88/eom/api/';
Vue.config.productionTip = false
Vue.prototype.$md5 = md5;
axios.defaults.baseURL = url;
Vue.prototype.$axios= axios;
Vue.prototype.$url = url;
Vue.prototype.$MessageBox = MessageBox;
Vue.prototype.$Toast = Toast;

Vue.use(Mint)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
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
			case 401:
			store.commit('del_token');
			router.replace({
				path: '/login',
				query: {redirect: router.currentRoute.fullPath}//登录成功后跳入浏览的当前页面
			})
			break;
		}
	}
	return Promise.reject(error.response.data)
});
