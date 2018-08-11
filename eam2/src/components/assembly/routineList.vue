<template>
	<div class="routine-list">
		<div class="routine-li" :class="{'right-arr':listdata.href}" @click="listevent()">
			<span>{{listdata.name}}</span>
			<span v-if="!listdata.check">{{listdata.porp}}<i v-if="listdata.href" class="iconfont icon-arr"></i></span>
			<span v-if="listdata.check">
				<i class="radioui" :class="{active:listdata.porp}"></i>
			</span>
		</div>
	</div>
</template>

<script>
	export default{
		props:['listdata'],
		methods:{
			listevent(){
				if(this.listdata.event){
					this.listdata.event(this.listdata)
				}else{
					return false;
				}
				
			}
		}
	}
</script>

<style>
	.routine-list{
		width: 100%;
		padding-left: 0.4rem;
	}
	.routine-li{
		display: block;
		padding: 0.3rem 0;
		border-bottom: 0.01rem solid #dedede;
		padding-right: 0.4rem;
		overflow: hidden;
		cursor: pointer;
	}
	.routine-li>span{
		font-size: 0.28rem;
		/*overflow: hidden;
		height: 0.36rem;*/
	}
	.routine-li>span:last-child{
		float: right;
		color: #999;
		text-align: right;
		width: 4.7rem;
		/*overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;*/
	}
	.routine-li>span:last-child>i{
		margin-left: 0.1rem;
		float: right;
	}
	.routine-li.right-arr>span:last-child{
		position: relative;
		padding-right: 0.34rem;
	}
	.routine-li.right-arr>span:last-child>i{
		position: absolute;
		right: -0.06rem;
		top: 0.03rem;
	}

</style>