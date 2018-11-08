<template>
	<div class="home-box" :class="{iphonex:$root.iphonex}">
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
		<div class="home-footer" @click="$router.push({path:'/scanCode',query:{redirect:'/equiplist'}})">
			<i class="iconfont icon-saomiao"></i>
			开始扫描
		</div>
	</div>
</template>

<script>
	export default {
	  	name: 'home',
	  	methods:{
	  	},
		beforeRouteEnter(to, from, next){
			to.meta.isUseCache = false;
			next(vm => {
				vm.$store.state.heads.show = false;
			})
		},
	  	activated(){
			var first = null;
			mui.back = function() {
			//首次按键，提示 再按一次退出应用
				if (!first) {
					first = new Date().getTime();//记录第一次按下回退键的时间
					mui.toast('再按一次退出应用');//给出提示
					
					setTimeout(function() {//1s中后清除
						first = null;
					}, 1000);
				} else {
					if (new Date().getTime() - first < 1000) {//如果两次按下的时间小于1s，
						plus.runtime.quit();//那么就退出app
			
					} 
				}
			};

		}
	}
</script>

<style>
	.home-box{
		width: 100%;
		height: 100%;
		padding: 0.58rem 0.3rem;
		position: relative;
		background: url(../static/images/homebg.png) no-repeat center top;
		background-size: 100%;
	}
	.home-box.iphonex{
		padding-top: 0.8rem;
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
	.home-footer{
		position: fixed;
		height: 1.1rem;
		left: 0;
		right: 0;
		background: #384e4a;
		color: #fff;
		bottom: 0;
		font-size: 0.32rem;
		text-align: center;
		line-height: 1.1rem;
	}
	.home-footer:before{
		content: '';
		width: 0;
		height: 100%;
		display: inline-block;
		vertical-align: middle;
	}
	.home-footer i{
		display: inline-block;
		vertical-align: middle;
		font-size: 0.42rem;
	}
</style>