import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home'
import Login from '@/components/login'
import ScanCode from '@/components/scanCode'
import Equipment from '@/components/equipment'
import Equiplist from '@/components/equipment/equiplist'
import EarlyWarning from '@/components/equipment/earlyWarning'
import EarlyContent from '@/components/equipment/earlyContent'
/**工单**/
import WorkList from '@/components/workList'
import RepairCenter from '@/components/repairCenter'
import WorkInspect from '@/components/workList/workInspect'
import WorkInspectlun from '@/components/workList/workInspectlun'
import FaultInfo from '@/components/workList/faultInfo'
import AddReplace from '@/components/workList/addReplace'
import AddSparepart from '@/components/workList/addSparepart'


/**9大工单处理**/
import checklist from '@/components/workList/1'
import workHandle1 from '@/components/workList/1/worklistHandle'
import patrollist from '@/components/workList/2'
import workHandle2 from '@/components/workList/2/worklistHandle'
import dailylist from '@/components/workList/3'
import workHandle3 from '@/components/workList/3/worklistHandle'
import lubricationlist from '@/components/workList/4'
import workHandle4 from '@/components/workList/4/worklistHandle'



import Details from '@/components/repairCenter/details'
/**异常上报**/
import AbnormallyReport from '@/components/abnormallyReport'
import AssPhotos from '@/components/abnormallyReport/assPhotos'
import Describe from '@/components/abnormallyReport/describe'
import FaultTree from '@/components/abnormallyReport/faultTree'



/**档案**/
import Archives from '@/components/archives'

/**状态**/
import States from '@/components/states'
/**设置**/
import SetUp from '@/components/setUp'

/**照相机**/
import Camera from '@/components/photocom/camera'
import Photocom from '@/components/photocom/photocom'

/**404**/
import NotFound from '@/components/notFound'

import store from '@/store/store'
Vue.use(Router)

if (sessionStorage.getItem('token')) {
	store.commit('set_token', sessionStorage.getItem('token'))
}


const router = new Router({
  routes: [
    {
      	path: '/',
      	name: 'Home',
      	meta:{index:1,requireAuth:true},
      	component: Home
    },
    {
      	path: '/setUp',
      	name: 'SetUp',
      	meta:{index:2,requireAuth:true},
      	component: SetUp
    },
    {
    		path: '/login',
    		name: 'Login',
    		meta:{index:0},
    		component: Login
    },
    {
    		path: '/scanCode',
    		name: 'ScanCode',
    		meta:{index:9,requireAuth:true},
    		component: ScanCode
    },
    {
    		path: '/equipment',
    		name: 'Equipment',
    		meta:{index:2,requireAuth:true},
    		component: Equipment
    },
    {
    		path: '/equiplist',
    		name: 'Equiplist',
    		meta:{index:3,requireAuth:true},
    		component: Equiplist
    },
    {
    		path: '/workList',
    		name: 'WorkList',
    		meta:{index:4,requireAuth:true},
    		component: WorkList
    },
    {
    		path: '/repairCenter',
    		name: 'RepairCenter',
    		meta:{index:5,requireAuth:true},
    		component: RepairCenter,
    },
    {
    		path:'/details',
    		name: 'Details',
    		meta:{index:6,requireAuth:true},
    		component: Details,
    },
    {
    		path: '/abnormallyReport',
    		name: 'AbnormallyReport',
    		meta:{index:9,requireAuth:true},
    		component: AbnormallyReport,
    },
    {
    		path: '/assPhotos',
    		name: 'AssPhotos',
    		meta:{index:10,requireAuth:true},
    		component: AssPhotos,
    },
    {
    		path: '/describe',
    		name: 'Describe',
    		meta:{index:10,requireAuth:true},
    		component: Describe,
    },
    {
    		path: '/faultTree',
    		name: 'FaultTree',
    		meta:{index:10,requireAuth:true},
    		component: FaultTree,
    },
     {
    		path: '/workInspect',
    		name: 'WorkInspect',
    		meta:{index:8,requireAuth:true},
    		component: WorkInspect,
    },
     {
    		path: '/workInspectlun',
    		name: 'WorkInspectlun',
    		meta:{index:7,requireAuth:true},
    		component: WorkInspectlun,
    },
    {
    		path: '/earlyWarning',
    		name: 'EarlyWarning',
    		meta:{index:4,requireAuth:true},
    		component: EarlyWarning,
    },
     {
    		path: '/earlyContent',
    		name: 'EarlyContent',
    		meta:{index:5,requireAuth:true},
    		component: EarlyContent,
    },
    {
    		path: '/archives',
    		name: 'Archives',
    		meta:{index:4,requireAuth:true},
    		component: Archives,
    },
    {
    		path: '/states',
    		name: 'States',
    		meta:{index:4,requireAuth:true},
    		component: States,
    },
    {
    		path: '/faultInfo',
    		name: 'FaultInfo',
    		meta:{index:9,requireAuth:true},
    		component: FaultInfo,
    },
    {
    		path: '/addReplace',
    		name: 'AddReplace',
    		meta:{index:10,requireAuth:true},
    		component: AddReplace,
    },
    {
    		path: '/addSparepart',
    		name: 'AddSparepart',
    		meta:{index:11,requireAuth:true},
    		component: AddSparepart,
    },
    {
    		path: '/camera',
    		name: 'Camera',
    		meta:{index:12,requireAuth:true},
    		component: Camera,
    },
    {
    		path: '/photocom',
    		name: 'Photocom',
    		meta:{index:13,requireAuth:true},
    		component: Photocom,
    },
    /**9大工单列表**/
    {
    		path: '/checklist',
    		name: 'checklist',
    		meta:{index:5,requireAuth:true},
    		component: checklist
    },
    {
    		path: '/patrollist',
    		name: 'patrollist',
    		meta:{index:5,requireAuth:true},
    		component: patrollist
    },
    {
    		path: '/dailylist',
    		name: 'dailylist',
    		meta:{index:5,requireAuth:true},
    		component: dailylist
    },
    {
    		path: '/lubricationlist',
    		name: 'lubricationlist',
    		meta:{index:5,requireAuth:true},
    		component: lubricationlist
    },
    /**9大工单处理**/
     {
    		path: '/workHandle1',
    		name: 'workHandle1',
    		meta:{index:8,requireAuth:true},
    		component: workHandle1,
    },
    {
    		path: '/workHandle2',
    		name: 'workHandle2',
    		meta:{index:8,requireAuth:true},
    		component: workHandle2,
    },
    {
    		path: '/workHandle3',
    		name: 'workHandle3',
    		meta:{index:8,requireAuth:true},
    		component: workHandle3,
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