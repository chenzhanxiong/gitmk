<template>
	<div class="routine-list">
		<div class="routine-li border-bottom" :class="{'right-arr':arr}" @click="$emit('event')">
			<span>{{name}}</span>
			<span v-if="!check">{{value}}<i v-if="arr" class="iconfont icon-arr"></i></span>
			<span v-if="check">
				<i class="radioui" :class="{active:value == '1'}"></i>
			</span>
		</div>
	</div>
</template>

<script>
	export default{
		props:['name','value','arr','check'],
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
		width: 100%;
		display: block;
		padding: 0.3rem 0;
		padding-right: 0.4rem;
		overflow: hidden;
		cursor: pointer;
	}
	.routine-noBorder .routine-li:after{
		display: none;
	}
	.routine-li>span{
		font-size: 0.28rem;
		line-height: 0.32rem;
		/*overflow: hidden;
		height: 0.36rem;*/
	}
	.routine-li>span:last-child{
		float: right;
		color: #999;
		max-width: 4.7rem;
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
		top: 0.01rem;
		font-size: 0.3rem;
	}

</style>