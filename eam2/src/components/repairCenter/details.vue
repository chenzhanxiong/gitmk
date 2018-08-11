<template>
	<div class="details-box row-box">
		<div class="details-list">
			<routine-list v-for="(list,i) in listdata" v-if="i < 5" :key="'a'+i" :listdata="list"></routine-list>
			<photolist style="padding: 0.2rem 0.4rem 0;" :listdata="listdata[5].img"></photolist>
			<routine-list :key="'a'+5" :listdata="listdata[5]"></routine-list>
			<p class="interval"></p>
			<routine-list v-for="(list,i) in twolistdata" :key="'b'+i" :listdata="list"></routine-list>
			<p class="interval">处理信息</p>
			<routine-list v-for="(list,i) in thrlistdata" :key="'c'+i" :listdata="list"></routine-list>
			<p class="interval"></p>
			<div class="list-model"></div>
		</div>
	</div>
</template>

<script>
	import RoutineList from '@/components/assembly/routineList'
	import Photolist from '@/components/assembly/photolist'
	export default{
		data(){
			return{
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
						html:'异常/故障'
					},
					{
						show:true,
						html:'状态',
						event:() => {
							
						}
					}
				],
				listdata:[
					{
						name:'设备',
						porp:'1#设备',
						href:'/'
					},
					{
						name:'部位',
						porp:'部位1',
						href:'/'
					},
					{
						name:'上报级别',
						porp:'一般故障',
						href:'/'
					},
					{
						name:'故障代码',
						porp:'10001',
						href:'/'
					},
					{
						name:'故障现象',
						porp:'刀盘5天后到期',
						href:'/'
					},
					{
						name:'异常描述',
						porp:'漏油有磨损货梯--距离到期时间小于10天货梯--距离到期时间小于',
						href:'/',
						img:['./build/logo.png','./build/logo.png','./build/logo.png'],
					},
					{
						name:'处理描述',
						porp:'已更换零件',
						href:'/'
					}
				],
				twolistdata:[
					{
						name:'响应时间',
						porp:'2016-07-09 15:34:03',
					},
					{
						name:'响应人',
						porp:'王勇',
					},
					{
						name:'分配时间',
						porp:'',
					},
					{
						name:'分配人',
						porp:'',
					},
					{
						name:'工单状态',
						porp:'',
					},
					{
						name:'关闭原因',
						porp:'',
					},
					{
						name:'关闭时间',
						porp:'',
					},
					{
						name:'关闭人',
						porp:'',
					}
				],
				thrlistdata:[
					{
						name:'计划日期',
						porp:'2016-07-09'
					},
					{
						name:'计划班次',
						porp:''
					},
					{
						name:'下发时间',
						porp:'2016-07-09 15:34:03'
					},
					{
						name:'负责人',
						porp:'王勇'
					},
					{
						name:'参与人',
						porp:'刘波'
					},
					{
						name:'开始维修时间',
						porp:'2016-07-09 15:34:03'
					},
					{
						name:'结束维修时间',
						porp:'2016-07-09 15:34:03'
					},
					{
						name:'维修结果',
						porp:''
					},
					{
						name:'未解决原因',
						porp:''
					},
					{
						name:'维修过程描述',
						porp:''
					}
				]
			}
		},
		components:{ RoutineList,Photolist },
		mounted(){
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
		}
	}
</script>

<style>
	.details-box{
		width: 100%;
	}
	
</style>