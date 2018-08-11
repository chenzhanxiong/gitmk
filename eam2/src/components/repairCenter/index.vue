<template>
	<div class="repair-box row-box">
		<div class="repair-tab">
			<span v-for="(list,i) in tabdata.tabhead" :key="i" :class="{active:list.id == tabdata.currentView}" @click="tabdata.currentView = list.id">{{list.name}}</span>
		</div>
		<div class="repair-ul">
			<repair-list v-for="(list,i) in tabdata.tabcontent[tabdata.currentView]" :key="i" :listdata="list"></repair-list>
		</div>
		<right-pop ref="rightpop"></right-pop>
		<mt-datetime-picker ref="picker" title="请选择时间" type="date" v-model="pickerValue" @confirm="handleConfirm" :startDate="new Date()">
		</mt-datetime-picker>
	</div>
</template>

<script>
	import {mapState,mapGetters,mapMutations} from 'vuex';
	import RepairList from '@/components/assembly/repairList'
	import RightPop from '@/components/assembly/rightPop'
	export default {
		name:'repairCenter',
		data(){
			let repairData = this.$store.state.repairData;
			return{
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
						html:repairData.title || '报修中心'
					},
					{
						show:true,
						icon:'icon-shaixuan',
						event:() => {
							this.$refs.rightpop.popsild()
						}
					}
				],
				child:Screen,
				tabdata:{
					currentView:'close',
					tabhead:[
						{name:'已关闭',id:'close'},
						{name:'未关闭',id:'notClosed'}
					],
					tabcontent:{
						close:[
							{
								icon:'icon-guzhangkuaicha',
								name:'故障现象',
								date:'2016-7-17 20:35:23',
								equipment:'点检',
								state:'一般故障',
								vnew:true,
								event:() => {
									this.$router.push('/details');
								}
							},
							{
								icon:'icon-guzhangkuaicha',
								name:'故障现象',
								time:'2016-7-17 20:35:23',
								href:'/',
								equipment:'报修',
								state:'一般故障',
								delay:true,
								operation:null,
								event:(list) => {
									if(list.operation){
										list.operation = null;
									}else{
										list.operation = ['normal','delay','complete'];
									}
								}
							},
							{
								icon:'icon-guzhangkuaicha',
								name:'故障现象',
								time:'2016-7-17 20:35:23',
								href:'/',
								equipment:'日常保养',
								state:'严重故障',
								vnew:false,
								operation:null,
								event:(list) => {
									if(list.operation){
										list.operation = null;
									}else{
										list.operation = ['start','delay'];
									}
								}
							},
							{
								icon:'icon-guzhangkuaicha',
								name:'故障现象',
								time:'2016-7-17 20:35:23',
								href:'/',
								equipment:'巡检',
								state:'自主维修',
								vnew:false
							}
						],
						notClosed:[
							{
								icon:'icon-guzhangkuaicha',
								name:'故障现象',
								time:'2016-7-17 20:35:23',
								href:'/',
								equipment:'点检',
								state:'严重故障',
								vnew:false
							},
						]
					},
				},
			}
		},
		components:{ RepairList,RightPop,Screen },
		methods:{
			popcomplete(){
				this.popupVisible = !this.popupVisible;
			},
			handleConfirm(data){
				console.log(data)
			},
			openPicker(){
				this.$refs.picker.open();
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
	
</style>