<template>
	<span class="worklist-list" @click="listevent">
		<span class="left-icon"><i class="iconfont" :class="listdata.icon"></i></span>
		<div class="centent-page">
			<p>{{listdata.name}}</p>
			<p>
				<span>未点检工单：<font color="red">{{listdata.untreated}}</font></span>
				<span>今日工单：<font color="#00B294">{{listdata.wo}}</font></span>
			</p>
		</div>
		<div class="right-arr">
			<i class="iconfont icon-arr"></i>
		</div>
	</span>
</template>

<script>
	export default {
		props:['listdata'],
		data(){
			return{
				list:{
					'点检':'checklist',
					'巡检':'patrollist',
					'日保':'dailylist',
					'润滑':'lubricationlist'
				}
			}
		},
		methods:{
			listevent(){
				this.$store.state.repairData.title = this.listdata.name + '工单';
				this.$store.state.worklistData.worklistactiveItem = this.listdata;
				this.$router.push('/'+ this.list[this.listdata.name]);
			}
		}
	}
</script>

<style>
	.worklist-list{
		display: block;
		width: 100%;
		height: 1.28rem;
		border-bottom: 0.01rem solid #dedee0;
		padding: 0 0.2rem;
		position: relative;
	}
	.worklist-list .left-icon{
		display: block;
		width: 0.85rem;
		height: 0.85rem;
		background: #00B294;
		border-radius: 0.1rem;
		position: absolute;
		top: 50%;
		transform: translate(0,-50%);
		text-align: center;
	}
	.worklist-list .left-icon i{
		line-height: 0.85rem;
		color: #fff;
		font-size: 0.5rem;
	}
	.worklist-list .centent-page{
		position: absolute;
		left: 1.25rem;
		top: 50%;
		transform: translate(0,-46%);
	}
	.worklist-list .centent-page p{
		font-size: 0.25rem;
		line-height: 0.45rem;
	}
	.worklist-list .centent-page p:last-child{
		font-size: 0.18rem;
	}
	.worklist-list .centent-page p span{
		display: inline-block;
		width: 2.2rem;
	}
	.worklist-list .right-arr{
		position: absolute;
		right: 0.2rem;
		top: 50%;
		transform: translate(0,-50%);
		font-size: 0.3rem;
		color: #999;
	}
</style>