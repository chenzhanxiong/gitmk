<template>
	<wroklistc :listdata="listdata" ref="child" :query="$route.query" :operationc="operation" pagelastNone="true" @putDelay="putDelay" @getlistData="getlistData(true)"></wroklistc>
</template>

<script>
	//轮保工单列表 
	import wroklistc from '@/components/workList/worklistc'
	import {mapState} from 'vuex';
	export default{
		components:{wroklistc},
		computed:{
			...mapState(['worklistData']),
		},
		data(){
			return{
				listdata:[],
				pageIndex:1,
				operation:[
					{
						icon:'icon-kaishi',
						info:'开始',
						show:true,
						event:(list) => {
							this.$MessageBox.confirm('确认开始轮保？').then(action => {
								this.putStart();
							})
						}
					},
					{
						icon:'icon-wancheng',
						info:'完成',
						show:false,
						event:(list) => {
							this.$MessageBox.confirm('确认完成该工单？','').then(action => {
								this.submitAll(list)
							})
						}
					},
// 					{
// 						icon:'icon-yanqi',
// 						info:'延期',
// 						show:true,
// 						event:() => {
// 							this.$refs.child.openPicker();
// 						}
// 					},
					{
						icon:'icon-weibiaoti--',
						info:'轮保详情',
						show:true,
						event:(list) => {
							this.$router.push({path:'/detailLun4',query:{...list}});
						}
					},
				],
				screenData:{
					pShift:[],
					majorId:[],
					orderClass:[]
				}
			}
		},
		methods:{
			getlistData(type){//获取轮保工单列表
				if(type){this.pageIndex = 1;this.$refs.child.allLoaded = false;};
				let sd = this.$store.state.screenActive;
				this.$store.commit('showLoading')
				this.$axios.get(this.$root.URL+'eom/api/turn/list',{
					params:{
						params:{
							query:{
								equKeyId:this.$route.query.queryEquipmentId,
								...sd,
								isFinish:this.$refs.child.tabdata.isFinish//是否完成
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
						this.$refs.child.$refs.loadmore.onBottomLoaded();
					};
					let data = res.data;
					if(!data.result){
						if(this.pageIndex >= data.totalPages && !type){
							this.$refs.child.allLoaded = true;
						}
						this.pageIndex ++;
						if(type){
							this.listdata = [];
						};
						data.item.forEach((e) => {
							e.icon = 'icon-donghuanshebeiguanli';
							this.listdata = this.listdata.concat(this.handle(e))
						})
					}else{
						this.$MessageBox('提示','查询失败!');
					}
				})
			},
			putStart(){//开始
				this.$store.commit('showLoading')
				this.$axios.put(this.$root.URL+'eom/api/turn/start/'+this.$store.state.worklistData.worklisteQuKeyItem.id).then((res) => {
					this.$store.commit('hideLoading')
					let d = res.data;
					if(!d.result){
						this.$Toast({message:'工单开始!'});
						this.getlistData(true)
					}else{
						this.$MessageBox('提示',d.errorMsg);
					}
				})
			},
			putDelay(data){//提交延期
				let time = new Date(data) - new Date(this.$store.state.worklistData.worklisteQuKeyItem.idate);
				if(time < 0){
					this.$MessageBox('提示','延期日期不能小于计划日期!');
					return false
				}
				this.$store.commit('showLoading')
				this.$axios.put(this.$root.URL+'eom/api/turn/delay/'+this.$store.state.worklistData.worklisteQuKeyItem.id,{
					workorderDelaydate:data
				}).then((res) => {
					this.$store.commit('hideLoading')
					let d = res.data;
					if(!d.result){
						this.$Toast({message:'延期成功!'});
						this.getlistData(true)
					}else{
						this.$MessageBox('提示','延期失败!');
					}
				})
			},
			submitAll(list){//提交完成
				this.$store.commit('showLoading')
				this.$axios.put(this.$root.URL+'eom/api/turn/submitAll/'+this.$store.state.worklistData.worklisteQuKeyItem.id).then((res) => {
					this.$store.commit('hideLoading')
					let d = res.data;
					if(!d.result){
						this.$Toast({message:'已完成!'});
						this.$refs.child.tabdata.isFinish = '1'
						this.getlistData(true)
					}else{
						let msg = JSON.parse(d.errorMsg);
						let ty = {
							'0':'保养任务',
							'1':'维修任务'
						}
						this.$MessageBox.confirm('发现<font color="red">'+ty[msg.ident]+'</font>第<font color="red">'+msg.num+'</font>项未保存<br/>是否跳转至该项？').then(() => {
							this.$router.push({path:'/workHandle4',query:{id:list.id,name:list.name,msg:msg}});
						})
					}
				})
			},
			handle(d){//整理格式
				return {
					icon:d.icon,
					info1:d.equName,
					info2:'',
					info3:d.realDate,
					info4:'',
					info5:d.dutyPerson,
					id:d.id,
					name:d.equName,
					isFinish:d.isFinish,
					isIng:d.isIng,
					isdelay:d.isDelay,
					idate:d.realDate,
					operation:false
				}
			},
			screendata(d){
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
							id:'isDelay',
							name:'是否延期',
							category:[
								{value:'0',text:'正常'},
								{value:'1',text:'延期'},
							]
						}
					],
					screenActive:{
						strDate:'',
						pShift:'',
						majorId:'',
						orderClass:'',
						isDelay:''
					}
				}
			},
			screenarr(){
				let d = this.screendata();
				this.$store.state.screenlist = d.screenlist;
				this.$store.state.screenActive = d.screenActive;
				this.getlistData(true);
			}
		},
		watch:{
			
		},
		beforeRouteEnter(to, from, next){
			if(from.name == 'WorkInspectlun'){
				to.meta.isUseCache = true;
			}
			next((vm)=>{
				vm.$refs.child.headfn();
			});
		},
		beforeRouteLeave(to, from, next){
			if(to.name == 'WorkInspectlun'){
				to.meta.isUseCache = false;
			}
			next()
		},
		activated(){
			if(!this.$route.meta.isUseCache || this.listdata.length <= 0){
				this.pageIndex = 1;
				this.$store.state.repairData.title = '轮保工单';
				//this.getScreen();
				this.screenarr();
				
			}
			mui.back = function(){
				history.go(-1)//回退到上一页面
			}
		},
		mounted(){
			
		}
	}
</script>

<style>
</style>