<template>
	<div class="earlywarning-box row-box">
		<ul class="earlywarning-ul"  v-if="show">
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
		<not-found v-if="!show" kaifazhong="true"></not-found>
	</div>
</template>

<script>
	import notFound from '@/components/notFound'
	export default{
		components:{notFound},
		data(){
			return{
				show:true,
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
		activated(){
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
			mui.back = function(){
				history.go(-1)//回退到上一页面
			}
		}
	}
</script>

<style>
	.earlywarning-box{
		width: 100%;
	}
</style>