<template>
	<div class="home-box">
		<h1 v-html="$store.state.title"></h1>
		<span class="setUp-btn" @click="$router.push('/setUp')">
			<i class="iconfont icon-shezhi"></i>
		</span>
		<ul>
			<li>
				<router-link to="/equipment"><i class="iconfont icon-shebei"></i><span>设备</span></router-link>
			</li>
			<li>
				<router-link to="/workList"><i class="iconfont icon-gongdan"></i><span>工单</span></router-link>
			</li>
			<li>
				<router-link to="/repairCenter"><i class="iconfont icon-baoxiu"></i><span>报修中心</span></router-link>
			</li>
			<li>
				<router-link to="/abnormallyReport"><i class="iconfont icon-paizhaoxiangjixianxing"></i><span>异常上报</span></router-link>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
	  	name: 'home',
	  	methods:{
	  		getdata(){
	  			this.$axios.put('/api/demo/update/4028812e64fde78e0164ffde106d0002',{
	  				name:'11111',
	  				age:'3',
	  			}).then((res) =>{
	  				console.log(res)
	  			})
	  		}
	  	},
	  	mounted(){
	  		//this.getdata();
			this.$store.state.heads.show = false;
		}
	}
</script>

<style>
	.home-box{
		width: 100%;
		height: 100%;
		padding: 0.78rem 0.3rem;
		position: relative;
		background: url(../static/images/homebg.png) no-repeat center;
		background-size: 100% 100%;
	}
	.home-box h1{
		font-size: 0.36rem;
		font-weight: normal;
		float: left;
	}
	.setUp-btn{
		float: right;
		width: 0.4rem;
		height: 0.4rem;
	}
	.setUp-btn i{
		display: block;
		font-size: 0.40rem;
	}
	.home-box ul{
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);	
		width: 100%;
		text-align: center;
	}
	.home-box li{
		display: inline-block;
		width: 2.06rem;
		height: 2.06rem;
		margin: 0.54rem;
		text-align: center;
	}
	.home-box li a{
		display: block;
		width: 100%;
		height: 100%;
		background: #00B294;
		border-radius: 0.1rem;
		color: #FFFFFF;
		font-size: 0.32rem;
	}
	.home-box li a i{
		display: inline-block;
		width: 1.12rem;
		height: 1.12rem;
		margin-top: 0.3rem;
		overflow: hidden;
		font-size: 1.1rem;
	}
	.home-box li a i img{
		display: block;
		width: 100%;
		height: 100%;
	}
	.home-box li a span{
		display: block;
		margin: 0 auto;
	}
</style>