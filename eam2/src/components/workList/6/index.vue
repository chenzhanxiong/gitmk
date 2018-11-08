<template>
	<wroklistc :listdata="listdata" ref="child" :query="$route.query" :operationc="operation" @putDelay="putDelay" @getlistData="getlistData(true)"></wroklistc>
</template>

<script>
	/**
	 * 润滑工单列表
	 */
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
						icon:'icon-wancheng',
						info:'完成',
						show:true,
						event:(list) => {
							this.$MessageBox.confirm('确定全部完成？').then(action => {
								this.submitAll(list)
							})
						}
					},
					{
						icon:'icon-yanqi',
						info:'延期',
						show:true,
						event:() => {
							this.$refs.child.openPicker();
						}
					},
					{
						icon:'icon-weibiaoti--',
						info:'设备详情',
						show:true,
						event:(list) => {
							this.$router.push({path:'/workHandle6',query:{...list}})
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
			getlistData(type){//获取点检工单列表
				//type判断是下拉加载还是检索 true为检索
				if(type){this.pageIndex = 1;this.$refs.child.allLoaded = false;};
				let sd = this.$store.state.screenActive;
				this.$store.commit('showLoading')
				this.$axios.get(this.$root.URL+'eom/api/lubrication/list',{
					params:{
						params:{
							query:{
								equKeyId:this.$route.query.queryEquipmentId,
								...sd,
								isFinish:this.$refs.child.tabdata.isFinish//是否完成
							},
							pager:{
								pageIndex:this.pageIndex,
								pageSize:8
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
					this.$axios.get(this.$root.URL+'eom/api/screen/class/'+this.$route.query.code)
				]).then(this.$axios.spread((a,b) => {
					if(!a.data.result){
						this.screenData.pShift = a.data.items;
					}
					if(!b.data.result){
						this.screenData.orderClass = b.data.items;
					}
					this.screenarr()
				}))
			},
			putDelay(data){//提交延期
				let time = new Date(data) - new Date(this.$store.state.worklistData.worklisteQuKeyItem.idate);
				if(time < 0){
					this.$MessageBox('提示','延期日期不能小于计划日期!');
					return false
				}
				this.$store.commit('showLoading')
				this.$axios.put(this.$root.URL+'eom/api/lubrication/delay/'+this.$store.state.worklistData.worklisteQuKeyItem.id,{
					dDate:data
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
			submitAll(list){//提交全部
				this.$store.commit('showLoading')
				this.$axios.put(this.$root.URL+'eom/api/lubrication/submitAll/'+this.$store.state.worklistData.worklisteQuKeyItem.id).then((res) => {
					this.$store.commit('hideLoading')
					let d = res.data;
					if(!d.result){
						this.$Toast({message:'提交成功!'});
						this.$refs.child.tabdata.isFinish = '1'
						this.getlistData(true)
					}else{
						this.$MessageBox('提示',d.errorMsg)
					}
				})
			},
			handle(d){
				return {
					icon:d.icon,
					info1:d.equName,
					info2:'',
					info3:d.realDate+'/'+d.realClass,
					info4:d.aResult,
					info5:d.oamClass,
					id:d.id,
					name:d.equName,
					isFinish:d.isFinish,
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
							id:'pShift',
							name:'班次',
							category:this.screenData.pShift
						},
						
						{
							id:'orderClass',
							name:'润滑分类',
							category:this.screenData.orderClass
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
			
			next((vm)=>{
				vm.$refs.child.headfn();
			});
		},
		activated(){
			if(!this.$route.meta.isUseCache || this.listdata.length <= 0){
				this.pageIndex = 1;
				this.$store.state.repairData.title = '润滑工单';
				
				this.getScreen();
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