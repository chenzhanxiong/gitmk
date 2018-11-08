<template>
	<div class="faultInfo-box row-box">
		<ul class="faultInfo-ul">
			<li v-for="(list,i) in listdata" :key="i">
				<div class="item-box">
					<span class="left-page"><i class="iconfont icon-guzhangkuaicha"></i></span>
					<div class="cont-page">
						<p>{{list.faultName}}</p>
						<p class="fault-p">
							<span>{{list.faultReason}}</span>
							<span>{{list.faultCount}}</span>
						</p>
					</div>
					<div class="right-page" @click="addList(list)">
						<span class="iconfont icon-weibiaoti--" style="text-align: center;"></span>
						<span>{{list.faultCode}}</span>
					</div>
				</div>
			</li>
			
		</ul>
		<not-found v-show="listdata.length <= 0" not="not"></not-found>
	</div>
</template>

<script>
	import notFound from '@/components/notFound'
	export default{
		components:{notFound},
		data(){
			return{
				headData:[
					{
						show:true,
						icon:'icon-fanhui',
						close:true,
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
						html:'选择部位',
						event:() =>{
							this.$router.push({path:'/assPhotos',query:{...this.$route.query}})
						}
					},
				],
				listdata:[]
			}
		},
		methods:{
			addList(list){//添加故障信息
				this.$MessageBox.confirm('确认保存？').then(() =>{
					this.postSaveFaultConfirms(list)
				})
			},
			getfindFault(code){//获取故障树信息
				this.$store.commit('showLoading')
				this.$axios.get(this.$root.URL+'eom/api/common/findFault',{
					params:{
						positionCode: code
					}
				}).then(res => {
					this.$store.commit('hideLoading')
					let d = res.data;
					if(!d.result){
						this.listdata = d.items;
					}
				})
			},
			postSaveFaultConfirms(list){//确认故障信息
				
				this.$store.commit('showLoading')
				this.$axios.post(this.$root.URL+'eom/api/common/saveFaultConfirms',{
					fAodId        : this.$route.query.id,
					equKeyId      : this.$route.query.equKeyId,
					postionId     : list.postionId,
					failureTreeId : list.faultCode,
					failureTxt    : this.$route.query.failureTxt
				}).then(res => {
					this.$store.commit('hideLoading')
					let d = res.data;
					if(!d.result){
						this.$Toast({message:'提交成功!'});
						this.$router.back(-1)
					}else{
						this.$MessageBox('提示','提交失败!');
					}
				})
			}
		},
		beforeRouteEnter(to, from, next){
			let code = '';
			next((vm)=>{
				if(from.name == 'AssPhotos'){
					code = vm.$route.params.code
				}else{
					code = vm.$route.query.positionCode
				}
				vm.getfindFault(code)
			});
		},
		activated(){
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
			mui.back = function(){
				history.go(-1)//回退到上一页面
			}
		}
	}
</script>

<style>
	.faultInfo-box{
		width: 100%;
	}
</style>