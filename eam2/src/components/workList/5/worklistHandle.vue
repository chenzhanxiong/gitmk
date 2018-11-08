<template>
	<div class="work-inspect-box row-box">
		<div class="repair-tab">
			<span v-for="(li,i) in tabList" :class="{active:activeTab == i}" :key="i" @click="activeTab = i;swiper.slideTo(i)">{{li}}</span>
		</div>
		<swiper :options="swiperOption" ref="mySwiper" class="tab-hei">
			<swiper-slide>
				<div class="slide-child-box" v-if="byData.show" >
					<tablec :listdata="byData.tablec"></tablec>
					<inspection-content
						:datelist="datelist" 
						:listdata="byData.inspectionData" 
						:obj="byData.obj" 
						:handle="byData.handle" 
						ref="bychild" 
						@dataHandle="dataHandle" 
						@sureSubmit="sureSubmit">
					</inspection-content>
					<button class="list-submit" style="margin:0.2rem auto 0.8rem;" 
						@click="handleSubmit" 
						:disabled="!byData.inspectionData.isSave">
						提交
					</button>
				</div>
				<not-found v-if="!byData.show" not="not"></not-found>
			</swiper-slide>
			<swiper-slide>
				<div class="slide-child-box" v-if="wxData.show">
					<tablec :listdata="wxData.tablec"></tablec>
					<inspection-content
						:listdata="wxData.inspectionData"
						:obj="wxData.obj" 
						:handle="wxData.handle" 
						:page="wxData.inspectionData.workfootData"
						@dataHandle="dataHandle1" 
						>
					</inspection-content>
				</div>
				<work-footer :page="wxData.inspectionData.workfootData" :isSave="wxData.obj.workorderStatus == 'ING'" v-if="wxData.show" @startFn="pRepairStart" @endFn="pRepairSubmit"></work-footer>
				<not-found v-if="!wxData.show" not="not"></not-found>
			</swiper-slide>
		</swiper>
	</div>
</template>

<script>
	import {mapState} from 'vuex'
	import {swiper,swiperSlide} from 'vue-awesome-swiper'
	import {formatDate} from '@/static/date'
	import Tablec from '@/components/assembly/tablec'
	import InspectionContent from '@/components/workList/inspectionContent'
	import workFooter from '@/components/assembly/workfooter'
	import notFound from '@/components/notFound'
	export default{
		components:{notFound,Tablec,InspectionContent,swiper,swiperSlide,workFooter},
		computed:{
			...mapState(['worklistData']),
			swiper(){
				return this.$refs.mySwiper.swiper
			}
		},
		data(){
			let self = this;
			return{
				tabList:['保养任务','维修任务'],//tab内容
				activeTab:0,//当前tab项
				byData:{//保养任务
					handle:{
						total:null,//总页数
						page:1,//页数
						title:'保养'
					},
					show:false,//是否显示
					obj:null,//总数据
					tablec:null,//表格数据
					tablecL:null,//表格数据
					inspectionData:{
						arr:null,result:null,phone:null,query:null,isSave:null
					},//当前页的整理数据
				},
				wxData:{//维修任务
					handle:{
						total:null,//总页数
						page:1,//页数
						title:'维修'
					},
					show:false,//是否显示
					obj:null,//总数据
					tablec:null,//表格数据
					tablecL:null,//表格数据
					inspectionData:{
						arr:null,result:null,phone:null,query:null,isSave:null,workfootData:null,describe:null
					},//当前页的整理数据
				},
				swiperOption:{//swiper默认属性
					initialSlide:0,//初始化当前页
					on:{
						transitionEnd:function(swiper){//动画结束执行函数
							self.activeTab = this.activeIndex
						}
					}
				},
				datelist:{//点击提交时弹框内容
					name:{
						startDate:'',
						startTime:'',
						endDate:'保养日期',
						endTime:'保养时间'
					},
					value:{
						startDate:'',
						startTime:'',
						endDate:'',
						endTime:''
					}
				},
				headData:[//页面头部内容
					{
						show:true,
						icon:'icon-fanhui',
						close:true,
						event:() => {
							this.$router.back(-1);
						}
					},
					{
						show:true,
						input:false,
						html:this.$route.query.name
					}
				],
			}
		},
		methods:{
			tabClick(i){
				this.activeTab = i;
				this.swiper.slideTo(i)
			},
			getcheckdetaildata(){
				this.byData.show = false;
				this.$store.commit('showLoading')
				this.$axios.get(this.$root.URL+'eom/api/week/MaintainDetail/'+this.$route.query.id).then((res) => {
					this.$store.commit('hideLoading');
					this.byData.show = true;
					let data = res.data;
					if(!data.result){
						this.byData.obj = data.obj;
						this.byData.handle.total = this.byData.obj.results.length;
						this.tablecdata(this.byData.obj);
						this.dataHandle();
						this.byData.show = true;
					}else{
						this.$MessageBox('提示','获取保养任务失败!');
					}
				})
			},
			tablecdata(d){//表格数据
				let type = (d.workorderStatus == "NEW" || "ING")?false:true;
				let arr = [];
				let status = {//工单状态
					'NEW':'新建',
					'DLY':'延期',
					'ING':'执行中',
					'SFI':'现场完成',
					'SCK':'现场检查',
					'FIN':'已完成',
					'CHK':'已检查'
				};
				if(!type){
					arr = [
						{name:'计划日期',value:d.pStartDate},
						{name:'工单状态',value:status[d.workorderStatus]},
						{name:'计划开始时间',value:d.pStartTime},
						{name:'计划结束时间',value:d.pEndTime},
						{name:'责任人',value:d.dutyPerson},
						{name:'参与人',value:d.joinPerson},
						{name:'下发时间',value:d.issuedTime},
					]
				}else{
					arr = [
						{name:'计划日期',value:d.pStartDate},
						{name:'工单状态',value:status[d.workorderStatus]},
						{name:'计划开始时间',value:d.pStartTime},
						{name:'计划结束时间',value:d.pEndTime},
						{name:'责任人',value:d.dutyPerson},
						{name:'参与人',value:d.joinPerson},
						{name:'实际日期',value:d.startDate},
						{name:'下发时间',value:d.issuedTime},
						{name:'实际开始时间',value:d.startTime},
						{name:'实际结束时间',value:d.endTime},
					]
				}
				this.byData.tablec = arr;
			},
			tablecdata1(d){//表格数据
				let type = (d.workorderStatus == "NEW" || "ING")?false:true;
				let arr = [];
				let status = {//工单状态
					'NEW':'新建',
					'DLY':'延期',
					'ING':'执行中',
					'SFI':'现场完成',
					'SCK':'现场检查',
					'FIN':'已完成',
					'CHK':'已检查'
				};
				if(!type){
					arr = [
						{name:'计划日期',value:d.pStartDate},
						{name:'工单状态',value:status[d.workorderStatus]},
						{name:'计划开始时间',value:d.pStartTime},
						{name:'计划结束时间',value:d.pEndTime},
						{name:'责任人',value:d.dutyPerson},
						{name:'参与人',value:d.joinPerson},
						{name:'下发时间',value:d.issuedTime},
					]
				}else{
					arr = [
						{name:'计划日期',value:d.pStartDate},
						{name:'工单状态',value:status[d.workorderStatus]},
						{name:'计划开始时间',value:d.pStartTime},
						{name:'计划结束时间',value:d.pEndTime},
						{name:'责任人',value:d.dutyPerson},
						{name:'参与人',value:d.joinPerson},
						{name:'实际日期',value:d.startDate},
						{name:'下发时间',value:d.issuedTime},
						{name:'实际开始时间',value:d.startTime},
						{name:'实际结束时间',value:d.endTime},
					]
				}
				this.wxData.tablec = arr;
			},
			dataHandle(data){
				let dd = this.byData.obj;
				let d = dd.results[this.byData.handle.page - 1];
				this.byData.inspectionData.arr = [
					{name:'部位',value:d.positionName || ''},
					{name:'保养内容',value:d.maintainContent || ''},
					{name:'保养标准',value:d.maintainStandard || ''},
					{name:'来源类型',value:d.maintainSourceName || ''},
					{name:'保养人',value:d.maintainPerson || ''}
				];
				this.byData.inspectionData.result = {name:'保养结果',value:d.result};
				this.byData.inspectionData.phone = {value:d.imgBindId || ''};
				if(d.isSave == '-1' && dd.workorderStatus == 'ING'){
					this.byData.inspectionData.isSave = true;
				}else{
					this.byData.inspectionData.isSave = false;
				}
				this.byData.inspectionData.query = {
					positionName:d.positionName,
					positionCode:d.positionCode,
					postionId:d.postionId,
					equKeyId:dd.equKeyId,
					equName:dd.equName,
					equCode:dd.equCode,
					repairSourceId:d.ywCode,
					imgBindId:d.imgBindId,
					major:dd.major,
					majorId:dd.majorId
				}
			},
			dataHandle1(){//维修任务数据整理
				let dd = this.wxData.obj;
				let d = dd.results[this.wxData.handle.page - 1];
				this.wxData.inspectionData.workfootData = d;
				if(this.$route.query.workorderStatus == 'NEW'){
					this.wxData.inspectionData.workfootData.woStateId = '-1';
				}
				this.wxData.inspectionData.workfootData.equKeyId = dd.equKeyId;
				this.wxData.inspectionData.workfootData.equName = dd.equName;
				this.wxData.inspectionData.workfootData.equCode = dd.equCode;
				this.wxData.inspectionData.arr = [
					{name:'部位',value:d.positionName || ''},
					{name:'故障级别',value:d.faultLevelName || ''},
					{name:'来源类型',value:d.maintainSourceName || ''},
					{name:'故障现象',value:d.faultDesc || ''},
					{name:'开始时间',value:(d.startDateMb || '-')+' '+(d.startTimeMb || '-')},
					{name:'结束时间',value:(d.endDateMb || '-')+' '+(d.endTimeMb || '-')},
					{name:'故障时长',value:d.faultRange || ''},
					{name:'维修时长',value:d.repairRange || ''},
					{name:'维修人',value:d.maintainPerson || ''}
				];
				this.wxData.inspectionData.result = {name:'维修结果',value:d.result};
				this.wxData.inspectionData.phone = {value:d.imgBindId || ''};
				this.wxData.inspectionData.aProcedureTxt = {name:'维修过程描述',value:d.aProcedureTxt || ''};
				if(d.woStateId == 'ING' && dd.workorderStatus == 'ING'){
					this.wxData.inspectionData.isSave = true;
				}else{
					this.wxData.inspectionData.isSave = false;
				}
				this.wxData.inspectionData.query = {
					positionName:d.positionName,
					positionCode:d.positionCode,
					postionId:d.postionId,
					equKeyId:dd.equKeyId,
					equName:dd.equName,
					equCode:dd.equCode,
					repairSourceId:dd.ywCode,
					imgBindId:d.imgBindId,
					major:dd.major,
					majorId:dd.majorId
				}
			},
			handleSubmit(){//提交
				this.datelist.value.endDate = formatDate(new Date(),'yyyy-MM-dd');
				this.datelist.value.endTime = formatDate(new Date(),'hh:mm')+':00';
				this.$refs.bychild.$refs.childdate.slidpopupEnd();
			},
			sureSubmit(){//确认提交
				let dd = this.byData.obj.results[this.byData.handle.page - 1];
				this.$store.commit('showLoading');
				this.$axios.put(this.$root.URL+'eom/api/week/submitMaintain/'+dd.id,{
					result:dd.result,
					endDateMb:this.datelist.value.endDate,
					endTimeMb:this.datelist.value.endTime,
				}).then((res) => {
					this.$store.commit('hideLoading')
					let d = res.data;
					if(!d.result){
						this.$Toast({message:'提交成功!'});
						this.savePhoto();
						this.getcheckdetaildata();
					}else{
						this.$MessageBox('提示',d.errorMsg);
					}
				})
				
			},
			savePhoto(){//保存照片
				let dd = this.byData.obj.results[this.byData.handle.page - 1];
				let arr = this.$store.state.imgBindId[dd.imgBindId];
				this.$axios.post(this.$root.URL+'eom/api/photo/save',{
					results:arr
				}).then(res => {
					let d = res.data;
					if(!d.result){
						//this.$Toast({message:'提交照片成功!'});
					}else{
						this.$MessageBox('提示','提交照片失败！');
					}
				})
			},
			savePhotoW(){//保存照片
				let dd = this.wxData.obj.results[this.wxData.handle.page - 1];
				let arr = this.$store.state.imgBindId[dd.imgBindId];
				this.$axios.post(this.$root.URL+'eom/api/photo/save',{
					results:arr
				}).then(res => {
					let d = res.data;
					if(!d.result){
						//this.$Toast({message:'提交照片成功!'});
					}else{
						this.$MessageBox('提示','提交照片失败！');
					}
				})
			},
			pRepairdetail(){//获取维修工单
				this.wxData.show = false;
				this.$store.commit('showLoading');
				this.$axios.get(this.$root.URL+'eom/api/week/RepairDetail/'+this.$route.query.id)
				.then(res => {
					this.$store.commit('hideLoading');
					let data = res.data;
					if(!data.result){
						this.wxData.obj = data.obj;
						this.wxData.handle.total = this.wxData.obj.results.length;
						this.tablecdata1(this.wxData.obj);
						this.dataHandle1();
						this.wxData.show = true;
					}else{
						this.$MessageBox('提示','获取维修任务失败!');
					}
				})
			},
			pRepairStart(){//开始维修
				let work = this.wxData.inspectionData.workfootData;
				this.$store.commit('showLoading');
				this.$axios.put(this.$root.URL+'eom/api/week/startRepair/'+work.id,{
					startDateMb:work.startDateMb,
					startTimeMb:work.startTimeMb
				})
				.then(res => {
					this.$store.commit('hideLoading');
					let data = res.data;
					if(!data.result){
						this.$Toast({message:'开始维修!'});
						this.savePhotoW();
						this.pRepairdetail();
					}else{
						this.$MessageBox('提示',data.errorMsg);
					}
				})
				
			},
			pRepairSubmit(){//结束维修
				let work = this.wxData.inspectionData.workfootData;
				this.$store.commit('showLoading');
				this.$axios.put(this.$root.URL+'eom/api/week/endRepair/'+work.id,{
					endDateMb:work.endDateMb,
					endTimeMb:work.endTimeMb,
					maintainDesc:work.aProcedureTxt,
					result:work.result
				})
				.then(res => {
					this.$store.commit('hideLoading');
					let data = res.data;
					if(!data.result){
						this.$Toast({message:'结束维修!'});
						this.savePhotoW();
						this.pRepairdetail();
					}else{
						this.$MessageBox('提示',data.errorMsg);
					}
				})
				
			}
		},
		beforeRouteEnter(to, from, next){//进入页面执行函数
			next(vm => {
				if(from.meta.index < to.meta.index){
					if(to.query.msg){
						vm.headData[1].html = vm.$route.query.name+'（周保）';
						vm.byData.obj = null;
						vm.wxData.obj = null;
						vm.tabClick(to.query.msg.ident);
						switch(to.query.msg.ident){
							case '0':
								vm.byData.handle.page = to.query.msg.num;
								vm.wxData.handle.page = 1;
							break;
							case '1':
								vm.byData.handle.page = 1;
								vm.wxData.handle.page = to.query.msg.num;
							break;
						}
					}else{
						vm.headData[1].html = vm.$route.query.name+'（周保）';
						vm.byData.handle.page = 1;
						vm.wxData.handle.page = 1;
						vm.byData.obj = null;
						vm.wxData.obj = null;
					}
				}
				if(vm.byData.obj == null){
					vm.getcheckdetaildata();
				}
				if(vm.wxData.obj == null){
					vm.pRepairdetail();
				}
			});
		},
		beforeRouteLeave(to, from, next){//离开页面执行函数
			if(this.isSubmit){
				to.meta.isUseCache = false;  
			}else{
				to.meta.isUseCache = true;
			}
			next()
		},
		activated(){//页面初始化执行函数
			
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
			mui.back = function(){
				history.go(-1)//回退到上一页面
			}
		}
	}
</script>

<style>
	