import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const abnorData = {//异常上报
	state:{
		parameters:'',
	    thatclick:'',
	    submitType:true,
	    abnorReport:{//异常上报
			name:'',
			position:'',
			major:'',
			abdes:'',
			code:'',
			phenomenon:'',
			level:'',
			solve:'',
			handledes:''
	    },
		popupVisible:false,
		popuplist:{
			active:'',list:''
		},
	},
	getters:{
	  	getAbnorReport:state => {
	  		return state.abnorReport[state.parameters.parameterName];
	  	}
	},
	mutations:{
	  	gengxin:(state,val) => {
	  		state.abnorReport[val[0]] = val[1];
	  	},
	  	judgeinfo:(state) =>{
			Object.keys(state.abnorReport).forEach((e,i) => {
				if(state.abnorReport[e] == "" || state.abnorReport[e] == null && e != 'phenomenon' && e != 'code'){
					state.submitType = true;
					return false;
				}else{
					state.submitType = false;
				}
			})
		}
	}
}

const repairData = {
	state:{
		title:'',
		parameter:null,
	}
}

const archivesData = {//档案
	state:{
		title:['设备名称'],
		child:0,
		datalist:[[]],
		simulation:[
			[
				{icon:'icon-shezhi',name:'电器系统'},
				{icon:'icon-shezhi',name:'机械系统'},
				{icon:'icon-shezhi',name:'电器系统'},
				{icon:'icon-shezhi',name:'电器系统'},
			],
			[
				{icon:'icon-wenzhangsousuo',name:'成条机'},
				{icon:'icon-wenzhangsousuo',name:'成条机'},
				{icon:'icon-wenzhangsousuo',name:'接装机'},
				{icon:'icon-wenzhangsousuo',name:'接装机'},
			],
			[
				{icon:'icon-wenzhangsousuo',name:'计量料槽'},
				{icon:'icon-wenzhangsousuo',name:'驱动'},
				{icon:'icon-wenzhangsousuo',name:'下振槽'},
				{icon:'icon-wenzhangsousuo',name:'转动支架'},
			]
		],
	},
	mutations:{
		poparr:state => {
			state.title.pop();
			state.datalist.pop();
			state.child --;
		},
	},
	actions:{
		returnpage({commit}){
			commit('returnpage')
		}
	}
}
const worklistData = {//工单
	state:{
		worklistactiveItem:'',//点击工单列表的数据
		worklistHandle:'',//工单处理数据
		num:0,//工单处理页数
		worklistHandleData1:{//工单处理整理数据
			tablec:[],
			inspection:{
				arr:[],
				realRead:{},
				exeResult:{},
			},
			title:'',
			total:'',
			page:''
		}
	},
	getters:{
		
	}
}

export default new Vuex.Store({
  	state:{
  		token:'',
  		LOADING:false,
    		title:'EAM<sup>2</sup>设备运维助手',
    		heads:{
    			show:'statesShow',
    			headData:[],
    		},
    		imgSrc:'/static/img/homebg.1afc654.png',
    		picValue:'',
  	},
  	mutations:{
  		set_token(state, token) {
			state.token = token
			sessionStorage.token = token
		},
		del_token(state) {
			state.token = ''
			sessionStorage.removeItem('token')
		},
		showLoading(state){
            state.LOADING = true    
        },
        hideLoading (state) {
            state.LOADING = false
        }
  	},
	modules:{
		abnorData:abnorData,
		repairData:repairData,
		archivesData:archivesData,
		worklistData:worklistData
	}
})
