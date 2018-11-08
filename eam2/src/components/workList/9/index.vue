<template>
	<wroklistc :listdata="listdata" ref="child" :query="$route.query" :operationc="operation" @putDelay="putDelay" pagelast="true" @getlistData="getlistData(true)"></wroklistc>
</template>

<script>
	/**
	 * 预防性检查工单列表
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
							this.$router.push({path:'/workHandle9',query:{...list}})
						}
					},
				],
			}
		},
		methods:{
			getlistData(type){//获取工单列表
				if(type){this.pageIndex = 1;this.$refs.child.allLoaded = false;};
				let sd = this.$store.state.screenActive;
				this.$store.commit('showLoading')
				this.$axios.get(this.$root.URL+'eom/api/preventCheck/list',{
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
						this.$MessageBox('提示','获取数据失败！')
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
				this.$axios.put(this.$root.URL+'eom/api/preventCheck/delay/'+this.$store.state.worklistData.worklisteQuKeyItem.id,{
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
			handle(d){
				return {
					icon:d.icon,
					info1:d.equName,
					info10:d.major,
					info3:d.failureTxt,
					info4:d.realDate,
					info5:d.woState,
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
				this.$store.state.repairData.title = '预防性检查工单';
				
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