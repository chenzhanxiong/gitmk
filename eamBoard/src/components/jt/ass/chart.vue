<template>
	<div class="ass-chart">
		<div class="chart-box" ref="text">
			<div v-if="chartData.length > 0" v-for="(list,i) in chartData" :key="i">
				<span class="chart-text" :class="{stop:list.runClass != 1}">{{list.hours}}min</span>
				<div class="chart-body" :class="{stop:list.runClass != 1}" @click.stop="divclick(list,$event)" @dblclick="addTimeSlot(i,list,true)" :style="{'background-image':tabColorr(list.runClass),'background-color': typeColor[list.runClass].asicsColor,width:isWidth(list)+'px'}">
				</div>
				<div class="line first" v-if="i == 0" @click.stop="addTimeSlot(-1,list)">
					<span>{{list.strStartTime.substring(11,16)}}</span>
				</div>
				<div class="line" title="添加时间段" v-if="i < chartData.length" @click.stop="addTimeSlot(i,list)">
					<span v-if="list.hours >= 20">{{list.strEndTime.substring(11,16)}}</span>
				</div>
				<div class="chart-drag iconfont icon-tuozhuai" :class="{stop:list.runClass != 1}" v-if="tabPosition == '1' && i < chartData.length-1" @click.stop @mousedown.left="touchStart(list,i,$event)" @mouseup.left="touchEnd(list,i,$event)">
				</div>
				<div class="selectColor" v-if="list.edit">
					<span class="arrow" :style="{'border-bottom-color':typeColor[list.runClass].asicsColor}"></span>
					<ul>
						<li @click="list.runClass = item.id;list.edit = !list.edit" @mouseenter="tabTypeActive = item.id" v-for="(item,index) in tabType" :key="index" :style="{background:typeColor[item.id].asicsColor}">
							<span v-if="tabTypeActive == item.id" class="arrow1" :style="{'border-right-color':typeColor[item.id].asicsColor}"></span>
							<ul v-if="tabTypeActive == item.id">
								<li @click.stop="list.runClass = e.id;list.edit = !list.edit;$emit('putShift',chartData);" v-for="(e,j) in item.items" :key="j"
									:style="{'background-color':typeColor[e.id].asicsColor,'background-image':tabColorr(e.id)}"
								></li>
							</ul>
						</li>
					</ul>
				</div>
			</div>
			<div v-if="chartData.length == 0" class="el-tree__empty-block"><span class="el-tree__empty-text">暂无数据</span></div>
		</div>
		
		<el-dialog :title="editType?'编辑时间段':'添加时间段'" :visible.sync="dialogFormVisible" width="5rem">
			<el-form :model="form" label-width="1.3rem">
				<el-form-item label="开始时间" >
					<el-input placeholder="请输入内容" style="width: 2.6rem;" disabled v-model="form.strStartTime">
					</el-input>
				</el-form-item>
				<el-form-item label="时长" >
					<el-input-number placeholder="请输入时长" :min="10" style="width: 2.1rem;" v-model="form.lengthTime">
					</el-input-number>
					<span>min</span>
				</el-form-item>
				<el-form-item label="结束时间" >
					<el-input placeholder="请输入内容" style="width: 2.6rem;" disabled v-model="form.strEndTime">
					</el-input>
				</el-form-item>
				<el-form-item label="类型">
					<el-select v-model="form.region" style="width: 2.6rem;" :disabled="editType" placeholder="请选择类型">
						<el-option v-for="(item,i) in runClass" :key="i" :label="item.name" :value="item.runClass">
							<span style="float: left">{{ item.name }}</span>
							<span class="select-color" :style="{background:typeColor[item.runClass].asicsColor}">
								<i v-if="typeColor[item.runClass].changeColor" :style="{background:typeColor[item.runClass].changeColor}">
								</i>
							</span>
							
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" v-if="!editType" @click="submitTimeSlot();dialogFormVisible = false">确 定</el-button>
				<el-button type="primary" v-if="editType" @click="editTimeSlot();dialogFormVisible = false">确 定</el-button>
			</div>
		</el-dialog>
	</div>
		
</template>

<script>
	import {formatDate} from '@/static/date'
	export default{
		props:['chartData','tabPosition'],
		data(){
			return{
				clickTime:null,
				dialogFormVisible:false,
				isclass:[
					{name:'早班',start:'07:50:00',end:'16:20:00'},
					{name:'中班',start:'16:20:00',end:'00:50:00'},
				],
				is_moving:false,
				boxW:0,
				form:{
					strStartTime:'',
					startType:false,
					strEndTime:'',
					endType:false,
					lengthTime:'',
					region:'',
					delivery: false,
					
				},
				runClass:[
					{name:'计划停机',runClass:'0-1'},
					{name:'非计划停机',runClass:'0-2'},
				],
				addIndex:null,//添加或修改下标索引
				editType:false,//是否编辑
				typeColor:{
					'0-1':{asicsColor:'#542fcf'},
					'1':{asicsColor:'#46ad29'},
					'0-2':{asicsColor:'#e31714'},
					'0-1-1':{asicsColor:'#542fcf',changeColor:'#2cc2cb'},
					'0-1-2':{asicsColor:'#542fcf',changeColor:'#e9c534'},
					'0-1-3':{asicsColor:'#542fcf',changeColor:'#a229db'},
					'0-2-1':{asicsColor:'#e31714',changeColor:'#2cc2cb'},
					'0-2-2':{asicsColor:'#e31714',changeColor:'#e9c534'},
					'0-2-3':{asicsColor:'#e31714',changeColor:'#a229db'},
				},
				tabTypeActive:null,
				tabType:[
					{
						name:'计划停机',
						runClass:'0-1',
						child:[
							{
								name:'计划保养停机',
								runClass:'0-1-1'
							},
							{
								name:'计划维修停机',
								runClass:'0-1-2'
							},
							{
								name:'计划维修停机',
								runClass:'0-1-3'
							},
						]
					},
					{
						name:'非计划停机',
						runClass:'0-2',
						child:[
							{
								name:'临时故障',
								runClass:'0-2-1'
							},
							{
								name:'临时故障',
								runClass:'0-2-2'
							},
							{
								name:'临时故障',
								runClass:'0-2-3'
							}
							
						]
					},
				]
			}
		},
		methods:{
			getScreen(){
				this.$axios.get(this.$root.URL+'eom/api/screen/runClass').then((res) => {
					let d = res.data;
					this.tabType = d;
				})
			},
			tabColorr(runClass){//背景色
				let color = this.typeColor[runClass].changeColor || this.typeColor[runClass].asicsColor;
				//return 'linear-gradient(45deg, '+color+' 25%, transparent 25%, transparent 75%, '+color+' 75%, '+color+'), linear-gradient(-45deg, '+color+' 25%, transparent 25%, transparent 75%, '+color+' 75%, '+color+')'
				return 'repeating-linear-gradient(45deg, transparent, transparent 60%, '+color+' 60%, '+color+' 100%)'
			},
			divclick(list,e){
				if(this.is_moving || this.tabPosition == '2'){
					return false;
				}
				clearTimeout(this.clickTime);
				this.clickTime = setTimeout(() => {
					if(list.runClass == 1){
						return false;
					}
					this.chartData.forEach(e => {
						if(e.edit == true && e != list) e.edit = false
					})
					this.tabTypeActive = list.runClass;
					list.edit = !list.edit;
				}, 300);
			},
			addTimeSlot(index,list,runClass){//添加时间段或修改
				if(this.tabPosition == '2'){
					return false;
				}
				clearTimeout(this.clickTime);
				this.editType = false;
				this.addIndex = index;
				this.form.strStartTime = list.strEndTime;
				if(index == -1){
					this.form.strStartTime = list.strStartTime;
				}
				if(index >= this.chartData.length-1){
					this.form.strStartTime = '';
					this.form.strEndTime = list.strEndTime;
				}
				
				this.form.lengthTime = '10';
				this.form.region = '0-1';
				if(runClass){
					this.editType = true;
					this.form.strStartTime = list.strStartTime;
					this.form.strEndTime = list.strEndTime;
					this.form.lengthTime = list.hours;
					this.form.region = list.runClass;
				}
				this.dialogFormVisible = true;
			},
			submitTimeSlot(){//确定添加
				let obj = {
					hours:this.form.lengthTime,
					runClass:this.form.region,
					strStartTime:this.form.strStartTime,
					strEndTime:this.form.strEndTime
				}
				if(this.addIndex == -1){
					this.chartData[0].hours = this.chartData[0].hours - this.form.lengthTime;
					this.chartData[0].strStartTime = this.form.strEndTime;
				}else if(this.addIndex >= this.chartData.length-1){
					this.chartData[this.addIndex].hours = this.chartData[this.addIndex].hours - this.form.lengthTime;
					this.chartData[this.addIndex].strEndTime = this.form.strStartTime
				}else{
					this.chartData[this.addIndex+1].hours = this.chartData[this.addIndex+1].hours - this.form.lengthTime;
					this.chartData[this.addIndex+1].strStartTime = this.form.strEndTime
				}
				
				this.chartData.splice(this.addIndex+1,0,obj);
				this.$emit('putShift',this.chartData,0);
			},
			editTimeSlot(){//确认修改
				let val = Number(this.chartData[this.addIndex].hours) + Number(this.chartData[this.addIndex+1].hours);
				this.chartData[this.addIndex].runClass = this.form.region;
				this.chartData[this.addIndex].hours = this.form.lengthTime;
				this.chartData[this.addIndex].strEndTime = this.form.strEndTime;
				this.chartData[this.addIndex+1].strStartTime = this.form.strEndTime;
				this.chartData[this.addIndex+1].hours = val - this.chartData[this.addIndex].hours;
				this.$emit('putShift',this.chartData,0);
			},
			isTime(list,i){
				let l = 0;
				for(let n=0;n<=i;n++){
					l += this.chartData[n].hours;
				}
				let h = parseInt(l/60);
				
				let m = l%60 < 10?'0'+l%60:l%60;
				return h+8+':'+m
			},
			calculation(){//计算总时长
				let num = 0;
				let start = this.chartData[0];
				let end = this.chartData[this.chartData.length - 1];
				num = new Date(end.strEndTime.replace(/-/g,"/")) - new Date(start.strStartTime.replace(/-/g,"/"))
				return (num/1000/60)
				
			},
			isWidth(list){//计算各模块宽度
				let w = list.hours/this.calculation();
				return this.boxW * w;
			},
			comTimeL(list){//计算各模块时长
				let num = new Date(list.strEndTime.replace(/-/g,"/")) - new Date(list.strStartTime.replace(/-/g,"/"))
				return (num/1000/60)
			},
			isNum(wid){
				let n = wid/this.boxW;
				return parseInt(this.calculation()*n)
			},
			touchStart(list,i,e){
				let val = this.comTimeL(list) + this.comTimeL(this.chartData[i+1])
				let pat = e.target.offsetParent;
				let X = e.clientX;
				let left = pat.offsetLeft + pat.offsetParent.offsetLeft;
				this.is_moving = true;
				let self = this;
				document.onmousemove = function(ev){
					if(self.chartData[i+1].hours > 0){
						list.hours = self.isNum(ev.pageX - left);
						list.strEndTime = new Date(list.strStartTime.replace(/-/g,"/")).getTime() + list.hours*60*1000;
						list.strEndTime = formatDate(new Date(list.strEndTime),'yyyy-MM-dd hh:mm:ss')
						self.chartData[i+1].hours = val - list.hours;
						self.chartData[i+1].strStartTime = list.strEndTime;
						if(list.hours <= 10 && X - ev.clientX > 10){
							list.hours = 10;
							self.touchEnd();
							self.$confirm('是否删除该时间段？','提示',{
								confirmButtonText:'确定',
								cancelButtonText:'取消',
								type: 'warning'
							}).then(()=>{
								self.chartData.splice(i,1);
								self.$emit('putShift',self.chartData,0);
							})
						}
						if(list.hours >= (val-10) && ev.clientX - X > 10){
							list.hours = val-10;
							self.touchEnd();
							self.$confirm('是否删除下一时间段？','提示',{
								confirmButtonText:'确定',
								cancelButtonText:'取消',
								type: 'warning'
							}).then(()=>{
								self.chartData.splice(i+1,1);
								self.$emit('putShift',self.chartData,0);
							})
						}
						self.$emit('putShift',self.chartData,2000);
					}
				};
			},
			touchEnd(list,i,e){
				document.onmousemove = null;
				this.is_moving = false;
			},
			resize(){
				this.boxW = this.$refs.text.offsetWidth - 50;
			}
		},
		computed:{
			
		},
		watch:{
			'form.startType'(val){
				if(val){
					this.form.endType = true;
				}
			},
			'form.lengthTime'(val){
				if(this.addIndex >= this.chartData.length-1){
					this.form.strStartTime = new Date(this.form.strEndTime).getTime() - val*60*1000;
					this.form.strStartTime = formatDate(new Date(this.form.strStartTime),'yyyy-MM-dd hh:mm:ss')
				}else{
					this.form.strEndTime = new Date(this.form.strStartTime).getTime() + val*60*1000;
					this.form.strEndTime = formatDate(new Date(this.form.strEndTime),'yyyy-MM-dd hh:mm:ss')
				}
			},
			
		},
		mounted(){
			let _this = this;
			this.getScreen()
			document.addEventListener('click',(e) => {
				if(this.is_moving){
					this.is_moving = false;
					document.onmousemove = null;
				}
				this.chartData.forEach(e => {
					if(e.edit == true) e.edit = false
				})
			})
			this.resize();
		}
	}
	

</script>

<style>
	
	.chart-box{
		width: 100%;
		margin: 0 auto;
		height: 1rem;
		position: relative;
		padding: 0 20px;
		border-bottom: 0.05rem solid #00B393;
	}
	.chart-box>div{
		float: left;
		height: 100%;
		position: relative;
		transition: box-shadow 100ms;
		-moz-user-select: none;
		-khtml-user-select: none;
		user-select: none;
	}
	.chart-box>div .chart-body{
		display: block;
		height: 100%;
		border-radius: 0.1rem 0.1rem 0 0;
		transition: transform 300ms;
		position: relative;
		background-size: 100% 0.5rem;
	}
	.chart-box>div .chart-body i{
		display: block;
		width: 80%;
		height: 50%;
		position: absolute;
		left: 10%;
		top: 25%;
		border-radius: 4px;
	}
	.chart-box>div .chart-body.stop{
		height: 50%;
		position: relative;
		top: 50%;
	}
	.chart-box>div .chart-body:hover{
		position: relative;
		z-index: 11;
		transform: scale(1.01);
		box-shadow: 0 0 0.1rem #00B393;
	}
	.chart-box>div .chart-text{
		position: absolute;
		top: -0.28rem;
		left: 50%;
		z-index: 13;
		transform: translateX(-50%);
	}
	.chart-box>div .chart-text.stop{
		top: 0.2rem;
	}
	.line{
		position: absolute;
		display: block;
		width: 1px;
		height: 0.1rem;
		top: 1rem;
		right: 0;
		cursor: pointer;
		background: #00B393;
		z-index: 10;
		transform: translateX(50%);
		transition: all 300ms;
	}
	.chart-drag{
		position: absolute;
		width: 0.2rem;
		height: 0.2rem;
		color: #00B393;
		border-radius: 50%;
		top: -0.05rem;
		right: -0.1rem;
		cursor: pointer;
		transition: all 300ms;
		z-index: 12;
		text-align: center;
		font-size: 0.2rem;
	}
	.chart-drag.stop{
		top: 0.45rem;
	}
	.chart-drag:hover{
		color: #01947A;
	}
	.line.first{
		left: 0;
		right: initial;
		transform: translateX(-50%);
	}
	.line>span{
		display: block;
		line-height: 0.2rem;
		position: absolute;
		bottom: -0.2rem;
		left: 50%;
		font-size: 0.18rem;
		transform: translateX(-50%);
	}
	.line:hover{
		width: 0.1rem;
		border-radius: 0.1rem;
		box-shadow: 0 0 0.07rem #999;
	}
	.el-switch__label{
		color: #999;
	}
	.el-switch__label.is-active{
		color: #00B393;
	}
	.select-color{
		float: right;
		display: inline-block;
		margin-top: 0.07rem;
		width:0.3rem;
		height: 0.2rem;
		padding: 0.05rem;
	}
	.select-color i{
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 0.03rem;
	}
	.popve-model-box{
		width: 100%;
		height: auto;
		margin-bottom: 0.1rem;
	}
	.color-button{
		width: 1.5rem;
		height: 0.5rem;
		border-radius: 0.04rem;
		display: inline-block;
		line-height: 0.2rem;
		text-align: center;
		color: #666;
		cursor: pointer;
		transform: all 200ms;
		margin: 0.1rem;
		padding: 0.15rem;
	}
	.color-button i{
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 0.03rem;
	}
	.color-button:hover{
		box-shadow: 0 0 0.1rem #00B393;
	}
	.selectColor{
		position: absolute;
		top: 1.2rem;
		left: 50%;
		transform:translateX(-50%);
		z-index: 10;
	}
	.selectColor .arrow{
		position: absolute;
		width: 0;
		height: 0;
		top: -0.3rem;
		left: 50%;
		transform: translateX(-50%);
		border-width: 0.15rem;
		border-style: solid;
		border-color: rgba(0,0,0,0);
	}
	.selectColor .arrow1{
		position: absolute;
		width: 0;
		height: 0;
		top: 50%;
		right: -0.15rem;
		transform: translateY(-50%);
		border-width: 0.15rem;
		border-style: solid;
		border-color: rgba(0,0,0,0);
	}
	.selectColor li{
		width: 1.2rem;
		height: 0.5rem;
		position: relative;
		border-radius: 0.04rem;
		border: 1px solid #00B393;
		cursor: pointer;
		background-size: 100% 0.5rem;
	}
	.selectColor li:hover{
		box-shadow: 0 0 0.1rem #01947A;
	}
	.selectColor li span{
		float: left;
		width: 50%;
		height: 100%;
		border-radius: 0.04rem;
	}
	.selectColor li>i{
		position: absolute;
		left: 50%;
		top: 0;
		height: 0rem;
		width: 0;
		border-width: 0.25rem;
		border-style: solid;
		border-color: rgba(0,0,0,0);
	}
	.selectColor li>ul{
		position: absolute;
		left: 1.33rem;
		top: 0;
	}
</style>