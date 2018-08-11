<template>
	<div class="report-box row-box">
		<div class="details-list">
			<routine-list v-for="(list,i) in listdata" v-if="i < 2" :key="'a'+i" :listdata="list"></routine-list>
			<photolist style="padding: 0.2rem 0.4rem 0;" :listdata="listdata[2].img"></photolist>
			<routine-list v-for="(list,i) in listdata" v-if="i >= 2 && i < 4" :key="'a'+i" :listdata="list"></routine-list>
			<p class="interval"></p>
			<routine-list v-for="(list,i) in listdata" v-if="i >= 4 && i < 7" :key="'a'+i" :listdata="list"></routine-list>
			<p class="interval"></p>
			<routine-list v-for="(list,i) in listdata" v-if="i >= 7 && i < 9" :key="'a'+i" :listdata="list"></routine-list>
			<p class="interval"></p>
			<div class="list-model">
				<button class="list-submit" :disabled="abnorData.submitType">提交</button>
			</div>
		</div>
		<mt-popup v-model="abnorData.popupVisible" popup-transition="popup-fade">
		  	<div class="report-pop-msg">
		  		<span class="radio-list" v-for="(list,i) in abnorData.popuplist.list" :key="i" @click="abnorData.popuplist.active = list.name"><i class="radious" :class="{active:abnorData.popuplist.active == list.name}"></i>{{list.name}}</span>
		  	</div>
		  	<div class="report-pop-btn" @click="popcomplete">
		  		<span>完成</span>
		  	</div>
		</mt-popup>
	</div>
</template>

<script>
	import {mapState,mapGetters,mapMutations} from 'vuex';
	import RoutineList from '@/components/assembly/routineList'
	import Photolist from '@/components/assembly/photolist'
	
	export default{
		data(){
			let abnorData = this.$store.state.abnorData;
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
						html:'异常上报'
					},
					{
						show:true,
						html:'保存',
						event:() => {
							
						}
					}
				],
				major:{
					name:'major',
					active:abnorData.abnorReport.major,
					list:[
						{
							name:'机械',
						},
						{
							name:'电器'
						},
						{
							name:'专业三'
						}
					]
				},
				level:{
					name:'level',
					active:abnorData.abnorReport.level,
					list:[
						{
							name:'一般故障',
						},
						{
							name:'严重故障'
						},
						{
							name:'自主维修'
						}
					]
				},
				listdata:[
					{
						parameterName:'name',
						name:'设备名称',
						porp:abnorData.abnorReport.name,
						href:'/',
						event:(list) => {
							abnorData.parameters = list;
							this.$router.push({path:'/assPhotos'})
						}
					},
					{
						parameterName:'position',
						porp:abnorData.abnorReport.position,
						name:'部位',
						href:'/',
						event:(list) => {
							abnorData.parameters = list;
							this.$router.push({path:'/assPhotos'})
						}
					},
					{
						parameterName:'major',
						porp:abnorData.abnorReport.major,
						name:'专业',
						href:'/',
						img:[{
							src:'../',delete1:false
						},
						{
							src:'../',delete1:false
						}],
						event:(list) => {
							abnorData.parameters = list;
							abnorData.popuplist = this.major;
							abnorData.popupVisible = true;
						}
					},
					{
						parameterName:'abdes',
						porp:abnorData.abnorReport.abdes,
						name:'异常描述',
						href:'/',
						event:(list) => {
							abnorData.parameters = list;
							this.$router.push({path:'/describe'})
						}
					},
					{
						parameterName:'code',
						porp:abnorData.abnorReport.code,
						name:'故障代码',
						href:'/',
						event:(list) => {
							abnorData.parameters = list;
							this.$router.push({path:'/faultTree'})
						}
					},
					{
						parameterName:'phenomenon',
						porp:abnorData.abnorReport.phenomenon,
						name:'故障现象',
						href:'/',
						event:(list) => {
							abnorData.parameters = list;
							this.$router.push({path:'/faultTree'})
						}
					},
					{
						parameterName:'level',
						porp:abnorData.abnorReport.level,
						name:'上报级别',
						href:'/',
						event:(list) => {
							abnorData.parameters = list;
							abnorData.popuplist = this.level;
							abnorData.popupVisible = true;
						}
					},
					{
						parameterName:'solve',
						porp:abnorData.abnorReport.solve,
						name:'已解决',
						check:true,
						event:(list) => {
							abnorData.parameters = list;
							abnorData.abnorReport.solve = !list.porp;
							list.porp = !list.porp;
						}
					},
					{
						parameterName:'handledes',
						porp:abnorData.abnorReport.handledes,
						name:'处理描述',
						href:'/',
						event:(list) => {
							abnorData.parameters = list;
							this.$router.push({path:'/describe'})
						}
					}
				]
			}
		},
		components:{ RoutineList,Photolist },
		computed:{
			...mapState(['abnorData']),
			...mapMutations(['gengxin']),
			...mapGetters(['getAbnorReport']),
		},
		methods:{
			popcomplete(){
				this.abnorData.abnorReport[this.abnorData.popuplist.name] = this.abnorData.popuplist.active;
				this.abnorData.parameters.porp = this.abnorData.popuplist.active;
				this.abnorData.popupVisible = !this.abnorData.popupVisible
			},
		},
		
		watch:{
			getAbnorReport(old) {
				this.$store.commit('judgeinfo');
			},
		},
		mounted(){
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
		}
	}
</script>

<style>
	.report-box{
		width: 100%;
	}
</style>