<template>
	<div class="report-box row-box">
		<div class="details-list">
			<routine-list name="设备名称" :value="listvalue.equName" arr="true" @event="choiceequ(listvalue.equCode)"></routine-list>
			<routine-list name="部位" :value="listvalue.positionName" arr="true" @event="choiceequ(listvalue.positionCode,'position')"></routine-list>
			<photolist style="padding: 0.2rem 0.4rem 0;" ref="imgData"></photolist>
			<routine-list name="专业" :value="listvalue.major" arr="true" @event="popshow(listvalue.major,major,'major')"></routine-list>
			<routine-list name="故障发现时间" :value="listvalue.strFaultTime" arr="true" @event="xzTime('strFaultTime')"></routine-list>
			<routine-list class="routine-noBorder" name="异常描述" :value="listvalue.abnormalTxt" arr="true" @event="hrefjump(listvalue,'异常描述','abnormalTxt')"></routine-list>
			<p class="interval"></p>
			<routine-list name="故障代码" :value="listvalue.faultCode" arr="true" @event="xzFaultCode('faultCode')"></routine-list>
			<routine-list class="routine-noBorder" name="故障现象" :value="listvalue.failureTxt" arr="true" @event="xzFaultCode('failureTxt')"></routine-list>
			<p class="interval"></p>
			<routine-list name="上报级别" :value="listvalue.reportLevel" arr="true" @event="popshow(listvalue.reportLevel,reportLevel,'reportLevel')"></routine-list>
			<!-- <routine-list name="已解决" v-if="" :value="listvalue.aResult" check="true" @event="listvalue.aResult = listvalue.aResult== '0'?'1':'0'"></routine-list> -->
			<routine-list name="维修开始时间" v-if="listvalue.reportLevelId == '4'" :value="listvalue.strStartTime" arr="true" @event="xzTime('strStartTime')"></routine-list>
			<routine-list name="维修结束时间" v-if="listvalue.reportLevelId == '4'" :value="listvalue.strEndTime" arr="true" @event="xzTime('strEndTime')"></routine-list>
			<routine-list name="处理描述" v-if="listvalue.reportLevelId == '4'" :value="listvalue.aProcedureTxt" arr="true" @event="hrefjump(listvalue,'处理描述','aProcedureTxt')"></routine-list>
			<div class="list-model">
				<button class="list-submit" @click="repairCenterSubmit" :disabled="false">提交</button>
			</div>
		</div>
		<mt-popup v-model="popupVisible" popup-transition="popup-fade">
		  	<div class="report-pop-msg">
		  		<span class="radio-list" v-for="(list,i) in popupdata.list" :key="i" @click="popupdata.active = list.value"><i class="radious" :class="{active:popupdata.active == list.value}"></i>{{list.text}}</span>
		  	</div>
		  	<div class="report-pop-btn" @click="popcomplete">
		  		<span>完成</span>
		  	</div>
		</mt-popup>
		<mt-datetime-picker ref="picker" title="请选择时间" type="datetime"
		 v-model="pickerValue" @confirm="confirm" >
		</mt-datetime-picker>
	</div>
</template>

<script>
	import {mapState,mapGetters,mapMutations} from 'vuex';
	import RoutineList from '@/components/assembly/routineList'
	import Photolist from '@/components/assembly/photolist'
	import {formatDate} from '@/static/date'
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
					}
				],
				pickerValue:new Date(),
				pickerActive:'',
				popupVisible:false,
				popupdata:{
					that:'',
					id:'',
					active:{
						id:'',
						name:''
					},
					list:[]
				},
				major:[],
				reportLevel:[],
				img:[],
				rules:{
					equName:{msg:'请选择设备！',required:true},
					positionName:{msg:'请选择部位！',required:true},
					majorId:{msg:'请选择专业！',required:true},
					strFaultTime:{msg:'请选择发现故障时间！',required:true},
					faultCode:{required:false},
					failureTxt:{required:false},
					reportLevelId:{msg:'请选择上报级别！',required:true},
					strStartTime:{msg:'请选择维修开始时间！',required:false},
					strEndTime:{msg:'请选择维修结束时间！',required:false},
				},
			}
		},
		components:{ RoutineList,Photolist },
		computed:{
			...mapState({
				textarea:state => state.abnorData.textarea,
				parameters:state => state.abnorData.parameters,
				listvalue:state => state.abnorData.listvalue
			}),
			getlistvalue(){
				return this.listvalue;
			}
		},
		methods:{
			isEqu(that){//判断设备或部位是否存在
				for(let i in this.rules){
					if(i == that+'Id' || i == that){
						return true;
					}else if(this.listvalue[i] == "" && this.rules[i].required){
						this.$MessageBox('提示',this.rules[i].msg);
						return false;
					}
				}
				return true;
			},
			xzFaultCode(obj){
				if(!this.isEqu(obj)){
					return;
				};
				this.$router.push({
					path:'/faultTree',
					query:{id:this.listvalue.positionCode,name:obj},
				})
			},
			xzTime(obj){
				if(!this.isEqu(obj)){
					return;
				};
				this.pickerActive = obj || new Date();
				this.$refs.picker.open();
			},
			confirm(data){
				if(this.pickerActive == 'strEndTime'){
					if(data - new Date(this.listvalue.strStartTime) < 0){
						this.$MessageBox('提示','结束时间不能小于开始时间');
						return false;
					}
				}
				this.listvalue[this.pickerActive] = formatDate(data,'yyyy-MM-dd hh:mm:ss');
			},
			popcomplete(){//弹框点击确认
				this.popupdata.list.forEach(e => {
					if(e.value == this.popupdata.active){
						this.listvalue[this.popupdata.that] = e.text;
						this.listvalue[this.popupdata.that+'Id'] = e.value
					}
				})
				this.popupVisible = false;
			},
			popshow(obj,list,that){//显示弹框
				if(!this.isEqu(that)){
					return false;
				}
				this.popupdata.active = '';
				this.popupdata.that = that;
				this.popupdata.list = list;
				list.forEach(e => {
					if(e.text == obj){
						this.popupdata.active = e.value;
					}
				})
				this.popupVisible = true;
			},
			hrefjump(obj,name,that){//输入描述跳转
				
				switch (that) {
					case 'abnormalTxt':
						this.textarea.placeholder = '请输入异常描述';
					break;
					case 'aProcedureTxt':
						this.textarea.placeholder = '请输入处理描述';
					break;	
				}
				this.$router.push({name:'Describe',params:{list:obj,name:name,that:that}});
			},
			choiceequ(code,type){//选择设备
				if(type == 'position' && code == ''){
					code = this.listvalue.equCode
				}
				this.$router.push({
					path:'/assPhotos',
					query:{
						infoType:'0',
						equCode:this.listvalue.equCode || null,
						positionCode:this.listvalue.positionCode || null,
					},
				})
			},
			repairCenterSubmit(){//提交
				if(!this.isEqu()){
					return;
				};
				if(this.listvalue.abnormalTxt == "" && this.listvalue.failureTxt == ""){
					this.$MessageBox('提示','异常描述与故障现象必须填写其中一个！');
					return false;
				}
				this.$store.commit('showLoading');
				this.$axios.post(this.$root.URL+'eom/api/repairCenter/submit',{
					...this.listvalue,
				}).then(res => {
					this.$store.commit('hideLoading')
					let d = res.data;
					if(!d.result){
						this.savePhoto(d.others[0].value)
					}else{
						this.$MessageBox('提示',d.errorMsg);
					}
				})
			},
			getScreen(){//查询筛选条件
				this.$axios.all([
					this.$axios.get(this.$root.URL+'eom/api/screen/major'),
					this.$axios.get(this.$root.URL+'eom/api/screen/reportLevel')
				]).then(this.$axios.spread((a,b) => {
					if(!a.data.result){
						this.major = a.data.items;
					}
					if(!b.data.result){
						this.reportLevel = b.data.items;
					}
				}))
			},
			savePhoto(aImgBindId){//保存照片
				let dd = this.$store.state.abnImgId;
				let d = this.$store.state.imgBindId[aImgBindId];
				if(!d){
					d = [];
				}
				if(dd.length > 0){
					dd.forEach(e => {
						d.push({...e,imgBindKey:aImgBindId})
					})
				}
				this.$axios.post(this.$root.URL+'eom/api/photo/save',{
					results:d
				}).then(res => {
					let d = res.data;
					if(!d.result){
						this.$Toast({message:'提交成功!'});
						this.$router.back(-1);
					}
				})
			},
			imgAbnormalTxt(imgId){//获取异常描述内容
				let arr = [];
				if(imgId && imgId.length > 0){
					imgId.forEach(e => {
						arr = arr.concat(e.imgItem.split(","));
					})
				}
				arr = [...new Set(arr)];
				this.listvalue.abnormalTxt = arr.join(',');
			}
		},
		
		watch:{
			getlistvalue:{
				deep:true,
				handler(old){
					
				}
			},
			'listvalue.reportLevelId'(old){
				if(old == '4'){
					this.rules.strStartTime.required = true;
					this.rules.strEndTime.required = true;
				}else{
					this.rules.strStartTime.required = false;
					this.rules.strEndTime.required = false;
				}
			}
		},
		beforeRouteEnter(to,from,next){
			
			next(vm => {
				let l = vm.listvalue;
				if(from.meta.index < to.meta.index){
					vm.getScreen();
				}
				if(from.name != 'Home' && from.meta.index < to.meta.index){
					l.repairSourceId = to.query.repairSourceId || '';
					l.positionName = to.query.positionName || '';
					l.postionId = to.query.postionId || '';
					l.positionCode = to.query.positionCode || '';
					l.equName = to.query.equName || '';
					l.equKeyId = to.query.equKeyId || '';
					l.equCode = to.query.equCode || '';
					l.imgBindId = to.query.imgBindId || '';
					l.major = to.query.major || '';
					l.majorId = to.query.majorId || '';
				}
				
				if(l.imgBindId != '' && l.imgBindId != null){
					//vm.$refs.imgData.displayImg(l.imgBindId);
					if(from.name != 'Describe' && from.name != 'AssPhotos' && from.name != 'FaultTree'){
						let imgId = vm.$store.state.abnImgId = vm.$store.state.imgBindId[l.imgBindId]
						vm.imgAbnormalTxt(imgId)
					}
				}else{
					if(from.name != 'Describe' && from.name != 'AssPhotos' && from.name != 'FaultTree'){
						let imgId = vm.$store.state.abnImgId;
						vm.imgAbnormalTxt(imgId)
					}
				}
				vm.$refs.imgData.disAbnImg();
			})
		},
		beforeRouteLeave(to,from,next){
			if(to.meta.index < from.meta.index){
				Object.keys(this.listvalue).forEach(e => {
					this.listvalue[e] = '';
				})
				this.listvalue.aResult = '0';
				this.$store.state.abnImgId = [];
			}
			next();
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
	.report-box{
		width: 100%;
	}
</style>