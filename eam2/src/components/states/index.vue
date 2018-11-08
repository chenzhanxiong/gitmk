<template>
	<div class="states-box row-box">
		<tables :datalist="datalist"  v-if="show"></tables>
		<not-found v-if="!show" kaifazhong="true"></not-found>
	</div>
	
</template>

<script>
	import Tables from '@/components/states/tables'
	import notFound from '@/components/notFound'
	export default{
		components:{Tables,notFound},
		data(){
			return{
				show:true,
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
		activated(){
			//this.$router.push({name:'notFound',params:{type:'kaifazhong'}})
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