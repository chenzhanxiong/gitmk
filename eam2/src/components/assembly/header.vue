<template>
	<div class="header-box">
		<span class="status-bar" :class="{iphonex:$root.iphonex}"></span>
		<header v-if="$store.state.heads.show == true">
			<div class="header-page" v-for="(list,i) in mes" v-if="list.show" :id="list.id">
				<i v-if="i != 1 && list.icon" class="iconfont" :class="list.icon" @click="listevent(list)"></i>
				<i v-if="i == 0 && list.close" style="font-size:0.36rem;" class="iconfont icon-guanbi1" @click="$router.push('/')"></i>
				<span v-if="i == 2 && list.html" v-text="list.html" @click="listevent(list)"></span>
				<p v-if="i == 1 && !list.input" v-text="list.html"></p>
				<input v-if="i == 1 && list.input" v-model="list.html" type="text" placeholder="请输入设备名称" @input="listevent(list)"><i v-if="i == 1 && list.input" @click="listevent(list)" class="iconfont icon-sousuo"></i>
			</div>
		</header>
		<header class="states" v-if="$store.state.heads.show == 'statesShow'">
			<i class="iconfont icon-fanhui" @click="$router.back(-1)"></i>
			<input type="text" name="" id="" value="" placeholder="请输入关键字过滤"/>
			<i class="iconfont icon-sousuo"></i>
		</header>
		<header class="archives" v-if="$store.state.heads.show == 'archivesShow'">
			<div class="header-left" @click="$router.back(-1)">
				<i class="iconfont icon-fanhui"></i>
			</div>
			<div class="header-right">
				<input type="text" name="" id="" value="" placeholder="请输入关键字搜索" />
				<i class="iconfont icon-sousuo"></i>
				<span>取消</span>
			</div>
		</header>
	</div>
	
</template>

<script>
	export default {
		props:['mes'],
		data(){
			return{
				marquee:false,
			}
		},
		methods:{
			listevent(list){
				if(list.event){
					list.event(list)
				}else{
					return false;
				}
			},
			
		},
	}
</script>

<style>
	.header-box{
		width: 100%;
		position: absolute;
		top: 0;
		z-index: 1;
	}
	.status-bar{
		display: block;
		width: 100%;
		height: 0.48rem;
		background: #038b72;
	}
	.status-bar.iphonex{
		height: 0.7rem;
	}
	header{
		display: block;
		width: 100%;
		height: 0.96rem;
		color: #fff;
		background: #00B294;
		position: relative;
	}
	header .header-page:nth-child(1){
		position: absolute;
		width: 1rem;
		height: 0.44rem;
		top: 50%;
		left: 0.2rem;
		transform: translate(0,-50%);
		
	}
	header .header-page i{
		vertical-align: middle;
		font-size: 0.44rem;
		color: #fff;
	}
	header .header-page:nth-child(3){
		position: absolute;
		height:0.44rem;
		top: 50%;
		right: 0.3rem;
		transform: translate(0,-50%);
	}
	header .header-page:nth-child(3) span{
		color: #fff;
		font-size: 0.32rem;
	}
	header .header-page:nth-child(2){
		width: 4.64rem;
		height: 0.46rem;
		position: absolute;
		top: 50%;
		left: 50%;
		overflow-x: auto;
		transform: translate(-50%,-50%);
	}
	
	.header-page input[type="text"]{
		width: 100%;
		height: 100%;
		border: none;
		padding: 0 0.4rem 0 0.1rem;
		border-radius: 0.1rem;
		outline: none;
		font-size: 0.26rem;
		color: #333;
	}
	.header-page:nth-child(2) i{
		position: absolute;
		right: 0.04rem;
		color: #ccc;
		font-size: 0.36rem;
		cursor: pointer;
		transform: translate(0,-50%);
		top: 50%;
	}
	.header-page p{
		color: #fff;
		text-align: center;
		font-size: 0.36rem;
		display: inline-block;
		min-width: 100%;
		white-space: nowrap;
	}
	
	
	header.states{
		height: 0.96rem;
		line-height: 0.96rem;
		background: #00B393;
		width: 100%;
		padding: 0 0.2rem;
		text-align: center;
	}
	header.states:before{
		content: '';
		width: 0;
		height: 100%;
		display: inline-block;
		vertical-align: middle;
	}
	header.states i{
		font-size: 0.44rem;
		display: inline-block;
		vertical-align: middle;
		color: #fff;
		float: left;
	}
	header.states i:last-child{
		float: right;
	}
	 header.states input{
		width: 5.4rem;
		display: inline-block;
		vertical-align: middle;
		font-size: 0.26rem;
		line-height: normal;
		padding: 0.12rem 0.2rem;
		border-radius: 0.1rem;
		border: none;
		outline: none;
	}
	
	header.archives .header-left{
		float: left;
		font-size: 0.44rem;
		height: 100%;
		display: inline-block;
		margin-left: 0.2rem;
	}
	header.archives .header-left:before{
		content: '';
		display: inline-block;
		vertical-align: middle;
		width: 0;
		height: 100%;
	}
	header.archives .header-left i{
		display: inline-block;
		vertical-align: middle;
		font-size: 0.44rem;
	}
	header.archives .header-right{
		float: right;
		margin-right: 0.2rem;
		height: 100%;
		position: relative;
	}
	header.archives .header-right:after{
		content: '';
		display: inline-block;
		width: 0;
		height: 100%;
		vertical-align: middle;
	}
	header.archives .header-right input{
		border: none;
		outline: none;
		border-radius: 0.1rem;
		padding: 0.13rem 0;
		font-size: 0.26rem;
		display: inline-block;
		vertical-align: middle;
		width: 2.9rem;
		padding-left: 0.6rem;
		padding-right: 0.2rem;
		line-height: 0.26rem;
	}
	header.archives .header-right>i{
		position: absolute;
		left: 0.15rem;
		color: #999;
		top: 50%;
		transform: translate(0,-50%);
		font-size: 0.36rem;
	}
	header.archives .header-right>span{
		display: inline-block;
		vertical-align: middle;
		width: 0.5rem;
		text-align: center;
	}
	
</style>