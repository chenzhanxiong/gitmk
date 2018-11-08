<template>
	<div class="addspare-box">
		<div class="list-model" style="position: relative;">
			<div class="ass-input-box">
				<i class="logo iconfont icon-sousuo"></i>
				<input type="text" v-model="searchl" placeholder="请输入关键字搜索" @input="inputclick"/>
				<i class="btn iconfont icon-guanbi" v-if="searchl != ''" @click="searchl = '',inputclick()"></i>
			</div>
			<span class="scan-btn"><i class="iconfont icon-saomiao"></i></span>
		</div>
		<div class="addSp-list">
			<mt-loadmore v-show="listdata.length > 0" :bottom-method="loadbottom" :bottom-all-loaded="allLoaded" :auto-fill="autofill" ref="loadmore">
				<routine-list v-if="listdata.length > 0" v-for="(list,i) in listdata" :key="i" :name="list.text" check="true" :value="list.type" @event="list.type = !list.type"></routine-list>
			</mt-loadmore>
			<div class="baseline" v-if="allLoaded">我是有底线的</div>
			<not-found v-if="listdata.length <= 0" not="not"></not-found>
		</div>
	</div>
	
</template>

<script>
	const delay = (function() {
	let timer = 0;
	return function(callback, ms) {
		clearTimeout(timer);
		timer = setTimeout(callback, ms);
	};
	})();
	import RoutineList from '@/components/assembly/routineList'
	import notFound from '@/components/notFound'
	export default{
		components:{ RoutineList,notFound },
		data(){
			return{
				searchl:'',
				pageIndex:1,
				isconfirm:false,
				autofill:false,
				allLoaded:false,
				close:true,
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
						html:'添加备件'
					},
					{
						show:true,
						html:'保存',
						event:() => {
							this.isconfirm = true;
							this.$router.back(-1);
						}
					}
				],
				listactive:[],
				listdata:[]
			}
		},
		methods:{
			getfindPosition(type){//获得换件信息的--备件库
				if(type){this.pageIndex = 1;this.allLoaded = false;};
				this.$store.commit('showLoading')
				this.$axios.get(this.$root.URL+'eom/api/common/list',{
					params:{
						params:{
							query:{
								equName:this.searchl
							},
							pager:{
								pageIndex:this.pageIndex,
								pageSize:20
							}
						}
					}
					
				}).then(res => {
					this.$store.commit('hideLoading')
					let d = res.data;
					if(!type){
						this.$refs.loadmore.onBottomLoaded();
					}
					if(!d.result){
						if(this.pageIndex >= d.totalPages && !type){
							this.allLoaded = true;
						}
						this.pageIndex ++;
						if(type){
							this.listdata = [];
						};
						d.item.forEach((e) => {
							e.type = false;
							if(!e.num){
								e.num = 1;
							}
							if(this.$route.query.item){
								this.$route.query.item.forEach(item => {
									if(e.code == item.code){
										e.type = true;
										e.num = item.num
										return;
									}
								})
							}
						})
						this.listdata = this.listdata.concat(d.item);
					}
				})
			},
			loadbottom(){//下拉加载
				this.getfindPosition(false);
			},
			inputclick(){
				delay(() => {
					this.getfindPosition(true)
				},300)
			}
		},
		beforeRouteLeave(to,from,next){
			if(this.isconfirm){
				this.listdata.forEach(e => {
					if(e.type){
						this.listactive.push(e)
					}
				})
				to.params.item = this.listactive
			}
			next();
		},
		activated(){
			this.isconfirm = false;
			this.listactive = [];
			this.getfindPosition(true);
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
			mui.back = function(){
				history.go(-1)//回退到上一页面
			}
		}
	}
</script>

<style>
	
</style>