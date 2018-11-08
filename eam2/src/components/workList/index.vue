<template>
	<div class="workList-box row-box" v-cloak>
		<mt-loadmore v-show="datalist.length > 0" :top-method="loadTop" :auto-fill="autofill" ref="loadmore">
			<div class="workList-ul">
				<worklist-list v-for="(list,i) in datalist" :key="i" :listdata="list"></worklist-list>
			</div>
		</mt-loadmore>
		<not-found v-show="datalist.length <= 0" not="not"></not-found>
	</div>
</template>

<script>
	import worklistList from '@/components/assembly/worklistList'
	import notFound from '@/components/notFound'
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
		components:{ worklistList,notFound },
		methods:{
			loadTop(){
				this.getWoList();
			},
			getWoList(){
				this.$store.commit('showLoading')
				this.$axios.get(this.$root.URL+'eom/api/wo/findList',{
					params:{
						equipmentId:this.$route.query.id || ''
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
						this.$MessageBox('提示','获取数据失败！')
					}
				})
			},
			headfn(){
				this.$store.state.heads.show = true;
				this.$store.state.heads.headData = this.headData;
			}
		},
		beforeRouteEnter(to, from, next){
			if(from.name == 'Home' || from.name == 'Equiplist'){
				to.meta.isUseCache = false;
				
			}else{
				to.meta.isUseCache = true;
			}
			next(vm => {
				if(from.name == 'Equiplist'){
					vm.headData[1].html = '工单（'+vm.$route.query.name+'）'
				}else{
					vm.headData[1].html = '工单'
				}
				vm.headfn();
			})
		},
		beforeRouteLeave(to,from,next){
			to.meta.isUseCache = false;
			next()
		},
		activated(){
			this.getWoList();
			mui.back = function(){
				history.go(-1)//回退到上一页面
			}
		},
	}
</script>

<style>
	.workList-ul{
		padding: 0 0.2rem;
	}
</style>