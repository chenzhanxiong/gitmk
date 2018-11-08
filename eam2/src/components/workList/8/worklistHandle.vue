<template>
	<div class="row-box">
		<div class="repairdetail-box">
			<routine-list name="设备" :value="listvalue.equName"></routine-list>
			<routine-list name="部位" :value="listvalue.positionName"></routine-list>
			<routine-list name="报修专业" :value="listvalue.major"></routine-list>
			<routine-list name="报修类型" :value="listvalue.oamClassName"></routine-list>
			<routine-list name="报修人员" :value="listvalue.reportman"></routine-list>
			<routine-list class="routine-noBorder" name="报修时间" :value="listvalue.reportTimes"></routine-list>
			<p class="interval"></p>
			<routine-list name="故障级别" :value="listvalue.failureLevel"></routine-list>
			<routine-list name="故障代码" :value="listvalue.faultCode"></routine-list>
			<routine-list name="故障现象" :value="listvalue.failureTxt"></routine-list>
			<routine-list name="异常描述" :value="listvalue.abnormityDes"></routine-list>
			<photolist style="padding: 0.2rem 0.4rem 0;" ref="imglist" isFinish="true"></photolist>
			<p class="interval"></p>
			<routine-list name="计划日期" :value="listvalue.pDate"></routine-list>
			<routine-list name="计划班次" :value="listvalue.pShift"></routine-list>
			<routine-list name="下发时间" :value="listvalue.woIssuedTimes"></routine-list>
			<routine-list name="负责人" :value="listvalue.pManager"></routine-list>
			<routine-list name="指定负责人" :value="listvalue.aManager"></routine-list>
			<routine-list class="routine-noBorder" name="实际维修人" :value="listvalue.aExecman"></routine-list>
			<p class="interval"></p>
			<photolist style="padding: 0.2rem 0.4rem 0;" ref="imglista" v-show="listvalue.workorderStatus != 'NEW'" :isFinish="listvalue.workorderStatus != 'ING'"></photolist>
			<routine-list name="开始维修时间" :value="listvalue.aSTimes" v-if="listvalue.workorderStatus != 'NEW'"></routine-list>
			<routine-list name="结束维修时间" :value="listvalue.aETimes" v-if="listvalue.workorderStatus != 'NEW' && listvalue.workorderStatus != 'ING'"></routine-list>
			<routine-list name="维修结果" :value="listvalue.aResult" v-if="listvalue.workorderStatus != 'NEW' && listvalue.workorderStatus != 'ING'"></routine-list>
			<routine-list name="维修时长" :value="listvalue.repairRange+'分钟'" v-if="listvalue.workorderStatus != 'NEW' && listvalue.workorderStatus != 'ING'"></routine-list>
			<routine-list name="故障时长" :value="listvalue.faultRange+'分钟'" v-if="listvalue.workorderStatus != 'NEW' && listvalue.workorderStatus != 'ING'"></routine-list>
			<p class="interval" v-if="listvalue.workorderStatus != 'NEW'"></p>
			<routine-list class="routine-noBorder" name="维修过程描述" v-if="listvalue.workorderStatus != 'NEW' && listvalue.workorderStatus != 'ING'" :value="listvalue.aProcedureTxt" :arr="listvalue.isFinish == '0'" @event="hrefjump('aProcedureTxt','维修过程描述')"></routine-list>
			<p class="interval" v-if="listvalue.workorderStatus != 'NEW' && listvalue.workorderStatus != 'ING'"></p>
		</div>
		<work-footer :page="listvalue" isSave="true" @startFn="repairStart" @endFn="repairSubmit" @closeFn="repairClose"></work-footer>
	</div>
	
</template>

<script>
	import {mapState} from 'vuex';
	import RoutineList from '@/components/assembly/routineList'
	import Photolist from '@/components/assembly/photolist'
	import workFooter from '@/components/assembly/workfooter'
	export default{
		components:{RoutineList,Photolist,workFooter},
		computed:{
			...mapState({
				textarea:state => state.abnorData.textarea,
			})
		},
		data(){
			return{
				num:0,
				show:false,
				isSubmit:false,
				headData:[
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
					},
					{
						show:true,
						html:'状态'
					}
				],
				img:[],
				listvalue:''
			}
		},
		methods:{
			ti(){
				console.log(11)
			},
			getRepairDetail(){//获取维修列表
				this.$store.commit('showLoading')
				this.$axios.get(this.$root.URL+'eom/api/repair/detail/'+this.$route.query.id)
				.then((res) => {
					this.$store.commit('hideLoading')
					let d = res.data;
					if(!d.result){
						this.listvalue = d.obj;
						this.listvalue.imgBindId = this.listvalue.eResultImgBindId;
						this.$refs.imglist.displayImg(this.listvalue.aFailureImgBindId);
						if(this.listvalue.workorderStatus != 'NEW'){
							this.$refs.imglista.displayImg(this.listvalue.eResultImgBindId);
						}
					}else{
						this.$MessageBox('提示','获取数据失败！')
					}
				})
			},
			repairStart(){//开始维修
				let work = this.listvalue;
				this.$store.commit('showLoading');
				this.$axios.put(this.$root.URL+'eom/api/repair/start/'+this.$route.query.id,{
					startDateMb:work.startDateMb,
					startTimeMb:work.startTimeMb
				})
				.then(res => {
					this.$store.commit('hideLoading');
					let data = res.data;
					if(!data.result){
						this.isSubmit = true;
						this.$Toast({message:'开始维修!'});
						this.savePhoto();
						this.getRepairDetail();
					}else{
						this.$MessageBox('提示',data.errorMsg);
					}
				})
				
			},
			repairSubmit(){//结束维修
				let work = this.listvalue;
				this.$store.commit('showLoading');
				this.$axios.put(this.$root.URL+'eom/api/repair/submit/'+this.$route.query.id,{
					...work
				})
				.then(res => {
					this.$store.commit('hideLoading');
					let data = res.data;
					if(!data.result){
						this.$Toast({message:'结束维修!'});
						this.savePhoto();
						this.getRepairDetail();
						this.isSubmit = true;
					}else{
						this.$MessageBox('提示',data.errorMsg);
					}
				})
				
			},
			repairClose(){//关闭工单
				this.$store.commit('showLoading');
				this.$axios.put(this.$root.URL+'eom/api/repair/close/'+this.$route.query.id,{
					aProcedureTxt:this.listvalue.aProcedureTxt
				})
				.then(res => {
					this.$store.commit('hideLoading');
					let data = res.data;
					if(!data.result){
						this.$Toast({message:'关闭工单!'});
						this.getRepairDetail();
						this.isSubmit = true;
					}else{
						this.$MessageBox('提示',data.errorMsg);
					}
				})
			},
			hrefjump(that,name){
				if(this.listvalue.isFinish == '1'){
					return false;
				}
				this.textarea.placeholder = '请输入维修过程描述';
				this.$router.push({
					name:'Describe',
					params:{list:this.listvalue,that:that,name:name,redirect: this.$router.currentRoute.name,isDisabled:false},
				})
			},
			savePhoto(){//保存照片
				let dd = this.listvalue;
				this.$axios.post(this.$root.URL+'eom/api/photo/save',{
					results:this.$store.state.imgBindId[dd.eResultImgBindId] || []
				}).then(res => {
					let d = res.data;
					if(!d.result){
						//this.$Toast({message:'提交照片成功!'});
					}else{
						this.$MessageBox('提示','提交照片失败！');
					}
				})
			},
		},
		beforeRouteEnter(to, from, next){
			next(vm => {
				if(vm.listvalue == null){
					vm.getRepairDetail();
				}
				if(from.meta.index < to.meta.index){
					vm.getRepairDetail();
				}else{
					//vm.listvalue = vm.$route.params.list;
				}
			})
		},
		beforeRouteLeave(to, from, next){
			if(this.isSubmit){
				to.meta.isUseCache = false;  
			}else{
				to.meta.isUseCache = true;
			}
			next()
		},
		activated(){//默认执行
			this.headData[1].html = this.$route.query.name;
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
			mui.back = function(){
				history.go(-1)//回退到上一页面
			}
		},
		mounted(){
			
		}
	}
</script>

<style>
	.repairdetail-box{
		width: 100%;
		position: absolute;
		top: 0;
		width: 100%;
		bottom: 1rem;
		overflow: auto;
	}
</style>