<template>
	<div class="workInspectlun-box row-box">
		<tablec v-if="show" :listdata="listdata"></tablec>
		<div class="textarea-box" v-if="textShow">
			<textarea placeholder="" disabled="disabled"></textarea>
		</div>
		<div v-if="show" class="workinspect-list">
			<h3 class="workinspect-title">{{$route.query.tyName}}设备</h3>
			<ul class="workinspect-ul">
				<li class="border-bottom" v-for="(list,i) in datalist" :key="i" @click="listclick(list)">
					<span><i class="iconfont icon-donghuanshebeiguanli"></i></span>
					<span>{{list.equName}}</span>
					<i class="iconfont icon-add"></i>
				</li>
			</ul>
		</div>
		<not-found v-if="!show" not="not"></not-found>
	</div>
</template>

<script>
	import Tablec from '@/components/assembly/tablec'
	import notFound from '@/components/notFound'
	import {mapState} from 'vuex'
	export default{
		components:{ Tablec,notFound },
		computed:{
			...mapState(['worklistData'])
		},
		data(){
			return{
				show:false,//判断数据是否加载完成
				textShow:false,//判断文本域是否显示
				headData:[//title数据
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
						html:'',
					}
				],
				datalist:[],//列表数据
				listdata:[],//表格数据
				items:''//总数据
			}
		},
		methods:{
			getPeriodFindDetail(){//获取数据
				this.show = false;
				this.$store.commit('showLoading')
				this.$axios.get(this.$root.URL+'eom/api/turn/detail',{
					params:{
						id:this.$route.query.id,
					}
				}).then((res) => {
					this.show = true;
					this.$store.commit('hideLoading')
					let d = res.data;
					if(!d.result){
						this.items = d.obj;
						this.listdata = this.tablecdata(d.obj);
						this.datalist = d.obj.equNames;
						if(d.obj.ywNm == '周保' || d.obj.ywNm == '检修'){
							this.textShow = true;
						}
					}
				})
			},
			tablecdata(d){//整理表格数据
				let type = d.isFinish == "0"?false:true;//判断是否完成
				if(!type){
					return [
						{name:'计划日期',value:d.pDate},
						{name:'延期日期',value:d.delayDate || '未延期'},	
						{name:'计划开始时间',value:d.pStartTime},	
						{name:'计划结束时间',value:d.pEndTime},	
						{name:'工单状态',value:d.woState},	
						{name:'下发时间',value:d.woIssuedTime},	
						{name:'负责人',value:d.pManagerName},	
						{name:'参与人',value:d.userNames},
					]
				}else{
					return [
						{name:'计划日期',value:d.pDate},
						{name:'延期日期',value:d.delayDate || '未延期'},	
						{name:'计划开始时间',value:d.pStartTime},	
						{name:'计划结束时间',value:d.pEndTime},	
						{name:'工单状态',value:d.woState},	
						{name:'下发时间',value:d.woIssuedTime},	
						{name:'负责人',value:d.pManagerName},	
						{name:'参与人',value:d.userNames},
						{name:'实际开始时间',value:d.startTime},
						{name:'实际结束时间',value:d.endTime},
					]
				}
				
			},
			listclick(list){//判断工单类型跳转子页面
				if(this.$route.query.tyName == '轮保'){
					this.$router.push({
						path:'/workHandle4',
						query:{...list}
					})
				}
				if(this.$route.query.tyName == '周保'){
					this.$router.push({
						path:'/workHandle5',
						query:{...list}
					})
				}
				if(this.$route.query.tyName == '检修'){
					this.$router.push({
						path:'/workHandle7',
						query:{...list}
					})
				}
			}
		},
		
		activated(){
			this.headData[1].html = this.$route.query.name;//修改title
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
			if(!this.$route.meta.isUseCache || this.items == ''){
				this.getPeriodFindDetail();
				this.textShow = false;
				this.footShow = false;
			}
			mui.back = function(){
				history.go(-1)//回退到上一页面
			}
		}
	}
</script>

<style>
	
</style>