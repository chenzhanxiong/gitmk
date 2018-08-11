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
						this.worklistData.worklistHandleData1.title = '保养';
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
					{name:'日保类型',value:d.delayDate},	
					{name:'专业',value:d.type},	
					{name:'延期日期',value:d.realTime},	
					{name:'责任人',value:d.Executor.name},	
					{name:'日保日期',value:d.submitTime},	
					{name:'点检结果',value:d.realExeResult}	
				]
			},
			dataHandle(d){
				let n = {};
				n.arr = [
					{name:'部位',value:d.position},
					{name:'保养内容',value:d.project},
					{name:'保养标准',value:d.content},
					{name:'来源类型',value:d.standard},
					{name:'开始时间',value:d.way},
					{name:'结束时间',value:d.type},
				];
				n.exeResult = {name:'保养结果',value:d.exeResult};
				n.phone = {value:d.phone};
				return n;
			},
			handleSubmit(){
				console.log(3);
			}
		},
		mounted(){
			this.getcheckdetaildata();
		}
	}
</script>

<style>
</style>