<template>
	<div class="work-inspect-box row-box">
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
	import Tablec from '@/components/assembly/tablec'
	import InspectionContent from '@/components/workList/inspectionContent'
	import notFound from '@/components/notFound'
	export default{
		components:{notFound,Tablec,InspectionContent},
		computed:{
			...mapState(['worklistData'])
		},
		data(){
			return{
				handle:{
					total:null,//总页数
					page:1,//页数
					title:'保养'
				},
				show:false,//是否显示
				obj:null,//总数据
				tablec:null,//表格数据
				inspectionData:{
					arr:null,setValue:null,result:null,phone:null,query:null,isSave:null
				},//当前页的整理数据
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
						html:'状态'
					}
				],
			}
		},
		methods:{
			getcheckdetaildata(num){
				
				this.show = false;
				this.$store.commit('showLoading')
				this.$axios.get(this.$root.URL+'eom/api/daily/detail/'+this.$route.query.id).then((res) => {
					this.$store.commit('hideLoading');
					this.show = true;
					let data = res.data;
					if(!data.result){
						this.obj = data.obj;
						this.handle.total = this.obj.results.length;
						this.tablec = this.tablecdata(this.obj);
						this.dataHandle();
						this.show = true;
					}else{
						this.$MessageBox('提示','获取数据失败！')
					}
				})
			},
			tablecdata(d){//表格数据
				let type = d.isFinish == "0"?false:true;
				if(!type){
					return [
						{name:'计划日期',value:d.pDate},
						{name:'班次',value:d.pShift},	
						{name:'日保类型',value:d.oamClass},	
						{name:'专业',value:d.major},	
						{name:'延期日期',value:d.dDate || '未延期'},	
						{name:'责任人',value:d.pManager},	
					]
				}else{
					return [
						{name:'计划日期',value:d.pDate},
						{name:'班次',value:d.pShift},	
						{name:'日保类型',value:d.oamClass},	
						{name:'专业',value:d.major},	
						{name:'延期日期',value:d.dDate || '未延期'},	
						{name:'责任人',value:d.pManager},	
						{name:'日保日期',value:d.aSendTime},	
						{name:'保养结果',value:d.aResult}
					]
				}
				
			},
			dataHandle(){
				let dd = this.obj;
				let d = dd.results[this.handle.page - 1];
				this.inspectionData.arr = [
					{name:'部位',value:d.positionName || ''},
					{name:'保养项目',value:d.item || ''},
					{name:'保养内容',value:d.content || ''},
					{name:'保养标准',value:d.benchmark || ''},
					{name:'来源类型',value:d.originType || ''},
					{name:'工时',value:d.manhour || ''}
				];
				this.inspectionData.result = {name:'保养结果',value:d.result || '1'};
				this.inspectionData.phone = {value:d.imgBindId || ''};
				if(d.isSave == '-1'){
					this.inspectionData.isSave = true;
				}else{
					this.inspectionData.isSave = false;
				}
				this.inspectionData.query = {
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
				this.$refs.child.$refs.childdate.slidpopupEnd();
			},
			sureSubmit(){
				let dd = this.obj.results[this.handle.page - 1];
				this.$store.commit('showLoading');
				this.$axios.put(this.$root.URL+'eom/api/daily/submit/'+dd.id,{
					result:dd.result,
					endDate:this.datelist.value.endDate,
					endTime:this.datelist.value.endTime,
				}).then((res) => {
					this.$store.commit('hideLoading')
					let d = res.data;
					if(!d.result){
						this.savePhoto();
						this.$Toast({message:'提交成功!'});
						this.getcheckdetaildata();
					}else{
						this.$MessageBox('提示',d.errorMsg);
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
		},
		beforeRouteEnter(to, from, next){
			next(vm => {
				if(from.meta.index < to.meta.index){
					vm.show = false;
					vm.handle.page = 1;
					vm.getcheckdetaildata();
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
			this.headData[1].html = this.$route.query.name;
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
			mui.back = function(){
				history.go(-1)//回退到上一页面
			}
		}
	}
</script>

<style>
</style>