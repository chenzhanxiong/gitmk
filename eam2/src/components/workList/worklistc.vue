<template>
	<div class="repair-box row-box">
		<div class="repair-tab">
			<span v-for="(list,i) in tabdata.tabhead" :key="i" :class="{active:i == tabdata.isFinish}" @click="tabclick(i)">{{list}}</span>
		</div>
		<div class="repair-ul">
			<mt-loadmore v-show="listdata.length > 0" :bottom-method="loadbottom" :bottom-all-loaded="allLoaded" :auto-fill="autofill" ref="loadmore">
				<div class="repairlist-box" v-for="(list,i) in listdata">
					<span class="reqair-list border-bottom" @click="liClick(list)" :class="{delay:list.isdelay == '1' && list.isFinish == '0',vnew:list.woStateId == '01'}">
						<span class="left-icon"><i class="iconfont" :class="list.icon"></i></span>
						<div class="content-page content-page-c" :class="{pagelast:pagelast,'pagelast-none':pagelastNone}">
							<p>
								<span>{{list.info1}}</span>
								<span v-if="list.isFinish == '1' && !list.info10" :class="{colorRed:list.info2 == '异常' || list.info2 == '未解决故障'}">{{list.info2}}</span>
								<span v-if="list.info10">{{list.info10}}</span>
							</p>
							<p>
								<span>{{list.info3}}</span>
								<span :class="{colorRed:list.info4 == '异常'}">{{list.info4}}</span>
							</p>
						</div>
						<div class="right-arr">
							<i class="iconfont icon-add" v-if="list.isFinish == '0' || query.name != '维修'"></i>
							<p class="oneline" v-html="list.info5"></p>
						</div>
					</span>
					<div class="rep-operation-box border-bottom" v-if="list.operation">
						<span v-for="(li,i) in operationc" :key="i" v-if="li.show" @click="operationClick(li,list)">
							<i class="iconfont" :class="li.icon"></i>
							<span>{{li.info}}</span>
						</span>
					</div>
				</div>
			</mt-loadmore>
			<div class="baseline" v-if="allLoaded">我是有底线的</div>
			<not-found v-show="listdata.length <= 0" not="true"></not-found>
		</div>
		
		<right-pop ref="rightpop" @getlistData="$emit('getlistData')"></right-pop>
		<mt-datetime-picker ref="picker" title="请选择时间" type="date" v-model="pickerValue" @confirm="confirm" >
		</mt-datetime-picker>
	</div>
</template>

<script>
	
	import {mapState,mapGetters,mapMutations} from 'vuex'
	import {formatDate} from '@/static/date'
	import RightPop from '@/components/assembly/rightPop'
	import notFound from '@/components/notFound'
	export default{
		components:{RightPop,notFound},
		props:['listdata','operationc','pagelast','pagelastNone','query'],
		data(){
			return{
				autofill:false,
				allLoaded:false,
				//scrollMode:'touch',
				operationlist:['normal','delay'],
				rightpop:false,
				pickerValue:new Date(),
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
						html:this.query.name + '工单'
					},
					{
						show:true,
						icon:'icon-shaixuan',
						event:() => {
							this.$refs.rightpop.popsild()
						}
					}
				],
				tabdata:{
					isFinish:this.$store.state.worklistData.isFinish,
					tabhead:['未完成','已完成'],
				}
			}
		},
		methods:{
			loadbottom(){//下拉加载
				this.$parent.getlistData(false);
			},
			popcomplete(){//弹框显示隐藏
				this.popupVisible = !this.popupVisible;
			},
			confirm(data){//返回延迟时间
				this.$emit('putDelay',formatDate(data,'yyyy-MM-dd'))
			},
			openPicker(list){//打开时间选择器
				this.pickerValue = new Date();
				this.$refs.picker.open();
			},
			liClick(list){//点击列表
				this.$store.state.worklistData.worklisteQuKeyItem = list;
				if(this.query.name == "维修"){//判断是否为维修工单
					this.$router.push({path:'/workHandle8',query:{...list}});
					return false;
				}
				if(list.isFinish == "0"){//判断是否完成 0为未完成
					if(list.isIng){
						switch(list.isIng){
							case '0':
								this.operationc[0].show = true;
								this.operationc[1].show = false;
								break;
							case '1':
								this.operationc[0].show = false;
								this.operationc[1].show = true;
								break;
							default:
								this.operationc[0].show = false;
								this.operationc[1].show = false;
						}
					}
					this.listdata.forEach(e => {
						if(e == list){
							list.operation = !list.operation;
						}else{
							e.operation = false;
						}
					})
				}else{
					this.operationClick(this.operationc[this.operationc.length-1],list);
				}
			},
			operationClick(li,list){//点击开始结束延迟等事件
				if(li.event){
					li.event(list);
				}else{
					return false;
				}
				//list.operation = false;
			},
			tabclick(index){//点击tab切换
				if(this.tabdata.isFinish != index){
					this.tabdata.isFinish = index;
					this.$parent.getlistData(true)
				}
			},
			headfn(){
				this.headData[1].html = this.query.name +'工单';
				this.allLoaded = false;
				this.$store.state.heads.show = true;
				this.$store.state.heads.headData = this.headData;
			}
		}
	}
</script>

<style>
	.repair-box{
		width: 100%;
	}
	.repair-ul{
		width: 100%;
		height: calc(100% - 0.68rem);
		overflow: auto;
	}
	.hrefView{
		display: inline-block;
		color: #00B393;
		font-size: 0.22rem;
		border-bottom: 1px solid #00B393;
		line-height: 0.3rem;
	}
</style>