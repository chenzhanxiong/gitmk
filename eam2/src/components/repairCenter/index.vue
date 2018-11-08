<template>
	<div class="repair-box row-box">
		<div class="repair-tab">
			<span v-for="(list,i) in tabdata.tabhead" :key="i" :class="{active:i == tabdata.currentView}" @click="tabdata.currentView = i;getlistData(true)">{{list}}</span>
		</div>
		<div class="repair-ul">
			<mt-loadmore v-show="listdata.length > 0" :bottom-method="loadbottom" :bottom-all-loaded="allLoaded" :auto-fill="autofill" ref="loadmore">
				<div class="repairlist-box" @click="listClick(list)" v-for="(list,i) in listdata" :key="i">
					<span class="reqair-list border-bottom" :class="{vnew:list.vnew}">
						<span class="left-icon"><i class="iconfont" :class="list.icon"></i></span>
						<div class="content-page">
							<p>{{list.failureTxt || list.abnormalTxt}}</p>
							<p>{{list.callTime}}</p>
						</div>
						<div class="content-name">
							<p>{{list.equName}}</p>
							<p>{{list.repairSource}}</p>
						</div>
						<div class="right-arr">
							<i class="iconfont icon-add"></i>
							<p>{{list.reportLevel}}</p>
						</div>
					</span>
				</div>
			</mt-loadmore>
			<div class="baseline" v-if="allLoaded">我是有底线的</div>
			<not-found v-show="listdata.length <= 0" not="not"></not-found>
		</div>
		<right-pop ref="rightpop" @getlistData="getlistData(true)"></right-pop>
		
	</div>
</template>

<script>
	import notFound from '@/components/notFound'
	import RightPop from '@/components/assembly/rightPop'
	export default {
		name:'repairCenter',
		data(){
			let repairData = this.$store.state.repairData;
			return{
				rightpop:false,
				autofill:false,
				allLoaded:false,
				pageIndex:1,
				pickerValue:new Date(),
				headData:[
					{
						show:true,
						icon:'icon-fanhui',
						event:() => {
							this.$router.back(-1);
						}
					},
					{
						show:true,
						input:false,
						html:'报修中心'
					},
					{
						show:true,
						icon:'icon-shaixuan',
						event:() => {
							this.$refs.rightpop.popsild()
						}
					}
				],
				child:Screen,
				tabdata:{
					currentView:'0',
					tabhead:['未关闭','已关闭'],
				},
				listdata:[],
				screenData:{
					repairlassfy:'',
					workNature:'',
					repairSource:'',
					woState:''
				}
			}
		},
		components:{ RightPop,notFound },
		methods:{
			popcomplete(){
				this.popupVisible = !this.popupVisible;
			},
			handleConfirm(data){
				console.log(data)
			},
			loadbottom(){//下拉刷新
				this.getlistData(false)
			},
			listClick(list){//列表跳转
				this.$router.push({
					path:'/details',
					query:{id:list.id}
				})
			},
			getlistData(type){//获取报修中心列表
				if(type){this.pageIndex = 1;this.allLoaded = false;};
				let sd = this.$store.state.screenActive;
				this.$store.commit('showLoading')
				this.$axios.get(this.$root.URL+'eom/api/repairCenter/list',{
					params:{
						params:{
							query:{
								equKeyId:this.$route.query.id || '',
								...sd,
								isClose:this.tabdata.currentView//是否关闭
							},
							pager:{
								pageIndex:this.pageIndex,
								pageSize:10
							}
						}
					}
				}).then((res) => {
					this.$store.commit('hideLoading')
					if(!type){
						this.$refs.loadmore.onBottomLoaded();
					}
					let data = res.data;
					if(!data.result){
						if(this.pageIndex >= data.totalPages && !type){
							this.allLoaded = true;
						}
						this.pageIndex ++;
						if(type){
							this.listdata = [];
						};
						data.item.forEach((e) => {
							e.icon = 'icon-guzhangkuaicha';
							this.listdata = this.listdata.concat(e)
						})
					}else{
						this.$MessageBox('提示','获取数据失败!');
					}
				})
			},
			getScreen(){//查询筛选条件
				this.$axios.all([
					this.$axios.get(this.$root.URL+'eom/api/screen/repairlassfy'),
					this.$axios.get(this.$root.URL+'eom/api/screen/workNature'),
					//this.$axios.get(this.$root.URL+'eom/api/screen/repairSource'),
					this.$axios.get(this.$root.URL+'eom/api/screen/woState')

				]).then(this.$axios.spread((a,b,c) => {
					if(!a.data.result){
						this.screenData.repairlassfy = a.data.items;
					}
					if(!b.data.result){
						this.screenData.workNature = b.data.items;
					}
// 					if(!c.data.result){
// 						this.screenData.repairSource = c.data.items;
// 					}
					if(!c.data.result){
						this.screenData.woState = c.data.items;
					}
					this.screenarr()
				}))
			},
			screendata(){//整理筛选条件
				return {
					screenlist:[
						{
							id:'strDate',
							name:'日期',
							category:[
								{value:'0',text:'今日'},
								{value:'1',text:'一周之内'},
								{value:'2',text:'一周之外'}
							]
						},
						{
							id:'repairClassfyId',
							name:'报修分类',
							category:this.screenData.repairlassfy
						},
						{
							id:'workNatureId',
							name:'工作性质',
							category:this.screenData.workNature
						},
// 						{
// 							id:'repairSourceId',
// 							name:'报修来源',
// 							category:this.screenData.repairSource
// 						},
						{
							id:'woStateId',
							name:'状态',
							category:this.screenData.woState
						}
					],
					screenActive:{
						strDate:'',
						repairClassfyId:'',
						workNatureId:'',
						//repairSourceId:'',
						woStateId:''
					}
				}
			},
			screenarr(){//赋值筛选条件
				let d = this.screendata();
				this.$store.state.screenlist = d.screenlist;
				this.$store.state.screenActive = d.screenActive;
				this.getlistData(true);
			}
			
		},
		beforeRouteEnter(to, from, next){
			if(from.name == 'Details'){
				to.meta.isUseCache = true
			}else{
				to.meta.isUseCache = false
			}
			next();
		},
		activated(){
			if(!this.$route.meta.isUseCache){
				this.autofill = false;
				this.allLoaded = false;
				this.pageIndex = 1;
				
				//this.screenarr()
				this.getScreen();
			}
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
			mui.back = function(){
				history.go(-1)//回退到上一页面
			}
		}
	}	
</script>

<style>
	.repair-box{
		width: 100%;
	}
	
</style>