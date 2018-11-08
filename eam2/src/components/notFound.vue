<template>
	<div class="notFound-box">
		<div class="notFound" v-if="$route.params.type == 'not' || not">
			<i style="margin-left:0.5rem" class="iconfont icon-zanwushuju"></i>
			
			<p>暂无数据~</p>
			<router-link to="/" v-if="!not">返回首页</router-link>
		</div>
		<div class="notFound" v-else-if="kaifazhong">
			<i class="iconfont icon-jianshezhong"></i>
			<p>开发中，敬请期待~</p>
		</div>
		<div class="row-box" v-else>
			<div class="notFound">
				<i class="iconfont icon-icon-test"></i>
				<p>找不到服务器了~</p>
				<router-link :to="$route.params.redirect || '/'" replace>重新加载</router-link>
			</div>
		</div>
	</div>
	
</template>

<script>
	export default{
		props:['not','kaifazhong'],
		beforeRouteLeave(to,from,next){
			to.meta.isUseCache = false;
			next()
		},
		activated(){
			this.$store.state.heads.show = true;
		}
	}
</script>

<style>
	.notFound-box{
		text-align: center;
	}
	.notFound{
		position: absolute;
		top: 40%;
		left: 50%;
		transform: translate(-50%,-50%);
		color: #ccc;
		font-size: 0.4rem;
	}
	.notFound i{
		font-size: 2.5rem;
	}
	.notFound-box a{
		text-align: center;
		font-size: 0.26rem;
		color: #00B294;
	}	
</style>