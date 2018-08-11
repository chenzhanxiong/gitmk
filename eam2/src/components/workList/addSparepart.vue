<template>
	<div class="addspare-box row-box">
		<div class="list-model" style="position: relative;">
			<div class="ass-input-box">
				<i class="logo iconfont icon-sousuo"></i>
				<input type="text" name="" id="" v-model="searchl" placeholder="请输入关键字搜索" />
				<i class="btn iconfont icon-guanbi" v-if="searchl != ''" @click="searchl = ''"></i>
			</div>
			<span class="scan-btn"><i class="iconfont icon-saomiao"></i></span>
		</div>
		<div>
			<routine-list v-for="(list,i) in listdata" :key="'a'+i" :listdata="list"></routine-list>
		</div>
	</div>
	
</template>

<script>
	import RoutineList from '@/components/assembly/routineList'
	export default{
		components:{ RoutineList },
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
						html:'添加备件'
					},
					{
						show:true,
						html:'保存'
					}
				],
				listactive:'',
				listdata:[
					{
						name:'备件名称1',
						check:true,
						porp:true,
						event:(list) => {
							this.clickacitve(list)
						}
					},
					{
						name:'备件名称2',
						check:true,
						porp:false,
						event:(list) => {
							this.clickacitve(list)
						}
					},
					{
						name:'备件名称3',
						check:true,
						porp:false,
						event:(list) => {
							this.clickacitve(list)
						}
					},
					{
						name:'备件名称4',
						check:true,
						porp:false,
						event:(list) => {
							this.clickacitve(list)
						}
					},
				]
			}
		},
		methods:{
			clickacitve(list){
				this.listactive = list.name;
				this.listdata.forEach((e) => {
					if(this.listactive == e.name){
						e.porp = true
					}else{
						e.porp = false;
					}
				})
				
			}
		},
		mounted(){
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
		}
	}
</script>

<style>
	.ass-input-box{
		width: 5.5rem;
		margin-left: 0.4rem;
		position: relative;
		border: 0.01rem solid #999;
		border-radius: 0.1rem;
	}
	.ass-input-box input{
		width: 100%;
		height: 0.6rem;
		font-size: 0.26rem;
		color: #666;
		background: none;
		border: none;
		outline: none;
		padding: 0 0.66rem;
	}
	.ass-input-box .logo{
		position: absolute;
		left: 0.2rem;
		top: 50%;
		transform: translate(0,-50%);
		font-size: 0.3rem;
		color: #999;
	}
	.ass-input-box .btn{
		position: absolute;
		right: 0.2rem;
		top: 50%;
		transform: translate(0,-50%);
		font-size: 0.3rem;
		color: #999;
	}
	.ass-input-box input::-webkit-input-placeholder{
		color: #999;
	}
	.scan-btn{
		position: absolute;
		right: 0.4rem;
		top: 50%;
		transform: translate(0,-50%);
	}
	.scan-btn i{
		font-size: 0.44rem;
		color: #00B294;
	}

</style>