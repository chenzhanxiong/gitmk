<template>
	<div class="states-box">
		<tables :datalist="datalist"></tables>
	</div>
</template>

<script>
	import Tables from '@/components/states/tables'
	export default{
		components:{Tables},
		data(){
			return{
				datalist:{
					ahead:['序号','部位','测量值','趋势','异常上报'],
					abody:[
						{info1:'1',info2:'2dm412aa10',info3:'温度',info4:'',info5:''},
						{info1:'1',info2:'2dm412aa10',info3:'温度',info4:'',info5:''},
						{info1:'1',info2:'2dm412aa10',info3:'温度',info4:'',info5:''},
						{info1:'1',info2:'2dm412aa10',info3:'温度',info4:'',info5:''}
					]
				}
			}
		},
		mounted(){
			this.$store.state.heads.show = 'statesShow';
			//this.$store.state.heads.headData = this.headData;
		}
	}
</script>

<style>
	.states-box{
		width: 100%;
	}
	
</style>