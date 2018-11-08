import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const abnorData = {//异常上报
	state:{
		parameters:{},
		listvalue:{
			repairSourceId:'',
			equKeyId:'',
			equCode:'',
			equName:'',
			postionId:'',
			positionCode:'',
			positionName:'',
			majorId:'',
			strFaultTime:'',
			abnormalTxt:'',
			faultCode:'',
			failureTxt:'',
			reportLevelId:'',
			//aResult:'0',
			strStartTime:'',
			strEndTime:'',
			aProcedureTxt:''
		},
		textareaShow:false,
		textarea:{
			title:'异常描述',
			item:'',
			placeholder:'请输入异常描述'
		}
	},
	mutations:{
		textareaShow(state){
			state.textareaShow = !state.textareaShow;    
		},
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
		worklisteQuKeyItem:'',//点击的设备数据
		workstartDate:'',
		worklistHandle:'',//工单处理数据||保养
		worklistHandle1:'',//工单处理数据（维修）
		repairDetails:'',//维修详情数据
		num:0,//工单处理页数
		isFinish:0,//是否完成
		worklistHandleData1:{//工单处理整理数据
			tablec:null,
			inspection:{
				arr:null,
				realRead:null,
				exeResult:null,
			},
			title:null,
			total:null,
			page:1
		},
		worklistHandleData2:{//工单处理整理数据
			tablec:null,
			inspection:{
				arr:null,
				realRead:null,
				exeResult:null,
			},
			title:null,
			total:null,
			page:1
		}
	},
	getters:{
		
	}
}

export default new Vuex.Store({
	state:{
		token:'',
		devHost:'http://192.168.1.171',
		loginPort:'8021',
		photoPort:'8021',
		serPort:'8021',
		devUrl:'',
		LOADING:false,
		title:'EAM<sup>2</sup>设备运维助手',
		heads:{
			show:'statesShow',
			headData:[],
		},
		imgSrc:'',
		picValue:'',
		screenlist:[],
		screenActive:[],
		imgBindId:{},
		abnImgId:[]
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
		showLoading(state){
				state.LOADING = true    
		},
		hideLoading (state) {
				state.LOADING = false
		},
		emptyPhoto(state){//清空照片
			state.listImage = [];
		},
	
	},
	modules:{
		abnorData:abnorData,
		repairData:repairData,
		archivesData:archivesData,
		worklistData:worklistData
	}
})
