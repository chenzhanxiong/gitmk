import Vue from 'vue'
import Router from 'vue-router'
const  Home = r => require.ensure( [], () => r (require('@/components/home')))//首页
const  Login = r => require.ensure( [], () => r (require('@/components/login')))//登录页
const  ScanCode = r => require.ensure( [], () => r (require('@/components/scanCode')))//扫描页面
const  Equipment = r => require.ensure( [], () => r (require('@/components/equipment')))//设备列表
const  Equiplist = r => require.ensure( [], () => r (require('@/components/equipment/equiplist')))//单个设备信息
const  EarlyWarning = r => require.ensure( [], () => r (require('@/components/equipment/earlyWarning')))//设备预警列表
const  EarlyContent = r => require.ensure( [], () => r (require('@/components/equipment/earlyContent')))//设备预警详情
/**工单**/
const  WorkList = r => require.ensure( [], () => r (require('@/components/workList')))//工单列表
const  RepairCenter = r => require.ensure( [], () => r (require('@/components/repairCenter')))//
const  WorkInspectlun = r => require.ensure( [], () => r (require('@/components/workList/workInspectlun')))
const  FaultInfo = r => require.ensure( [], () => r (require('@/components/workList/faultInfo')))//故障或换件信息
const  Faultshu = r => require.ensure( [], () => r (require('@/components/workList/faultshu')))//故障树
const  AddReplace = r => require.ensure( [], () => r (require('@/components/workList/addReplace')))//换件信息
const  AddSparepart = r => require.ensure( [], () => r (require('@/components/workList/addSparepart')))//零件信息



/**9大工单处理**/
const  checklist = r => require.ensure( [], () => r (require('@/components/workList/1')))
const  workHandle1 = r => require.ensure( [], () => r (require('@/components/workList/1/worklistHandle')))
const  patrollist = r => require.ensure( [], () => r (require('@/components/workList/2')))
const  workHandle2 = r => require.ensure( [], () => r (require('@/components/workList/2/worklistHandle')))
const  dailylist = r => require.ensure( [], () => r (require('@/components/workList/3')))
const  workHandle3 = r => require.ensure( [], () => r (require('@/components/workList/3/worklistHandle')))
const  periodlist = r => require.ensure( [], () => r (require('@/components/workList/4')))
const  detailLun4 = r => require.ensure( [], () => r (require('@/components/workList/4/detailLun')))
const  workHandle4 = r => require.ensure( [], () => r (require('@/components/workList/4/worklistHandle')))
const  periodDlist = r => require.ensure( [], () => r (require('@/components/workList/5')))
const  detailLun5 = r => require.ensure( [], () => r (require('@/components/workList/5/detailLun')))
const  workHandle5 = r => require.ensure( [], () => r (require('@/components/workList/5/worklistHandle')))
const  lubricationlist = r => require.ensure( [], () => r (require('@/components/workList/6')))
const  workHandle6 = r => require.ensure( [], () => r (require('@/components/workList/6/worklistHandle')))
const  overhaullist = r => require.ensure( [], () => r (require('@/components/workList/7')))
const  detailLun7 = r => require.ensure( [], () => r (require('@/components/workList/7/detailLun')))
const  workHandle7 = r => require.ensure( [], () => r (require('@/components/workList/7/worklistHandle')))
const  repairlist = r => require.ensure( [], () => r (require('@/components/workList/8')))
const  workHandle8 = r => require.ensure( [], () => r (require('@/components/workList/8/worklistHandle')))
const  preventChecklist = r => require.ensure( [], () => r (require('@/components/workList/9')))
const  workHandle9 = r => require.ensure( [], () => r (require('@/components/workList/9/worklistHandle')))



const  Details = r => require.ensure( [], () => r (require('@/components/repairCenter/details')))
/**异常上报**/
const  AbnormallyReport = r => require.ensure( [], () => r (require('@/components/abnormallyReport')))
const  AssPhotos = r => require.ensure( [], () => r (require('@/components/abnormallyReport/assPhotos')))
const  Describe = r => require.ensure( [], () => r (require('@/components/abnormallyReport/describe')))
const  FaultTree = r => require.ensure( [], () => r (require('@/components/abnormallyReport/faultTree')))



/**档案**/
const  Archives = r => require.ensure( [], () => r (require('@/components/archives')))

/**状态**/
const  States = r => require.ensure( [], () => r (require('@/components/states')))
/**设置**/
const  SetUp = r => require.ensure( [], () => r (require('@/components/setUp')))

/**照相机**/
const  Camera = r => require.ensure( [], () => r (require('@/components/photocom/camera')))
const  Photocom = r => require.ensure( [], () => r (require('@/components/photocom/photocom')))

/**404**/
const  NotFound = r => require.ensure( [], () => r (require('@/components/notFound')))

import store from '@/store/store'
Vue.use(Router)

if (localStorage.getItem('EAMTOKEN')) {
	let date1 = localStorage.getItem('EAMTOKEN');
	let day = new Date().getTime();
	date1 = JSON.parse(date1);
	if(day - date1.eam_curTime > 1000*3600*24*7){
		store.commit('del_token');
	}else{
		store.commit('set_token', localStorage.getItem('EAMTOKEN'))
	}
}


const router = new Router({
  routes: [
    {
      	path: '/',
      	name: 'Home',
      	meta:{index:1,requireAuth:true,keepAlive:true,isUseCache:false},
      	component: Home
    },
    {
      	path: '/setUp',
      	name: 'SetUp',
      	meta:{index:2,requireAuth:true,keepAlive:true,isUseCache:false},
      	component: SetUp
    },
    {
		path: '/login',
		name: 'Login',
		meta:{index:0,keepAlive:true},
		component: Login
    },
    {
		path: '/scanCode',
		name: 'ScanCode',
		meta:{index:15,requireAuth:true,keepAlive:true,isUseCache:false},
		component: ScanCode
    },
    {
		path: '/equipment',
		name: 'Equipment',
		meta:{index:2,requireAuth:true,keepAlive:true,keepAlive:true,isUseCache:false},
		component: Equipment
    },
    {
		path: '/equiplist',
		name: 'Equiplist',
		meta:{index:3,requireAuth:true,keepAlive:true,isUseCache:false},
		component: Equiplist
    },
    {
		path: '/workList',
		name: 'WorkList',
		meta:{index:4,requireAuth:true,keepAlive:true,isUseCache:false},
		component: WorkList
    },
    {
		path: '/repairCenter',
		name: 'RepairCenter',
		meta:{index:5,requireAuth:true,keepAlive:true,isUseCache:false},
		component: RepairCenter,
    },
    {
		path:'/details',
		name: 'Details',
		meta:{index:6,requireAuth:true,keepAlive:true,isUseCache:false},
		component: Details,
    },
    {
		path: '/abnormallyReport',
		name: 'AbnormallyReport',
		meta:{index:9,requireAuth:true,keepAlive:true,isUseCache:false},
		component: AbnormallyReport,
    },
    {
		path: '/assPhotos',
		name: 'AssPhotos',
		meta:{index:14,requireAuth:true,keepAlive:true,isUseCache:false},
		component: AssPhotos,
    },
    {
		path: '/describe',
		name: 'Describe',
		meta:{index:10,requireAuth:true,keepAlive:true,isUseCache:false},
		component: Describe,
    },
    {
		path: '/faultTree',
		name: 'FaultTree',
		meta:{index:10,requireAuth:true,keepAlive:true,isUseCache:false},
		component: FaultTree,
    },
    {
		path: '/workInspectlun',
		name: 'WorkInspectlun',
		meta:{index:7,requireAuth:true,keepAlive:true,isUseCache:false},
		component: WorkInspectlun,
    },
    {
		path: '/earlyWarning',
		name: 'EarlyWarning',
		meta:{index:4,requireAuth:true,keepAlive:true,isUseCache:false},
		component: EarlyWarning,
    },
    {
		path: '/earlyContent',
		name: 'EarlyContent',
		meta:{index:5,requireAuth:true,keepAlive:true,isUseCache:false},
		component: EarlyContent,
    },
    {
		path: '/archives',
		name: 'Archives',
		meta:{index:4,requireAuth:true,keepAlive:true,isUseCache:false},
		component: Archives,
    },
    {
		path: '/states',
		name: 'States',
		meta:{index:11,requireAuth:true,keepAlive:true,isUseCache:false},
		component: States,
    },
    {
		path: '/faultInfo',
		name: 'FaultInfo',
		meta:{index:9,requireAuth:true,keepAlive:true,isUseCache:false},
		component: FaultInfo,
    },
	{
		path: '/faultshu',
		name: 'Faultshu',
		meta:{index:10,requireAuth:true,keepAlive:true,isUseCache:false},
		component: Faultshu,
	},
    {
		path: '/addReplace',
		name: 'AddReplace',
		meta:{index:10,requireAuth:true,keepAlive:true,isUseCache:false},
		component: AddReplace,
    },
    {
		path: '/addSparepart',
		name: 'AddSparepart',
		meta:{index:11,requireAuth:true,keepAlive:true,isUseCache:false},
		component: AddSparepart,
    },
    {
		path: '/camera',
		name: 'Camera',
		meta:{index:12,requireAuth:true,keepAlive:true,isUseCache:false},
		component: Camera,
    },
    {
		path: '/photocom',
		name: 'Photocom',
		meta:{index:13,requireAuth:true,keepAlive:true,isUseCache:false},
		component: Photocom,
    },
	{
		path: '/detailLun4',
		name: 'detailLun4',
		meta:{index:7,requireAuth:true,keepAlive:true,isUseCache:false},
		component: detailLun4
	},
	{
		path: '/detailLun5',
		name: 'detailLun5',
		meta:{index:7,requireAuth:true,keepAlive:true,isUseCache:false},
		component: detailLun5
	},
	{
		path: '/detailLun7',
		name: 'detailLun7',
		meta:{index:7,requireAuth:true,keepAlive:true,isUseCache:false},
		component: detailLun7
	},
    /**9大工单列表**/
    {
		path: '/checklist',
		name: 'checklist',
		meta:{index:5,requireAuth:true,keepAlive:true,isUseCache:false},
		component: checklist
    },
    {
		path: '/patrollist',
		name: 'patrollist',
		meta:{index:5,requireAuth:true,keepAlive:true,isUseCache:false},
		component: patrollist
    },
    {
		path: '/dailylist',
		name: 'dailylist',
		meta:{index:5,requireAuth:true,keepAlive:true,isUseCache:false},
		component: dailylist
    },
	{
		path: '/periodlist',
		name: 'periodlist',
		meta:{index:5,requireAuth:true,keepAlive:true,isUseCache:false},
		component: periodlist
	},
	{
		path: '/periodDlist',
		name: 'periodDlist',
		meta:{index:5,requireAuth:true,keepAlive:true,isUseCache:false},
		component: periodDlist
	},
    {
		path: '/lubricationlist',
		name: 'lubricationlist',
		meta:{index:5,requireAuth:true,keepAlive:true,isUseCache:false},
		component: lubricationlist
    },
    {
		path: '/overhaullist',
		name: 'overhaullist',
		meta:{index:5,requireAuth:true,keepAlive:true,isUseCache:false},
		component: overhaullist
    },
	{
		path: '/repairlist',
		name: 'repairlist',
		meta:{index:5,requireAuth:true,keepAlive:true,isUseCache:false},
		component: repairlist
	},
	{
		path: '/preventChecklist',
		name: 'preventChecklist',
		meta:{index:5,requireAuth:true,keepAlive:true,isUseCache:false},
		component: preventChecklist
	},
    /**9大工单处理**/
     {
		path: '/workHandle1',
		name: 'workHandle1',
		meta:{index:8,requireAuth:true,keepAlive:true,isUseCache:false},
		component: workHandle1,
    },
    {
		path: '/workHandle2',
		name: 'workHandle2',
		meta:{index:8,requireAuth:true,keepAlive:true,isUseCache:false},
		component: workHandle2,
    },
    {
		path: '/workHandle3',
		name: 'workHandle3',
		meta:{index:8,requireAuth:true,keepAlive:true,isUseCache:false},
		component: workHandle3,
    },
	{
		path: '/workHandle4',
		name: 'workHandle4',
		meta:{index:8,requireAuth:true,keepAlive:true,isUseCache:false},
		component: workHandle4,
	},
	{
		path: '/workHandle5',
		name: 'workHandle5',
		meta:{index:8,requireAuth:true,keepAlive:true,isUseCache:false},
		component: workHandle5,
	},
    {
		path: '/workHandle6',
		name: 'workHandle6',
		meta:{index:8,requireAuth:true,keepAlive:true,isUseCache:false},
		component: workHandle6,
    },
    {
		path: '/workHandle7',
		name: 'workHandle7',
		meta:{index:8,requireAuth:true,keepAlive:true,isUseCache:false},
		component: workHandle7,
    },
	{
		path: '/workHandle8',
		name: 'workHandle8',
		meta:{index:8,requireAuth:true,keepAlive:true,isUseCache:false},
		component: workHandle8,
	},
	{
		path: '/workHandle9',
		name: 'workHandle9',
		meta:{index:8,requireAuth:true,keepAlive:true,isUseCache:false},
		component: workHandle9,
	},
	{
		path: '/notFound',
		name: 'notFound',
		component: NotFound,
	},
    {path:'*',component:NotFound},
  ]
})

router.beforeEach((to, from, next) => {
	if (to.matched.some(r => r.meta.requireAuth)) {
		if (store.state.token) {
			next();
		}else {
			next({
				path: '/login',
				query: {redirect: to.fullPath}
			})
		}
	}else {
		next();
	}
})

export default router;