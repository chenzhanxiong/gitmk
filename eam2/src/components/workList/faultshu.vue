<template>
	<div class="faultInfo-box row-box">
		<ul class="faultInfo-ul">
			<li>
				<span class="left-page"><i class="iconfont icon-guzhangkuaicha"></i></span>
				<div class="cont-page">
					<p>故障现象</p>
					<p>
						<span>故障原因</span>
						<span>发生次数</span>
					</p>
				</div>
				<div class="right-page">
					<span class="iconfont icon-add"></span>
					<span>100010</span>
				</div>
			</li>
			
		</ul>
	</div>
</template>

<script>
	export default{
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
						html:'故障树'
					},
					{
						show:true,
						html:'选择部位'
					},
				],
			}
		},
		mounted(){
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
		}
	}
</script>

<style>
	.faultInfo-box{
		width: 100%;
	}
</style>