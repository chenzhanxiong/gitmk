<template>
	<div class="faulttree-box row-box">
		<div class="list-model" style="position: relative;">
			<div class="ass-input-box">
				<i class="logo iconfont icon-sousuo"></i>
				<input type="text" v-model="search" placeholder="请输入关键字搜索" @input="inputclick"/>
				<i class="btn iconfont icon-guanbi" v-if="search != ''" @click="search = '',inputclick()"></i>
			</div>
			<span class="scan-btn"><i class="iconfont icon-saomiao"></i></span>
		</div>
		<mt-loadmore v-show="faultlist.length > 0 && $route.query.name == 'failureTxt'" :bottom-method="loadbottom" :bottom-all-loaded="allLoaded" :auto-fill="autofill" ref="loadmore">
			<routine-list v-if="$route.query.name == 'failureTxt'" v-for="(list,i) in faultlist" :key="i" :name="list.text" arr="true" @event="listjump1(list)"></routine-list>
		</mt-loadmore>
		<div class="baseline" v-if="allLoaded">我是有底线的</div>
		<fault-list v-if="$route.query.name == 'faultCode'" v-for="(list,i) in faultlist" :key="i" :listdata="list" @event="listjump(list)"></fault-list>
		<not-found v-if="faultlist.length <= 0" not="true"></not-found>
	</div>
</template>

<script>
	import FaultList from '@/components/assembly/faultList'
	import routineList from '@/components/assembly/routineList'
	import notFound from '@/components/notFound'
	const delay = (function() {
		let timer = 0;
		return function(callback, ms) {
			clearTimeout(timer);
			timer = setTimeout(callback, ms);
		};
	})();
	export default{
		data(){
			return{
				search:'',
				allLoaded:false,
				autofill:false,
				pageIndex:1,
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
				faultlist:[],
				
			}
			
		},
		components:{ FaultList,routineList,notFound },
		methods:{
			getfindFaultMessage(){//获取故障信息
				this.$store.commit('showLoading')
				this.$axios.get(this.$root.URL+'eom/api/common/findFault',{
					params:{
						positionCode:this.$route.query.id
					}
				}).then(res => {
					this.$store.commit('hideLoading')
					let d = res.data;
					if(!d.result){
						this.faultlist = d.items;
					}
				})
			},
			getfindFault(type){//获取故障现象
				if(type){this.pageIndex = 1;this.allLoaded = false;};
				this.$store.commit('showLoading')
				this.$axios.get(this.$root.URL+'eom/api/screen/findFault',{
					params:{
						params:{
							query:{
								text:this.search
							},
							pager:{
								pageIndex:this.pageIndex,
								pageSize:10
							}
						}
					}
				}).then(res => {
					this.$store.commit('hideLoading');
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
							this.faultlist = [];
						};
						this.faultlist = this.faultlist.concat(d.item)
					}
				})
			},
			inputclick(){
				delay(() => {
					this.getfindFault(true);
				},300)
			},
			loadbottom(){//下拉加载
				this.getfindFault(false);
			},
			listjump(list){//选择跳转
				this.$store.state.abnorData.listvalue.faultCode = list.faultCode;
				this.$store.state.abnorData.listvalue.failureTxt = list.faultName;
				this.$router.back(-1);
			},
			listjump1(list){//选择跳转
				this.$store.state.abnorData.listvalue.faultCode = '';
				this.$store.state.abnorData.listvalue.failureTxt = list.text
				this.$router.back(-1);
			}
		},
		
		activated(){
			if(this.$route.query.name == "faultCode"){
				this.headData[1].html = '故障树'
				this.getfindFaultMessage()
			}else{
				this.headData[1].html = '故障现象'
				this.getfindFault(true)
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
	.faulttree-box{
		width: 100%;
	}
</style>