<template>
	<div class="equip-box">
		<div class="equip-ul">
			<equip-list v-for="(list,i) in equList" :key="i" :listdata="list"></equip-list>
		</div>
	</div>
</template>

<script>
	import EquipList from '@/components/assembly/equipList'
	
	export default {
		name:'equlp',
		data(){
			return{
				headData:[
					{
						show:true,
						icon:'icon-miaozhun',
						event:() => {
							this.$router.back(-1);
						}
					},
					{
						show:true,
						input:true,
						html:'',
						event:() => {
							
						}
					},
					{
						show:true,
						icon:'icon-saomiao',
						event:() => {
							this.$router.push({path:'/scanCode'})
						}
					}
				],
				equList:[
					{
						state:true,
						href:'/equiplist',
						name:'1#卷接机',
						statelist:[3,2,4]
					},
					{
						state:true,
						href:'/equiplist',
						name:'2#卷接机',
						statelist:[3,2,4]
					},
					{
						state:true,
						href:'/equiplist',
						name:'3#卷接机',
						statelist:[3,2,4]
					},
					{
						state:false,
						href:'/equiplist',
						name:'4#卷接机',
						statelist:[]
					}
				]
			}
		},
		components:{EquipList },
		mounted(){
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
		}
	}
</script>

<style>
	.equip-box{
		width: 100%;
	}
	.equip-ul{
		padding: 0 0.2rem;
	}
</style>