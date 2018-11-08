<template>
	<div class="equip-list border-bottom" :class="{alarm:listdata.untreatedNum > 0 || listdata.reportNum > 0}" @click="listClick">
		<span class="left-icon"><i class="iconfont icon-donghuanshebeiguanli"></i></span>
		<div class="centent-page">
			<p>{{listdata.equName}}</p>
			<i class="iconfont icon-location"></i>
		</div>
		<ul class="right-state">
			<li>
				<span class="sta-name">今日工单</span>
				<span class="sta-data">{{listdata.woNum}}</span>
			</li>
			<li>
				<span class="sta-name">未处理工单</span>
				<span class="sta-data" :class="{red:listdata.untreatedNum>0}">{{listdata.untreatedNum}}</span>
			</li>
			<li>
				<span class="sta-name">异常上报</span>
				<span class="sta-data" :class="{red:listdata.reportNum>0}">{{listdata.reportNum}}</span>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		props:['listdata'],
		methods:{
			listClick(){
				this.$router.push({path:'/equiplist',query:{...this.listdata}})
			}
		}
	}
</script>

<style>
	.equip-list{
		display: block;
		width: 100%;
		height: 1.26rem;
		position: relative;
	}
	.left-icon{
		display: block;
		width: 0.85rem;
		height: 0.85rem;
		background: #00B294;
		border-radius: 50%;
		position: absolute;
		top: 50%;
		left: 0.2rem;
		transform: translate(0,-50%);
		text-align: center;
	}
	.left-icon i{
		line-height: 0.85rem;
		color: #fff;
		font-size: 0.5rem;
	}
	.centent-page{
		position: absolute;
		left: 1.25rem;
		top: 50%;
		transform: translate(0,-50%);
	}
	.centent-page p{
		font-size: 0.25rem;
		line-height: 0.45rem;
		width: 4.4rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.centent-page i{
		line-height: 0.4rem;
		font-size: 0.3rem;
		color: #ccc;
	}
	.right-state{
		position: absolute;
		right: 0.2rem;
		top: 50%;
		transform: translate(0,-50%);
		font-size: 0.18rem;
		line-height: 0.36rem;
		color: #666;
		text-align: right;
	}
	.right-state .sta-name{
		display: inline-block;
	}
	.right-state .sta-data{
		display: inline-block;
		width: 0.4rem;
	}
	.right-state .sta-data.red{
		color: red;
	}
	.equip-list.alarm .left-icon:before{
		content: "";
		position: absolute;
		display: block;
		width: 0.17rem;
		height: 0.17rem;
		background: red;
		top: 0.03rem;
		right: 0.03rem;
		border-radius: 50%;
	}
</style>