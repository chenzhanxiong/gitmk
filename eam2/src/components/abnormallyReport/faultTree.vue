<template>
	<div class="faulttree-box">
		<fault-list v-for="(list,i) in faultlist" :key="i" :listdata="list"></fault-list>
	</div>
</template>

<script>
	import FaultList from '@/components/assembly/faultList'
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
						html:'故障树'
					},
					{
						show:true,
						html:'保存',
						event:() => {
							this.$router.back(-1);
						}
					}
				],
				faultlist:[
					{
						name:'故障现象',
						info:'故障原因',
						probability:'30%'
					},
					{
						name:'故障现象',
						info:'故障原因',
						probability:'30%'
					},
					{
						name:'故障现象',
						info:'故障原因',
						probability:'30%'
					},
					{
						name:'故障现象',
						info:'故障原因',
						probability:'30%'
					}
				]
			}
			
		},
		components:{ FaultList },
		mounted(){
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
		}
	}
</script>

<style>
	.faulttree-box{
		width: 100%;
	}
</style>