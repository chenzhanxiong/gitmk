<template>
	<div class="screen-box">
		<div class="screen-head border-bottom" @click="$emit('popsild')">
			<span>全部设备</span>
			<span>收回<i class="iconfont icon-arr"></i></span>
		</div>
		<ul class="screen-list">
			<li v-for="(list,i) in screenlist" :key="i">
				<p class="scrlist-title">{{list.name}}</p>
				<div class="scrlist-category clearfix">
					<span class="eam2-btn" :class="{active:active[list.id] == ''}" @click="active[list.id] = ''">全部</span>
					<div class="scrlist-category-box clearfix">
						<span class="eam2-btn m-15 mb-20" v-for="(li,i) in list.category" :key="i" :class="{active:active[list.id] == li.value}" @click="active[list.id] = li.value">{{li.text}}</span>
					</div>
				</div>
			</li>
		</ul>
		<div class="footer-btn">
			<span @click="scrreset">重置</span>
			<span @click="scrsubmit">确定</span>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			let state = this.$store.state;
			return{
				screenlist:state.screenlist,
				active:state.screenActive
			}
		},
		methods:{
			scrreset(){
				Object.keys(this.active).forEach((e,i) => {
					this.active[e] = '';
				})
			},
			scrsubmit(){
				this.$store.state.screenActive = this.active;
				this.$emit('popsild');
				this.$emit('getlistData');
			}
		}
	}
</script>

<style>
	.screen-box{
		position: relative;
		width: 100%;
		height: 100%;
	}
	.screen-box .screen-head{
		display: block;
		width: 100%;
		height: 1rem;
		padding: 0 0.4rem;
		line-height: 1rem;
	}
	.screen-box .screen-head span:last-child{
		float: right;
		color: #666;
	}
	.screen-box .screen-head span:last-child i{
		margin-left: 0.1rem;
	}
	.screen-list{
		position: absolute;
		top: 1rem;
		bottom: 1rem;
		left: 0;
		right: 0;
		padding: 0.1rem 0.4rem;
		overflow: auto;
		
	}
	.scrlist-title{
		line-height: 0.6rem;
		font-size: 0.3rem;
	}
	.scrlist-category{
		padding: 0 0.1rem;
	}
	.scrlist-category-box{
		float: right;
		width: 4.3rem;
		margin-right: -0.15rem;
	}
	.screen-box .footer-btn{
		position: absolute;
		bottom: 0;
	}
	.clearfix:after{
		content: '';
		display: block;
		height: 0;
		clear: both;
		visibility: hidden;
	}
	.clearfix{
		zoom: 1;
	}
</style>