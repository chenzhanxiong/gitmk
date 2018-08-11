<template>
	<div class="workInspectlun-box row-box">
		<tablec></tablec>
		<div class="workinspect-list">
			<h3 class="workinspect-title">轮保设备</h3>
			<ul class="workinspect-ul">
				<li v-for="(list,i) in datalist" :key="i" @click="list.event">
					<span><i class="iconfont icon-donghuanshebeiguanli"></i></span>
					<span>{{list.name}}</span>
					<i class="iconfont icon-add"></i>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import Tablec from '@/components/assembly/tablec'
	export default{
		components:{ Tablec },
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
						html:'设备',
					}
				],
				datalist:[
					{name:'zb48 1#',event:() =>{this.$router.push('/workInspect')}},
					{name:'zb48 1#',event:() =>{this.$router.push('/workInspect')}},
					{name:'zb48 1#',event:() =>{this.$router.push('/workInspect')}},
					{name:'zb48 1#',event:() =>{this.$router.push('/workInspect')}},
					{name:'zb48 1#',event:() =>{this.$router.push('/workInspect')}},
				]
				
			}
		},
		mounted(){
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
		}
	}
</script>

<style>
	.workInspectlun-box{
		width: 100%;
	}
	.workinspect-list{
		width: 100%;
	}
	.workinspect-title{
		width: 100%;
		line-height: 0.6rem;
		height: 0.6rem;
		background: #f5f5f5;
		font-weight: normal;
		color: #999;
		padding: 0 0.4rem;
	}
	.workinspect-ul{
		width: 100%;
		padding: 0 0.2rem;
	}
	.workinspect-ul li{
		height: 1.3rem;
		width: 100%;
		padding: 0 0.2rem;
		overflow: hidden;
		border-bottom: 0.01rem solid #dedede;
	}
	.workinspect-ul li:before{
		content: '';
		width: 0;
		height: 100%;
		display: inline-block;
		vertical-align: middle;
	}
	.workinspect-ul li>span:first-child{
		width: 0.86rem;
		height: 0.86rem;
		display: inline-block;
		vertical-align: middle;
		text-align: center;
		border-radius: 50%;
		margin-right: 0.2rem;
		background: #00B393;
	}
	.workinspect-ul li>span:first-child:before{
		content: '';
		display: inline-block;
		width: 0;
		height: 100%;
		vertical-align: middle;
	}
	.workinspect-ul li>span:first-child>i{
		display: inline-block;
		color: #fff;
		vertical-align: middle;
		font-size: 0.48rem;
	}
	.workinspect-ul li>span:nth-child(2){
		display: inline-block;
		width: 4.5rem;
		font-size: 0.26rem;
		vertical-align: middle;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.workinspect-ul li>i{
		float: right;
		display: inline-block;
		font-size: 0.4rem;
		color: #00B393;
		line-height: 1.3rem;
	}
</style>