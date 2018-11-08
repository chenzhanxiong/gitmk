<template>
	<div class="equip-box row-box">
		<div class="equip-ul">
			<mt-loadmore v-show="equList.length > 0" :bottom-method="loadbottom" :bottom-all-loaded="allLoaded" :auto-fill="autofill" ref="loadmore">
				<equip-list v-for="(list,i) in equList" :key="i" :listdata="list"></equip-list>
			</mt-loadmore>
			<div class="baseline" v-if="allLoaded">我是有底线的</div>
			<not-found v-show="equList.length <= 0" not="true"></not-found>
		</div>
	</div>
</template>

<script>
	import EquipList from '@/components/assembly/equipList'
	import notFound from '@/components/notFound'
	const delay = (function() {
		let timer = 0;
		return function(callback, ms) {
			clearTimeout(timer);
			timer = setTimeout(callback, ms);
		};
	})();
	export default {
		name:'equlp',
		data(){
			return{
				autofill:false,
				allLoaded:false,
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
						input:true,
						html:'',
						event:() => {
							this.inputclick();
						}
					},
					{
						show:true,
						icon:'icon-saomiao',
						event:() => {
							this.$router.push({path:'/scanCode',query:{redirect:'/equiplist'}})
						}
					}
				],
				pageIndex:1,
				equList:[]
			}
		},
		components:{EquipList,notFound },
		methods:{
			getEquipmentList(type){//获取列表
				if(type){this.pageIndex = 1;this.allLoaded = false;};
				this.$store.commit('showLoading');
				this.$axios.get(this.$root.URL+'eom/api/equipment/list',{
					params:{
						params:{
							query:{
								equName:this.headData[1].html,
							},
							pager:{
								pageIndex:this.pageIndex,
								pageSize:10
							}
						}
					}
				}).then(res => {
					this.$store.commit('hideLoading')
					if(!type){
						this.$refs.loadmore.onBottomLoaded();
					};
					let d = res.data;
					if(!d.result){
						if(this.pageIndex >= d.totalPages && !type){
							this.allLoaded = true;
						}
						this.pageIndex ++;
						if(type){
							this.equList = [];
						};
						this.equList = this.equList.concat(d.item)
					}else{
						this.$MessageBox('提示',d.errorMsg);
					}
				})
			},
			loadbottom(){//下拉加载
				//this.$parent.pageIndex ++;
				this.getEquipmentList(false);
			},
			inputclick(){
				delay(() => {
					this.getEquipmentList(true)
				},300)
			}
		},
		beforeRouteEnter(to, from, next){
			if(from.name == 'Home'){
				to.meta.isUseCache = false;  
			}else{
				to.meta.isUseCache = true;
			}
			next()
		},
		activated(){
			this.headData[1].html = '';
			if(!this.$route.meta.isUseCache){
				this.getEquipmentList(true);
			}
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
			mui.back = function(){
				history.go(-1)//回退到上一页面
			}
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