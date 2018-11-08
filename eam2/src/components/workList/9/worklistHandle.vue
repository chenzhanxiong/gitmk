<template>
	<div class="row-box">
		<routine-list name="设备" :value="listvalue.equName"></routine-list>
		<routine-list name="部位" :value="listvalue.positionName"></routine-list>
		<routine-list name="上报级别" :value="listvalue.reportLevel"></routine-list>
		<routine-list name="故障代码" :value="listvalue.faultCode"></routine-list>
		<routine-list name="故障现象" :value="listvalue.failureTxt"></routine-list>
		<photolist style="padding: 0.2rem 0.4rem 0;" ref="imglist" isFinish="false"></photolist>
		<routine-list class="routine-noBorder" name="异常描述" :value="listvalue.abnormalTxt"></routine-list>
		<p class="interval"></p>
		<routine-list name="检查方法" :value="listvalue.checkMethod"></routine-list>
		<routine-list name="责任人" :value="listvalue.pManager"></routine-list>
		<routine-list name="检查日期" :value="listvalue.pDate"></routine-list>
		
		<routine-list name="延期日期" :value="listvalue.dDate || '未延期'"></routine-list>
		<ul class="workdetail-in">
			<li>
				<span>检查结果</span>
				<div class="workdetail-radio">
					<span v-for="(list,i) in typelist" :key="i" 
						@click="function(){if(listvalue.isSave == '-1') listvalue.aResultId = list.index}">
						<i class="radious" :class="{active:listvalue.aResultId == list.index,disabled:listvalue.isSave != '-1'}"></i>
						{{list.value}}
					</span>
				</div>
				<button class="list-submit-m" v-if="listvalue.aResultId == '0'" :disabled="listvalue.isSave != '-1'" @click="abnormal">异常上报</button>
			</li>
		</ul>
		<photolist style="padding: 0.2rem 0.4rem 0;" ref="imgLists" :isFinish="listvalue.isSave != '-1'"></photolist>
		<button class="list-submit" :disabled="listvalue.isSave != '-1'" style="margin:0.2rem auto 0.8rem;" @click="handleSubmit">提交</button>
		<date-list :datelist="datelist" ref="childdate" @sureSubmit="sureSubmit"></date-list>
	</div>
</template>

<script>
	import {mapState} from 'vuex';
	import {formatDate} from '@/static/date'
	import RoutineList from '@/components/assembly/routineList'
	import dateList from '@/components/assembly/dateList'
	import Photolist from '@/components/assembly/photolist'
	export default{
		components:{RoutineList,Photolist,dateList},
		computed:{
			...mapState(['worklistData'])
		},
		data(){
			return{
				num:0,
				show:false,
				isSubmit:false,
				typelist:[
					{index:'1',value:'正常'},
					{index:'0',value:'异常'}
				],
				datelist:{
					name:{
						startDate:'',
						startTime:'',
						endDate:'检查日期',
						endTime:'检查时间'
					},
					value:{
						startDate:'',
						startTime:'',
						endDate:'',
						endTime:''
					}
				},
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
				listvalue:'',
			}
		},
		methods:{
			getpreventCheckdetail(){
				this.isSubmit = false;
				this.$store.commit('showLoading')
				this.$axios.get(this.$root.URL+'eom/api/preventCheck/detail/'+this.$route.query.id)
				.then((res) => {
					this.$store.commit('hideLoading')
					let d = res.data;
					if(!d.result){
						this.listvalue = d.obj;
						this.$refs.imglist.displayImg(this.listvalue.aFailureImgBindId);
						this.$refs.imgLists.displayImg(this.listvalue.aResultImgBindId);
					}else{
						this.$MessageBox('提示','获取数据失败！')
					}
				})
			},
			handleSubmit(){//提交
				this.datelist.value.endDate = formatDate(new Date(),'yyyy-MM-dd');
				this.datelist.value.endTime = formatDate(new Date(),'hh:mm')+':00';
				this.$refs.childdate.slidpopupEnd();
			},
			sureSubmit(){
				this.$store.commit('showLoading');
				this.$axios.put(this.$root.URL+'eom/api/preventCheck/submit/'+this.$route.query.id,{
					...this.listvalue,
					endDate : this.datelist.value.endDate
				}).then((res) => {
					this.$store.commit('hideLoading')
					let d = res.data;
					if(!d.result){
						this.$Toast({message:'提交成功!'});
						this.savePhoto();
						this.getpreventCheckdetail();
						this.isSubmit = true;
					}else{
						this.$MessageBox('提示',d.errorMsg);
					}
				})
			},
			savePhoto(){//保存照片
				let dd = this.listvalue;
				this.$axios.post(this.$root.URL+'eom/api/photo/save',{
					results:this.$store.state.imgBindId[dd.aResultImgBindId]
				}).then(res => {
					let d = res.data;
					if(!d.result){
						//this.$Toast({message:'提交照片成功!'});
					}else{
						this.$MessageBox('提示','提交照片失败！');
					}
				})
			},
			abnormal(){//异常上报
				let option = {
					repairSourceId:this.listvalue.ywCode,
					positionName:this.listvalue.positionName,
					postionId:this.listvalue.postionId,
					positionCode:this.listvalue.positionCode,
					equName:this.listvalue.equName,
					equKeyId:this.listvalue.equKeyId,
					equCode:this.listvalue.equCode,
					imgBindId:this.listvalue.aResultImgBindId,
					major:this.listvalue.major,
					majorId:this.listvalue.majorId
				}
				this.$router.push({
					path:'/abnormallyReport',
					query:{...option}
				})
			}
		},
		beforeRouteLeave(to, from, next){
			if(this.isSubmit){
				to.meta.isUseCache = false;  
			}else{
				to.meta.isUseCache = true;
			}
			next()
		},
		activated(){
			this.headData[1].html = this.$route.query.name;
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
			this.getpreventCheckdetail()
			mui.back = function(){
				history.go(-1)//回退到上一页面
			}
		}
	}
</script>

<style>
</style>