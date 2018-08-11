<template>
	<div class="earlywarning-box row-box">
		<ul class="earlywarning-ul">
			<li v-for="(list,i) in datalist" :key="i" @click="$router.push('/earlyContent')">
				<span class="left-icon-c">
					<i class="iconfont icon-baojing"></i>
				</span>
				<div class="content-page-c">
					<p>{{list.name}}</p>
					<p>
						<span>预警类型：{{list.type}}</span>
						<span>{{list.time}}</span>
					</p>
				</div>
				<span class="right-arr-c">
					<i class="iconfont icon-add"></i>
				</span>
			</li>
		</ul>
	</div>
</template>

<script>
	import '@/static/liststyle.css'
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
						html:'预警'
					}
				],
				datalist:[
					{name:'刀盘寿命5天后到期',type:'零件寿命',time:'2018-05-07'},
					{name:'传动轴温度超过正常温度范围',type:'状态检测',time:'2018-05-07'},
					{name:'3天后检定时间到期',type:'设备检定',time:'2018-05-07'},
					{name:'传动轴温度超过正常温度范围',type:'状态检测',time:'2018-05-07'},
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
	.earlywarning-box{
		width: 100%;
	}
</style>