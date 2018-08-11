<template>
	<div class="repair-box row-box">
		<div class="repair-tab">
			<span v-for="(list,i) in tabdata.tabhead" :key="i" :class="{active:list.id == tabdata.isFinish.id}" @click="tabdata.isFinish = list;">{{list.name}}</span>
		</div>
		<div class="repair-ul">
			<mt-loadmore :bottom-method="loadbottom" :bottom-all-loaded="allLoaded" :auto-fill="autofill" ref="loadmore">
				<div class="repairlist-box" v-for="(list,i) in listdata[tabdata.isFinish.id]">
					<span class="reqair-list" @click="list.operation = !list.operation" :class="{delay:list.delay}">
						<span class="left-icon"><i class="iconfont" :class="list.icon"></i></span>
						<div class="content-page content-page-c">
							<p>{{list.info1}}</p>
							<p>
								<span>{{list.info3}}</span>
								<span>{{list.info4}}</span>
							</p>
						</div>
						<div class="right-arr">
							<i class="iconfont icon-add"></i>
							<p>{{list.info5}}</p>
						</div>
					</span>
					<div class="rep-operation-box" v-if="list.operation">
						<span v-for="(li,i) in operationc" :key="i" @click="operationClick(li,list)">
							<i class="iconfont" :class="li.icon"></i>
							<span>{{li.info}}</span>
						</span>
					</div>
				</div>
			</mt-loadmore>
		</div>
		
		<right-pop ref="rightpop"></right-pop>
		<mt-datetime-picker ref="picker" title="请选择时间" type="date" v-model="pickerValue" @confirm="handleConfirm" :startDate="new Date()">
		</mt-datetime-picker>
	</div>
</template>

<script>
	import '@/static/liststyle.css'
	import {mapState,mapGetters,mapMutations} from 'vuex';
	import RightPop from '@/components/assembly/rightPop'
	export default{
		components:{RightPop},
		props:['listdata','operationc'],
		data(){
			let repairData = this.$store.state.repairData;
			return{
				autofill:false,
				allLoaded:false,
				scrollMode:'touch',
				operation:{
					start:{
						icon:'icon-kaishi',
						info:'开始',
						event:() => {
							this.$router.push('/workInspectlun')
						}
					},
					delay:{
						icon:'icon-yanqi',
						info:'延迟',
						event:() => {
							this.openPicker();
						}
					},
					complete:{
						icon:'icon-jieshu',
						info:'已完成',
					},
					normal:{
						icon:'icon-zhengchang',
						info:'正常检点',
						event:(list) => {
							console.log(list)
							this.$router.push('/workHandle1')
						}
					}
				},
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
						html:repairData.title || '工单'
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
					isFinish:{name:'未完成',id:'notfinish'},
					tabhead:[
						{name:'未完成',id:'notfinish'},
						{name:'已完成',id:'finish'}
					],
				}
			}
		},
		methods:{
			loadbottom(){
				this.$refs.loadmore.onBottomLoaded();
			},
			popcomplete(){
				this.popupVisible = !this.popupVisible;
			},
			handleConfirm(data){
				console.log(data)
			},
			openPicker(){
				this.$refs.picker.open();
			},
			operationClick(li,list){
				if(li.event){
					li.event(list)
				}else{
					return false;
				}
			},
		},
		mounted(){
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
		}
	}
</script>

<style>
	.repair-box{
		width: 100%;
	}
	.repair-ul{
		height: calc(100% - 0.68rem);
	}
</style>