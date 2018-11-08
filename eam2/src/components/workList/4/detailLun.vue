<template>
	<div class="workInspectlun-box row-box">
		<tablec v-if="show" :listdata="listdata"></tablec>
		<div v-if="show" class="workinspect-list">
			<h3 class="workinspect-title">轮保设备</h3>
			<ul class="workinspect-ul">
				<li>
					<div class="workinspect-list border-bottom" @click="listclick()">
						<span><i class="iconfont icon-donghuanshebeiguanli"></i></span>
						<span>{{items.equName}}</span>
						<i class="iconfont icon-add"></i>
					</div>
				</li>
			</ul>
		</div>
		<not-found v-if="!show" not="not"></not-found>
	</div>
</template>

<script>
	import Tablec from '@/components/assembly/tablec'
	import notFound from '@/components/notFound'
	import {mapState} from 'vuex'
	export default{
		components:{ Tablec,notFound },
		computed:{
			...mapState(['worklistData'])
		},
		data(){
			return{
				show:false,//判断数据是否加载完成
				headData:[//title数据
					{
						show:true,
						icon:'icon-fanhui',
						close:true,
						event:() => {
							this.$router.back(-1);
						}
					},
					{
						show:true,
						input:false,
						html:'',
					}
				],
				datalist:[],//列表数据
				listdata:[],//表格数据
				items:''//总数据
			}
		},
		methods:{
			getPeriodFindDetail(){//获取数据
				this.show = false;
				this.$store.commit('showLoading')
				this.$axios.get(this.$root.URL+'eom/api/turn/detail/'+this.$route.query.id).then((res) => {
					this.show = true;
					this.$store.commit('hideLoading')
					let d = res.data;
					if(!d.result){
						this.items = d.obj;
						this.listdata = this.tablecdata(d.obj);
						this.datalist = d.obj.equNames;
					}else{
						this.$MessageBox('提示','获取数据失败！')
					}
				})
			},
			tablecdata(d){//整理表格数据
				let type = d.isFinish == "0"?false:true;//判断是否完成
				let status = {
					'NEW':'新建',
					'DLY':'延期',
					'ING':'执行中',
					'SFI':'现场完成',
					'SCK':'现场检查',
					'FIN':'已完成',
					'CHK':'已检查'
				};
				return [
					{name:'计划日期',value:d.pStartDate},
					{name:'工单状态',value:status[d.workorderStatus]},
					//{name:'延期日期',value:d.workorderDelaydate || '未延期'},	
					{name:'计划开始时间',value:d.pStartTime},	
					{name:'计划结束时间',value:d.pEndTime},	
					{name:'下发时间',value:d.issuedTime},	
					{name:'负责人',value:d.dutyPerson},	
					{name:'实际开始时间',value:d.startTime || '未开始'},
					{name:'实际结束时间',value:d.endTime || '未结束'},
					{name:'参与人',value:d.joinPerson},
				]
				
			},
			listclick(){//判断工单类型跳转子页面
				this.$router.push({
					path:'/workHandle4',
					query:{...this.items}
				})
			}
		},
		beforeRouteEnter(to, from, next){
			next(vm => {
				if(from.meta.index < to.meta.index){
					vm.getPeriodFindDetail();
				}
			});
		},
		activated(){
			this.headData[1].html = this.$route.query.name;//修改title
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
			mui.back = function(){
				history.go(-1)//回退到上一页面
			}
		}
	}
</script>

<style>
	
</style>