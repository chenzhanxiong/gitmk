<template>
	<wroklistc :listdata="listdata" ref="child" :query="$route.query" :operationc="operation" @putDelay="putDelay" @getlistData="getlistData(true)"></wroklistc>
</template>

<script>
	/**
	*巡检工单列表
	**/
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
						info:'开始巡检',
						show:true,
						event:(list) => {
							this.$MessageBox.confirm('确认开始巡检？').then(action => {
								this.putStart(list)
							})
						}
					},
					{
						icon:'icon-wancheng',
						info:'完成',
						show:false,
						event:(list) => {
							this.$MessageBox.confirm('确认完成巡检？').then(action => {
								this.submitAll(list)
							})
						}
					},
					{
						icon:'icon-yanqi',
						info:'延期',
						show:true,
						event:(list) => {
							this.$refs.child.openPicker();
						}
					},
					{
						icon:'icon-weibiaoti--',
						info:'巡检详情',
						show:true,
						event:(list) => {
							this.$router.push({path:'/workHandle2',query:{...list}})
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
			getlistData(type){//获取巡检工单列表
				if(type){this.pageIndex = 1;this.$refs.child.allLoaded = false;};
				let sd = this.$store.state.screenActive;
				this.$store.commit('showLoading')
				this.$axios.get(this.$root.URL+'eom/api/line/list',{
					params:{
						params:{
							query:{
								equKeyId:this.$route.query.queryEquipmentId,//设备id
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
						this.$MessageBox('提示','获取数据失败！')
					}
				})
			},
			getScreen(){//查询筛选条件
				
				this.$axios.all([
					this.$axios.get(this.$root.URL+'eom/api/screen/shift'),
				]).then(this.$axios.spread((a) => {
					if(!a.data.result){
						this.screenData.pShift = a.data.items;
					}
					this.screenarr();
				}))
			},
			putStart(){//开始
				this.$store.commit('showLoading')
				this.$axios.put(this.$root.URL+'eom/api/line/start/'+this.$store.state.worklistData.worklisteQuKeyItem.id).then((res) => {
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
				this.$axios.put(this.$root.URL+'eom/api/line/delay/'+this.$store.state.worklistData.worklisteQuKeyItem.id,{
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
				this.$axios.put(this.$root.URL+'eom/api/line/submitAll/'+this.$store.state.worklistData.worklisteQuKeyItem.id).then((res) => {
					this.$store.commit('hideLoading')
					let d = res.data;
					if(!d.result){
						this.$Toast({message:'已完成!'});
						this.$refs.child.tabdata.isFinish = '1'
						this.getlistData(true)
					}else{
						if(list.isForce == '1'){
							this.$MessageBox.confirm('该路线为强制路线,必须完成全部项目,发现第<font color="red">'+d.errorMsg+'</font>项未保存<br/>是否跳转至该项？').then(() => {
								this.$router.push({path:'/workHandle2',query:{id:list.id,name:list.name,page:d.errorMsg}});
							})
						}else{
							this.$MessageBox.confirm('发现第<font color="red">'+d.errorMsg+'</font>项未保存<br/>是否跳转至该项？').then(() => {
								this.$router.push({path:'/workHandle2',query:{id:list.id,name:list.name,page:d.errorMsg}});
							})
						}
					}
				})
			},
			handle(d){
				return {
					icon:d.icon,
					info1:d.lineName.slice(0,8)+d.ratio,
					info2:'',
					info3:d.realDate+'/'+d.className,
					info4:d.inspectionReason,
					info5:d.trun,
					id:d.id,
					name:d.lineName,
					isFinish:d.isFinish,
					isdelay:d.isDelay,
					isIng:d.isIng,
					isForce:d.isForce,
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
							id:'pShift',
							name:'班次',
							category:this.screenData.pShift
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
						isDelay:'',
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
			
			next((vm)=>{
				vm.$refs.child.headfn();
			});
		},
		activated(){
			if(!this.$route.meta.isUseCache || this.listdata.length <= 0){
				this.pageIndex = 1;
				this.$store.state.repairData.title = '巡检工单';
				this.getScreen();
				//this.screenarr();
				
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