<template>
	<div class="workList-box row-box" v-cloak>
		<mt-loadmore :top-method="loadTop" :auto-fill="autofill" ref="loadmore">
			<div class="workList-ul">
				<worklist-list v-for="(list,i) in datalist" :key="i" :listdata="list"></worklist-list>
			</div>
		</mt-loadmore>
	</div>
</template>

<script>
	import worklistList from '@/components/assembly/worklistList'
	export default {
		name:'workList',
		data(){
			let repairData = this.$store.state.repairData;
			return{
				autofill:true,
				loading:false,
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
						html:'工单'
					}
				],
				iconlist:{
					'点检':'icon-jiancha',
					'巡检':'icon-xunjian',
					'日保':'icon-qingjie',
					'轮保':'icon-lunxunmoren',
					'周保':'icon-zhou',
					'润滑':'icon-runhuaji',
					'检修':'icon-jianxiu',
					'维修':'icon-weixiu',
					'预防性检查':'icon-yufang'
				},
				datalist:[]
			}
		},
		components:{ worklistList },
		methods:{
			loadTop(){
				this.getWoList();
			},
			getWoList(){
				this.$store.commit('showLoading')
				this.$axios.get('/wo/findList',{
					params:{
						equipmentId:'',
					}
				}).then((res) =>{
					this.$store.commit('hideLoading')
					let data = res.data;
					if(!data.result){
						data.items.forEach((e) => {
							e.icon = this.iconlist[e.name];
						})
						this.datalist = data.items;
						this.$refs.loadmore.onTopLoaded();
					}else{
						this.$MessageBox('提示',data.errorMsg)
					}
				}).catch((error) => {
					this.$store.commit('hideLoading');
					this.$MessageBox('提示','请求失败')
				})
			}
		},
		mounted(){
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
			this.getwolist();
		}
	}
</script>

<style>
	.workList-ul{
		padding: 0 0.2rem;
	}
</style>