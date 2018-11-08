<template>
	<div class="details-box row-box">
		<div class="details-list">
			<routine-list name="设备" :value="listdata.equName"></routine-list>
			<routine-list name="部位" :value="listdata.positionName"></routine-list>
			<routine-list name="报修单号" :value="listdata.id"></routine-list>
			<routine-list name="上报级别" :value="listdata.reportLevel"></routine-list>
			<routine-list name="故障代码" :value="listdata.faultCode"></routine-list>
			<routine-list name="故障现象" :value="listdata.failureTxt"></routine-list>
			<photolist style="padding: 0.2rem 0.4rem 0;" ref="imgData" isFinish="false"></photolist>
			<routine-list name="异常描述" :value="listdata.abnormalTxt"></routine-list>
			<routine-list class="routine-noBorder" name="处理描述" :value="listdata.aProcedureTxt"></routine-list>
			<p class="interval"></p>
			<routine-list name="响应时间" :value="listdata.strResponseTime"></routine-list>
			<routine-list name="响应人" :value="listdata.responseName"></routine-list>
			<routine-list name="分配时间" :value="listdata.assignTime"></routine-list>
			<routine-list name="分配人" :value="listdata.assignerName"></routine-list>
			<routine-list name="工单状态" :value="listdata.woState"></routine-list>
			<routine-list name="关闭原因" :value="listdata.closeReason"></routine-list>
			<routine-list name="关闭时间" :value="listdata.closeTime"></routine-list>
			<routine-list class="routine-noBorder" name="关闭人" :value="listdata.closeManName"></routine-list>
			<p class="interval">处理信息</p>
			<routine-list name="计划日期" :value="listdata.pDate"></routine-list>
			<routine-list name="计划班次" :value="listdata.pShift"></routine-list>
			<routine-list name="下发时间" :value="listdata.strWoIssuedTime"></routine-list>
			<routine-list name="负责人" :value="listdata.aManager"></routine-list>
			<routine-list name="参与人" :value="listdata.userNames"></routine-list>
			<routine-list name="开始维修时间" :value="(listdata.startDate || '')+' '+(listdata.startTime || '')"></routine-list>
			<routine-list name="结束维修时间" :value="(listdata.endDate || '')+' '+(listdata.endTime|| '')"></routine-list>
			<routine-list name="维修结果" :value="listdata.aResult"></routine-list>
			<routine-list name="未解决原因" :value="listdata.unsolvedReason"></routine-list>
			<routine-list class="routine-noBorder" name="维修过程描述" :value="listdata.aMaintainTxt"></routine-list>
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
				img:[],
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
							this.$router.push('/states')
						}
					}
				],
				listdata:[]
			}
		},
		components:{ RoutineList,Photolist },
		methods:{
			getRepairCenterDetail(){//获取上报中心详单
				this.$store.commit('showLoading');
				this.$axios.get(this.$root.URL+'eom/api/repairCenter/detail/'+this.$route.query.id)
				.then(res => {
					this.$store.commit('hideLoading');
					let d = res.data;
					if(!d.result){
						this.listdata = d.obj;
						this.$refs.imgData.displayImg(d.obj.aImgBindId)
					}
				})
			}
		},
		activated(){
			this.getRepairCenterDetail();
			
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
			mui.back = function(){
				history.go(-1)//回退到上一页面
			}
		}
	}
</script>

<style>
	.details-box{
		width: 100%;
	}
	
</style>