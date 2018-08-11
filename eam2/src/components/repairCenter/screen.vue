<template>
	<div class="screen-box">
		<router-link to="/" class="screen-head">
			<span>全部设备</span>
			<span>全部<i class="iconfont icon-arr"></i></span>
		</router-link>
		<ul class="screen-list">
			<li v-for="(list,i) in screenlist" :key="i">
				<p class="scrlist-title">{{list.name}}</p>
				<div class="scrlist-category">
					<span class="eam2-btn" :class="{active:list.active == list.category[0]}" @click="list.active = list.category[0]">{{list.category[0]}}</span>
					<div class="scrlist-category-box">
						<span class="eam2-btn m-15 mb-20" v-for="(li,i) in list.category" :key="i" v-if="i != 0" :class="{active:list.active == li}" @click="list.active = li">{{li}}</span>
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
			return{
				screenlist:[
					{
						name:'日期',
						category:['全部','今日','一周之内','一周之外'],
						active:'全部'
					},
					{
						name:'报修分类',
						category:['全部','故障','异常'],
						active:'全部'
					},
					{
						name:'工作性质',
						category:['全部','应急维修','计划维修','机会维修'],
						active:'全部'
					},
					{
						name:'报修来源',
						category:['全部','日常保养','润滑','点检','巡检'],
						active:'全部'
					},
					{
						name:'状态',
						category:['全部','新建','未分配','已分配','已响应','已解决'],
						active:'全部'
					},
				]
			}
		},
		methods:{
			scrreset(){
				this.screenlist.forEach((e,i) => {
					e.active = '全部';
				})
			},
			scrsubmit(){
				this.$emit('popsild')
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
		border-bottom: 0.01rem solid #DEDEE0;
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
		overflow: hidden;
	}
	.scrlist-category-box{
		float: right;
		width: 4.3rem;
		overflow: hidden;
		margin-right: -0.15rem;
	}
	.screen-box .footer-btn{
		position: absolute;
		bottom: 0;
	}
</style>