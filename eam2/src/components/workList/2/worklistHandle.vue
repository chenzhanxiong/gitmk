<template>
	<div class="work-inspect-box row-box">
		<div class="workxun-box" v-if="swipTab.length > 0 && show">
			<swiper :options="swiperOption" ref="mySwiper">
				<swiper-slide class="workxun-list" v-for="(list,i) in swipTab" :key="i">
					<span><i class="iconfont icon-shebei1"></i><em v-if="list.isFinish == '1'"></em></span>
					<p>{{list.equName}}</p>
				</swiper-slide>
			</swiper>
		</div>
		<div class="slide-child-box" v-if="show" >
			<tablec v-if="tablec" :listdata="tablec"></tablec>
			<inspection-content v-if="show"
				:datelist="datelist" 
				:listdata="inspectionData" 
				:obj="obj" 
				:handle="handle" 
				ref="child" 
				@dataHandle="dataHandle" 
				@sureSubmit="sureSubmit">
			</inspection-content>
			<button class="list-submit" style="margin:0.2rem auto 0.8rem;" 
				@click="handleSubmit" 
				:disabled="!inspectionData.isSave">
				提交
			</button>
		</div>
		
		<not-found v-else not="not"></not-found>
	</div>
</template>

<script>
	import {mapState} from 'vuex';
	import {formatDate} from '@/static/date'
	import {swiper,swiperSlide} from 'vue-awesome-swiper'
	import Tablec from '@/components/assembly/tablec'
	import InspectionContent from '@/components/workList/inspectionContent'
	import notFound from '@/components/notFound'
	export default{
		components:{Tablec,InspectionContent,notFound,swiper,swiperSlide},
		computed:{
			...mapState(['worklistData']),
		},
		data(){
			let self = this;
			return{
				popupVisible:false,
				handle:{
					total:null,//总页数
					page:1,//页数
					title:'点检'
				},
				show:false,//是否显示
				obj:null,//总数据
				swipTab:[],//分类
				tablec:null,//表格数据
				popuplist:[
					{index:'1',value:'正常'},
					{index:'0',value:'异常'}
				],
				inspectionData:{
					arr:null,setValue:null,result:null,phone:null,query:null,isSave:null
				},//当前页的整理数据
				realReadpop:false,//弹框
				swiperOption:{
					centeredSlides:true,
					initialSlide:0,
					slideToClickedSlide: true,
					slidesPerView:3,
					on:{
						slideChangeTransitionEnd:function(swiper){
							self.swipetransitionEnd(this.activeIndex)
						}
					}
				},
				datelist:{
					name:{
						startDate:'',
						startTime:'',
						endDate:'结束日期',
						endTime:'结束时间'
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
						html:''
					}
				],
			}
		},
		methods:{
			getcheckdetaildata(type){
				this.show = false;
				this.$store.commit('showLoading')
				this.$axios.get(this.$root.URL+'eom/api/line/detail/'+this.$route.query.id).then((res) => {
					this.$store.commit('hideLoading');
					this.show = true;
					let data = res.data;
					if(!data.result){
						this.obj = data.obj;
						this.handle.total = this.obj.results.length;
						this.tabData();
						this.tablec = this.tablecdata(this.obj);
						this.dataHandle(type);
						if(type && this.obj.isForce == '1'){
							this.$Toast({message:'该路线为强制路线，请按顺序完成!',position:'bottom'});
						}
						//this.swiper.init();
					}else{
						this.$MessageBox('提示','获取数据失败！')
					}
				})
			},
			tabData(){
				this.swipTab = [];
				this.obj.results.forEach((e,i) => {
					if(this.swipTab.length == 0){
						this.swipTab.push({
							equCode:e.equCode,
							equName:e.equName,
							start:i,
							end:i
						})
					}else if(e.equCode != this.swipTab[this.swipTab.length-1].equCode){
						this.swipTab.push({
							equCode:e.equCode,
							equName:e.equName,
							start:i,
							end:i
						})
					}else{
						this.swipTab[this.swipTab.length-1].end = i
					}
				})
				//this.swiper.init();
			},
			tablecdata(d){//表格数据
				let type = d.isFinish == "0"?false:true;
				if(!type){
					return [
						{name:'计划日期',value:d.planDate},
						{name:'班次',value:d.className},	
						{name:'延期日期',value:d.workorderDelaydate || '未延期'},	
						{name:'巡检日期',value:this.datelist.value.startDate},
						//{name:'巡检人',value:d.inspectionPerson || ''}
					]
				}else{
					return [
						{name:'计划日期',value:d.planDate},
						{name:'班次',value:d.className},	
						{name:'延期日期',value:d.workorderDelaydate || '未延期'},	
						{name:'巡检日期',value:d.startDate},	
						{name:'开始时间',value:d.startTime},	
						{name:'结束时间',value:d.endTime},	
						{name:'巡检结果',value:d.checkResultName},	
						{name:'巡检人',value:d.inspectionPerson || ''}
					]
				}
			},
			dataHandle(type){
				this.silidTo(this.handle.page,type)
				let dd = this.obj;
				let d = dd.results[this.handle.page - 1];
				this.inspectionData.arr = [
					{name:'部位',value:d.positionName},
					{name:'巡检项目',value:d.checkItem},
					{name:'巡检内容',value:d.checkContent},
					{name:'巡检基准',value:d.benchmark},
					{name:'巡检方式',value:d.checkTypeName},
					{name:'巡检点类型',value:d.checkPointTypeName},
					//{name:'正常范围',value:d.normalRange}
				];
				if(d.checkPointType == '2'){
					this.inspectionData.setValue = {name:'实际读数',value:d.setValue || ''};
				}else{
					this.inspectionData.setValue = null;
				}
				this.inspectionData.result = {name:'执行结果',value:d.result || '1'};
				this.inspectionData.phone = {value:d.imgBindId || ''};
				if(d.isSave == '-1' && dd.isIng == '1'){
					if(dd.isForce == '1'){
						if(this.handle.page <= '1'){
							this.inspectionData.isSave = true;
						}else if(dd.results[this.handle.page - 2].isSave == '-1'){
							this.inspectionData.isSave = false;
							this.$Toast({message:'请先完成前面的项目!'});
							this.popupVisible = true;
						}else{
							this.inspectionData.isSave = true;
						}
					}else{
						this.inspectionData.isSave = true;
					}
				}else{
					this.inspectionData.isSave = false;
				}
				this.inspectionData.query = {
					positionName:d.positionName,
					positionCode:d.positionCode,
					postionId:d.postionId,
					equKeyId:d.equKeyId,
					equName:d.equName,
					equCode:d.equCode,
					repairSourceId:dd.ywCode,
					imgBindId:d.imgBindId,
					major:dd.major,
					majorId:dd.majorId
				}
			},
			handleSubmit(){//提交
				this.datelist.value.endDate = formatDate(new Date(),'yyyy-MM-dd');
				this.datelist.value.endTime = formatDate(new Date(),'hh:mm:ss');
				this.$refs.child.$refs.childdate.slidpopupEnd();
			},
			sureSubmit(){ //确认提交
				let dd = this.obj.results[this.handle.page - 1];
				this.$store.commit('showLoading');
				this.$axios.put(this.$root.URL+'eom/api/line/submit/'+ dd.id,{
					actualReading:dd.setValue,
					checkResult:dd.result,
					endDate:this.datelist.value.endDate,
					endTime:this.datelist.value.endTime,
				}).then((res) => {
					this.$store.commit('hideLoading')
					let d = res.data;
					if(!d.result){
						this.savePhoto();
						this.$Toast({message:'提交成功!'});
						this.getcheckdetaildata(true);
					}else{
						this.$MessageBox('提示',d.errorMsg || '提交失败！');
					}
				})
			},
			savePhoto(){//保存照片
				let dd = this.obj.results[this.handle.page - 1];
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
			silidTo(index,type){
				if(index == 1){return false}
				this.swipTab.forEach((e,i) => {
					if((index-1) >= e.start && (index-1) <= e.end){
						if(type){
							this.swiperOption.initialSlide = i
						}else{
							this.$refs.mySwiper.swiper.slideTo(i,800,false)
						}
					}
				})
			},
			swipetransitionEnd(index){//切换设备
				this.handle.page = this.swipTab[index].start+1;
				//this.dataHandle();
				this.$refs.child.$refs.imglist.displayImg(this.inspectionData.phone.value);
			}
		},
		beforeRouteEnter(to, from, next){
			next(vm => {
				if(from.meta.index < to.meta.index){
					vm.show = false;
					if(to.query.page){
						vm.handle.page = to.query.page;
					}else{
						vm.handle.page = 1;
					}
					vm.getcheckdetaildata(true);
				}
				
			});
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
			this.isSubmit = false;
			if(this.$route.query.isIng == '0'){
				this.headData[1].html = this.$route.query.name+'(工单未开始)';
			}
			if(this.$route.query.isIng == '1'){
				this.headData[1].html = this.$route.query.name+'(工单进行中)'
			}
			if(this.$route.query.isFinish == '1'){
				this.headData[1].html = this.$route.query.name+'(工单已结束)';
			}
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
			mui.back = function(){
				history.go(-1)//回退到上一页面
			}
		}
	}
</script>

<style>
	.workxun-box{
		width: 100%;
		height: 1.94rem;
		padding: 0 0.3rem;
	}
	.workxun-box .swiper-container{
		border-bottom: 0.01rem solid #dedede;
	}
	
	.workxun-list{
		text-align: center;
	}
	.workxun-list span{
		display: block;
		margin: 0.3rem auto 0.2rem;
		width: 0.72rem;
		height: 0.72rem;
		border-radius: 0.1rem;
		background: #94ccc2;
		box-sizing: content-box;
		border: 0 solid #b16a42;
		transition: all 200ms;
		text-align: center;
		position: relative;
	}
	.workxun-list span:before{
		content: '';
		width: 0;
		height: 100%;
		display: inline-block;
		vertical-align: middle;
	}
	.workxun-list span i{
		font-size: 0.3rem;
		display: inline-block;
		vertical-align: middle;
		color: #fff;
		font-weight: bold;
	}
	.workxun-list span>em{
		display: block;
		position: absolute;
		width: 0.3rem;
		height: 0.3rem;
		border: 0.02rem solid #fff;
		background-color:#94ccc2;
		border-radius: 100%;
		right: -0.1rem;
		bottom: -0.1rem;
	}
	.workxun-list span>em:before{
		content: '';
		display: block;
		width: 0.15rem;
		height: 0.07rem;
		border: 0.02rem solid #fff;
		border-top-width: 0;
		border-right-width: 0;
		transform: translate(0.05rem,0.06rem) rotate(-40deg);
	}
	.workxun-list.swiper-slide-active>span{
		background-color: #00B393;
	}
	.workxun-list.swiper-slide-active>span>em{
		background-color: #00B393;
	}
</style>