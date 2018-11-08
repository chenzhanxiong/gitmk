import Vue from 'vue'
import Router from 'vue-router'
const login = r => require.ensure( [], () => r (require('@/components/login')))
const home = r => require.ensure( [], () => r (require('@/components/home')))

const jtMaintain = r => require.ensure( [], () => r (require('@/components/jt/jtMaintain')))
const jtCheck = r => require.ensure( [], () => r (require('@/components/jt/jtCheck')))
const jtFunction = r => require.ensure( [], () => r (require('@/components/jt/jtFunction')))
const jtRepair = r => require.ensure( [], () => r (require('@/components/jt/jtRepair')))

const check = r => require.ensure( [], () => r (require('@/components/admin/check')))
const lubrication = r => require.ensure( [], () => r (require('@/components/admin/lubrication')))
const repair = r => require.ensure( [], () => r (require('@/components/admin/repair')))
const round = r => require.ensure( [], () => r (require('@/components/admin/round')))
const planMain = r => require.ensure( [], () => r (require('@/components/admin/planMain')))
const inspection = r => require.ensure( [], () => r (require('@/components/admin/inspection')))

const partsLibrary = r => require.ensure( [], () => r (require('@/components/archives/partsLibrary')))

Vue.use(Router)

import store from '@/store/store'
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
		path: '/login',
		name: 'login',
		meta:{index:0,keepAlive:true},
		component: login
	},
	{
		path: '/',
		name: 'home',
		meta:{index:1,requireAuth:true,keepAlive:true,isUseCache:false},
		component: home
	},
	{
		path: '/jtMaintain',
		name: 'jtMaintain',
		meta:{index:2,requireAuth:true,keepAlive:true,isUseCache:false},
		component: jtMaintain
	},
	{
		path: '/jtCheck',
		name: 'jtCheck',
		meta:{index:2,requireAuth:true,keepAlive:true,isUseCache:false},
		component: jtCheck
	},
	{
		path: '/jtFunction',
		name: 'jtFunction',
		meta:{index:2,requireAuth:true,keepAlive:true,isUseCache:false},
		component: jtFunction
	},
	{
		path: '/jtRepair',
		name: 'jtRepair',
		meta:{index:3,requireAuth:true,keepAlive:true,isUseCache:false},
		component: jtRepair
	},
	{
		path: '/check',
		name: 'check',
		meta:{index:2,requireAuth:true,keepAlive:true,isUseCache:false},
		component: check
	},
	{
		path: '/lubrication',
		name: 'lubrication',
		meta:{index:2,requireAuth:true,keepAlive:true,isUseCache:false},
		component: lubrication
	},
	{
		path: '/repair',
		name: 'repair',
		meta:{index:2,requireAuth:true,keepAlive:true,isUseCache:false},
		component: repair
	},
	{
		path: '/planMain',
		name: 'planMain',
		meta:{index:2,requireAuth:true,keepAlive:true,isUseCache:false},
		component: planMain
	},
	{
		path: '/round',
		name: 'round',
		meta:{index:2,requireAuth:true,keepAlive:true,isUseCache:false},
		component: round
	},
	{
		path: '/inspection',
		name: 'inspection',
		meta:{index:2,requireAuth:true,keepAlive:true,isUseCache:false},
		component: inspection
	},
	{
		path: '/partsLibrary',
		name: 'partsLibrary',
		meta:{index:2,requireAuth:true,keepAlive:true,isUseCache:false},
		component: partsLibrary
	},
	]
})

router.beforeEach((to, from, next) => {
	if(to.name == 'login'){
		store.state.headData = false
	}else{
		store.state.headData = true
	}
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
