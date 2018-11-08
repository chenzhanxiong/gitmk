<template>
	<span class="reqair-list border-bottom" @click="$emit('event',listdata)">
		<span class="left-icon"><i class="iconfont icon-guzhangkuaicha"></i></span>
		<div class="content-page" v-if="!failureTxt">
			<p>{{listdata.faultName}}</p>
			<p>{{listdata.faultReason}}</p>
		</div>
		<div class="content-page" v-if="failureTxt">
			<p>{{listdata.text}}</p>
		</div>
		<div class="right-arr" v-if="!failureTxt">
			<p>发生次数：{{listdata.faultCount}}</p>
		</div>
	</span>
</template>

<script>
	export default {
		props:['listdata','failureTxt']
	}
</script>

<style>
	.reqair-list{
		display: block;
		width: 100%;
		height: 1.28rem;
		border-bottom: 0.02rem solid #dedee0;
		padding: 0 0.2rem;
		position: relative;
		cursor: pointer;
		overflow: hidden;
	}
	.reqair-list .left-icon{
		display: block;
		width: 0.85rem;
		height: 0.85rem;
		background: #00B294;
		border-radius: 50%;
		position: absolute;
		top: 50%;
		transform: translate(0,-50%);
		text-align: center;
	}
	.reqair-list .left-icon i{
		line-height: 0.85rem;
		color: #fff;
		font-size: 0.5rem;
	}
	.reqair-list .content-page{
		position: absolute;
		left: 1.25rem;
		top: 50%;
		transform: translate(0,-46%);
		width: 3.5rem;
	}
	.reqair-list .content-page p{
		font-size: 0.25rem;
		line-height: 0.45rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.reqair-list .content-page p:last-child{
		color: #999;
		font-size: 0.22rem;
	}
	.reqair-list .right-arr{
		position: absolute;
		right: 0.2rem;
		width: auto;
		top: 58%;
		text-align: center;
		color: #999;
		font-size: 0.22rem;
	}
</style>