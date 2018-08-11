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
						this.worklistData.worklistHandle = data.item[0];
						this.worklistData.worklistHandleData1.title = '点检';
						this.worklistData.worklistHandleData1.tablec = this.tablecdata();
						this.worklistData.worklistHandleData1.inspection = this.dataHandle(this.worklistData.worklistHandle.standardList[0]);
						this.worklistData.worklistHandleData1.total = this.worklistData.worklistHandle.standardList.length;
						this.worklistData.worklistHandleData1.page = 1;
					}
				})
			},
			tablecdata(){//表格数据
				return [
					{name:'计划日期',value:this.worklistData.worklistHandle.planDate},
					{name:'班次',value:this.worklistData.worklistHandle.planClass},	
					{name:'延期日期',value:this.worklistData.worklistHandle.delayDate},	
					{name:'点检类型',value:this.worklistData.worklistHandle.type},	
					{name:'点检日期',value:this.worklistData.worklistHandle.realTime},	
					{name:'专业',value:this.worklistData.worklistHandle.profession},	
					{name:'点检时间',value:this.worklistData.worklistHandle.submitTime},	
					{name:'点检人',value:this.worklistData.worklistHandle.Executor.name},
					{name:'点检结果',value:this.worklistData.worklistHandle.realExeResult}	
				]
			},
			dataHandle(d){
				let n = {};
				n.arr = [
					{name:'部位',value:d.position},
					{name:'点检项目',value:d.project},
					{name:'点检内容',value:d.content},
					{name:'点检基准',value:d.standard},
					{name:'点检方式',value:d.way},
					{name:'点检类型',value:d.type},
					{name:'正常范围',value:d.normalRead}
				];
				n.realRead = {name:'实际读数',value:d.realRead};
				n.exeResult = {name:'执行结果',value:d.exeResult};
				n.phone = {value:d.phone};
				return n;
			}
		},
		mounted(){
			this.getcheckdetaildata();
		}
	}
</script>

<style>
</style>