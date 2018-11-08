<template>
	<div class="eam-tablec">
		<ul>
			<li v-for="(list,i) in listdata" :key="i">{{list.name}}：{{list.value}}</li>
			<li v-if="(listdata.length)%2 != 0"></li>
		</ul>
		<ul class="table100" v-if="dataL">
			<li v-for="(list,i) in dataL" :key="i">{{list.name}}：{{list.value}}</li>
		</ul>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				
			}
		},
		props:['listdata','dataL']
	}
</script>

<style>
	.eam-tablec{
		width: 100%;
	}
	.eam-tablec ul{
		width: 100%;
		padding: 0 0.3rem;
		overflow: hidden;
	}
	.eam-tablec ul li{
		float: left;
		width: 50%;
		border:0.02rem solid #DEDEDE;
		border-top-width: 0;
		border-left-width: 0;
		line-height: 0.65rem;
		height: 0.65rem;
		padding: 0 0.3rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.eam-tablec ul li:nth-child(even){
		border-right-width: 0;
	}
	.table100 li{
		width: 100% !important;
		border-right-width: 0 !important;
	}
</style>