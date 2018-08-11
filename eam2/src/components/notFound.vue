<template>
	<div class="notFound-box">
		<div class="notFound">
			<i class="iconfont icon-icon-test"></i>
			<p>找不到服务器了~</p>
		</div>
	</div>
</template>

<script>
	export default{
		mounted(){
			this.$store.state.heads.show = false;
		}
	}
</script>

<style>
	.notFound-box{
		width: 100%;
		height: 100%;
		position: relative;
		background: #00b294;
	}
	.notFound{
		position: absolute;
		top: 40%;
		left: 50%;
		transform: translate(-50%,-50%);
		color: #fff;
		font-size: 0.4rem;
	}
	.notFound i{
		font-size: 3rem;
	}
</style>