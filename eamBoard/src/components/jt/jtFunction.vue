<template>
	<div class="row-box" v-loading="boxloading">
		<div class="content-title">
			<span class="title">运行管理概况（单位：小时）</span>
			<div class="query-right">
				<el-radio-group v-model="tabPosition">
					<el-radio-button label="1">上一班次</el-radio-button>
					<el-radio-button label="2">当前班次</el-radio-button>
				</el-radio-group>
			</div>
		</div>
		<div class="content-body">
			<div class="jt-fn-ul" :class="{nothing:functionData}">
				<ul v-if="functionData">
					<li>日期：{{functionData.workorderDate}}</li>
					<li style="color:#e31714">非计划停机时长：{{functionData.unplanStopHour}}</li>
					<li style="color:#542fcf">计划停机时长：{{functionData.planStopHour}}</li>
					<li>班时：{{functionData.shiftHour}}</li>
					<li style="color:#46ad29">运行时长：{{functionData.runHours}}</li>
					<li>有效作业率：{{functionData.efficiency}}</li>
				</ul>
				<div v-if="!functionData" class="el-tree__empty-block"><span class="el-tree__empty-text">暂无数据</span></div>
			</div>
			<chart ref="child" style="margin: 0.5rem 0;" :tabPosition="tabPosition" :chartData="chartData" @putShift="putShift"></chart>
			<div id="myChart" ref="chart" :style="{width: '100%', height: '300px'}"></div>
		</div>
	</div>
</template>

<script>
	const delay = (function() {
	let timer = 0;
	return function(callback, ms) {
		clearTimeout(timer);
		timer = setTimeout(callback, ms);
	};
	})();
	import chart from '@/components/jt/ass/chart'
	export default{
		components:{chart},
		data(){
			return{
				tabPosition:'2',
				boxloading:false,
				functionData:'',
				chartData:[],
				echartsData:[],
				myChart:null,
			}
		},
		methods:{
			findCurrentShift(){
				this.boxloading = true;
				this.functionData = ''
				this.chartData = [];
				this.$axios.get(this.$root.URL+'eom/api/runManage/findCurrentShift/'+this.$store.state.activeEquId).then((res) => {
					this.boxloading = false;
					let d = res.data;
					if(!d.result){
						this.functionData = d.obj;
						if(d.obj){
							this.chartData = d.obj.results;
						}
					}else{
						this.$message.error('获取数据失败');
					}
				})
			},
			findLastShift(){
				this.boxloading = true;
				this.functionData = '';
				this.chartData = [];
				this.$axios.get(this.$root.URL+'eom/api/runManage/findLastShift/'+this.$store.state.activeEquId).then((res) => {
					this.boxloading = false;
					let d = res.data;
					if(!d.result){
						this.functionData = d.obj;
						if(d.obj){
							this.chartData = d.obj.results;
						}
					}else{
						this.$message.error('获取数据失败');
					}
				})
			},
			findListForChart(){
				this.$axios.get(this.$root.URL+'eom/api/runManage/findListForChart/'+this.$store.state.activeEquId).then((res) => {
					this.boxloading = false;
					let d = res.data;
					this.echartsData = d;
					this.drawLine();
				})
			},
			calcShift(){
				
			},
			runManageUpdate(id){
				this.boxloading = true;
				this.$axios.put(this.$root.URL+'eom/api/runManage/update/'+id,{
					...this.functionData
				}).then((res) => {
					this.boxloading = false;
					let d = res.data;
					if(!d.result){
						this.$message({message:'保存成功!',type: 'success'});
					}else{
						this.$message.error('数据保存失败');
					}
				})
			},
			putShift(arr,ms){
				let obj = this.functionData;
				obj.results = arr;
				obj.unplanStopHour = 0;
				obj.planStopHour = 0;
				obj.runHours = 0;
				arr.forEach(e => {
					if(e.runClass.indexOf('0-2') != '-1'){
						obj.unplanStopHour += Number((e.hours/60).toFixed(1))
					}
					if(e.runClass.indexOf('0-1') != '-1'){
						obj.planStopHour += Number((e.hours/60).toFixed(1))
					}
					if(e.runClass == '1'){
						obj.runHours += Number((e.hours/60).toFixed(1))
					}
				})
				obj.unplanStopHour = obj.unplanStopHour.toFixed(1);
				obj.planStopHour = obj.planStopHour.toFixed(1);
				obj.runHours = obj.runHours.toFixed(1);
				obj.efficiency = ((obj.runHours/obj.shiftHour)*100).toFixed(2) +'%';
				delay(() => {
					this.runManageUpdate(obj.id);
				},ms)
			},
			drawLine(){
				this.myChart = this.$echarts.init(this.$refs.chart)
				let xa = [];
				let ya = [];
				this.echartsData.forEach(e => {
					if(e){
						xa.push(e.shiftCode)
						ya.push(e.efficiency)
					}
				})
				// 绘制图表
				this.myChart.setOption({
					tooltip: {
						trigger: 'axis',
						formatter:'{b0}<br/> {a0}:{c0}%',
					},
					grid:{
						left:'5%',
						right:'3%',
						bottom:95
					},
					title: {
						left: 'center',
						text: '运行统计图',
					},
					xAxis: {
						type: 'category',
						axisTick:{
							show:false
						},
						//boundaryGap: false,
						data: xa
					},
					yAxis: {
						type: 'value',
						axisTick:{
							show:false
						},
						axisLine:{
							show:false
						},
						min:0,
						max:100,
						axisLabel:{
							formatter:'{value}%'
						},
						boundaryGap: [0, '100%']
					},
					series: [
						{
							name:'有效作业率',
							type:'line',
							smooth:false,
							symbol: 'none',
							sampling: 'average',
							lineStyle:{
								width:3
							},
							itemStyle: {
								normal: {
									
									color: 'rgb(0, 179, 147)'
								}
							},
							areaStyle: {
								normal: {
									color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
										offset: 0,
										color: 'rgba(0, 179, 147,1)'
									}, {
										offset: 1,
										color: 'rgba(0, 179, 147,0)'
									}])
								}
							},
							data: ya
						}
					]
				});
				
			}
		},
		computed:{
			activeEquId(){
				return this.$store.state.activeEquId;
			}
		},
		watch:{
			activeEquId(){
				if(this.tabPosition == '1'){
					this.findLastShift()
				}
				if(this.tabPosition == '2'){
					this.findCurrentShift();
				}
				this.findListForChart();
			},
			tabPosition(old){
				if(old == '1'){
					this.findLastShift()
				}
				if(old == '2'){
					this.findCurrentShift();
				}
			}
		},
		mounted(){
			this.findCurrentShift();
			this.findListForChart();
			let _this = this;
			window.onresize = function(){
				_this.$refs.child.resize();
				if(_this.myChart){
					_this.myChart.resize();
				}
			}
		},
	}
</script>

<style>
	.jt-fn-ul{
		width: 100%;
		border: 1px solid #acacac;
		overflow: hidden;
	}
	.jt-fn-ul.nothing{
		border-bottom-width: 0;
	}
	.jt-fn-ul li{
		float: left;
		width: 33.33%;
		line-height: 0.5rem;
		text-align: center;
		border-right: 1px solid #acacac;
		border-bottom: 1px solid #acacac;
	}
	.jt-fn-ul li:nth-child(3n){
		border-right-width:0;
	}
	
</style>