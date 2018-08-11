<template>
	<div class="faultInfo-box row-box">
		<ul class="faultInfo-ul">
			<li>
				<span class="left-page"><i class="iconfont icon-guzhangkuaicha"></i></span>
				<div class="cont-page">
					<p>部位1</p>
					<p>
						<span>故障现象</span>
						<span>故障原因</span>
					</p>
				</div>
				<div class="right-page">
					<span class="iconfont icon-add"></span>
					<span>故障代码</span>
				</div>
			</li>
			<li>
				<span class="left-page"><i class="iconfont icon-guzhangkuaicha"></i></span>
				<div class="cont-page repla">
					<p>备件名称1 <span><font color="red">2个</font></span></p>
					<p>
						<span>部位名称</span>
						<span>备件图号</span>
						<span>备件编号</span>
						<span>故障现象：计划维修</span>
					</p>
				</div>
			</li>
		</ul>
		<div class="add-info" @click="$router.push('/addReplace')">
			<i class="iconfont icon-add"></i>
			<span>添加故障信息</span>
		</div>
		<button class="list-submit" style="margin-top: 0.4rem;">确认返回</button>
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
						html:'故障信息'
					}
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