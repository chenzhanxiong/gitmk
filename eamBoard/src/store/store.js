import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


export default new Vuex.Store({
  	state:{
  		token:'',
		devHost:'http://192.168.1.171',
		loginPort:'8021',
		photoPort:'8021',
		serPort:'8021',
		devUrl:'',
		headData:false,
		activeEquId:null,//当前设备
		activeEquName:null,
		activeAssetNumber:null//资产编号
  	},
	mutations:{
		set_token(state, value) {
			let token = JSON.parse(value);
			state.token = token.token;
			localStorage.setItem('EAMTOKEN',value);
		},
		del_token(state) {
			state.token = ''
			localStorage.removeItem('EAMTOKEN')
		},
	}
})
