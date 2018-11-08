<template>
	<div class="earlyContent-box row-box">
		<div>
			<routine-list v-for="(list,i) in datalist" :key="'a'+i" :listdata="list"></routine-list>
		</div>
	</div>
</template>

<script>
	import RoutineList from '@/components/assembly/routineList'
	export default{
		components:{ RoutineList },
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
						html:'预警内容'
					}
				],
				datalist:[
					{name:'预警类型',porp:'计量器具检定预警'},
					{name:'设备',porp:'自动扶梯'},
					{name:'预警时间',porp:'2018-05-09'},
					{name:'预警标题',porp:'百分表--计量器具检定预警'},
					{name:'预警内容',porp:'自动扶梯--距离到期时间小于10天自动扶梯--距离到期时间小于10天'}
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
	.earlyContent-box{
		width: 100%;
	}
</style>