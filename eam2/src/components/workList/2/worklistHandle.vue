<template>
	<work></work>
</template>

<script>
	import {mapState} from 'vuex';
	import work from '@/components/workList/workInspect'
	export default{
		components:{work},
		computed:{
			...mapState(['worklistData'])
		},
		data(){
			return{
				num:0
			}
		},
		methods:{
			getcheckdetaildata(){
				this.$axios.get('/static/data.json',{
					params:{
						woId:'',
					}
				}).then((res) => {
					let data = res.data.detail;
					if(data.result){
						let dd = this.worklistData.worklistHandle = data.item;
						this.worklistData.worklistHandleData1.title = '巡检';
						this.worklistData.worklistHandleData1.tablec = this.tablecdata(dd[0]);
						this.worklistData.worklistHandleData1.inspection = this.dataHandle(dd[0].standardList[0]);
						this.worklistData.worklistHandleData1.total = dd[0].standardList.length;
						this.worklistData.worklistHandleData1.page = 1;
					}
				})
			},
			tablecdata(d){//表格数据
				return [
					{name:'计划日期',value:d.planDate},
					{name:'班次',value:d.planClass},	
					{name:'延期日期',value:d.delayDate},	
					{name:'巡检日期',value:d.realTime},	
					{name:'开始时间',value:d.profession},	
					{name:'结束时间',value:d.submitTime},
					{name:'巡检结果',value:d.realExeResult},
					{name:'巡检人',value:d.ExecutorName}
				]
			},
			dataHandle(d){
				let n = {};
				n.arr = [
					{name:'部位',value:d.position},
					{name:'巡检项目',value:d.project},
					{name:'巡检内容',value:d.content},
					{name:'巡检基准',value:d.standard},
					{name:'巡检方式',value:d.way},
					{name:'巡检点类型',value:d.type},
					{name:'正常范围',value:d.normalRead}
				];
				n.realRead = {name:'实际读数',value:d.realRead};
				n.exeResult = {name:'巡结果',value:d.exeResult};
				n.phone = {value:d.phone};
				return n;
			},
			handleSubmit(){
				console.log(2);
			}
		},
		mounted(){
			this.getcheckdetaildata();
		}
	}
</script>

<style>
</style>