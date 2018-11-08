<template>
	<div class="workInspectlun-box row-box">
		<tablec v-if="show" :listdata="listdata"></tablec>
		<div class="textarea-box" v-if="show">
			<div class="workDescribe">
				{{items.workDescribe}}
			</div>
		</div>
		<div v-if="show && datalist.length > 0" class="workinspect-list">
			<h3 class="workinspect-title">检修设备</h3>
			<ul class="workinspect-ul">
				<li v-for="(list,i) in datalist" :key="i" :class="{FIN:list.workorderStatus == 'FIN'}">
					<div class="workinspect-list border-bottom" @click="listclick(list)">
						<span><i class="iconfont icon-donghuanshebeiguanli"></i></span>
						<span>{{list.name}}</span>
						<i class="iconfont icon-add"></i>
					</div>
					<div class="rep-operation-box border-bottom" v-if="list.operation">
						<span v-for="(li,i) in operationc" :key="i" v-if="li.show" @click="operationClick(li,list)">
							<i class="iconfont" :class="li.icon"></i>
							<span>{{li.info}}</span>
						</span>
					</div>
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
				operationc:[
					{
						icon:'icon-kaishi',
						info:'开始',
						show:true,
						event:(list) => {
							this.$MessageBox.confirm('确认开始检修？').then(action => {
								this.putStart(list);
							})
						}
					},
					{
						icon:'icon-wancheng',
						info:'完成',
						show:false,
						event:(list) => {
							this.$MessageBox.confirm('确认完成该项？').then(action => {
								this.endChild(list)
							})
						}
					},
					{
						icon:'icon-weibiaoti--',
						info:'检修详情',
						show:true,
						event:(list) => {
							this.$router.push({path:'/workHandle7',query:{...list}});
						}
					},
				],
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
				this.$axios.get(this.$root.URL+'eom/api/checkRepair/detail/'+this.$route.query.id).then((res) => {
					this.show = true;
					this.$store.commit('hideLoading')
					let d = res.data;
					if(!d.result){
						this.datalist = [];
						this.items = d.obj;
						this.listdata = this.tablecdata(d.obj);
						d.obj.results.forEach((e) => {
							this.datalist = this.datalist.concat(this.handle(e))
						})
						this.datalist.forEach(e => {
							if(this.$route.query.that == e.name){
								this.listclick(e)
							}
						})
						
					}else{
						this.$MessageBox('提示','获取数据失败!');
					}
				})
			},
			handle(d){//整理格式
				let obj = null;
				obj = {
					id:d.id,
					name:d.equName,
					workorderStatus:d.workorderStatus,
					operation:false
				};
				return obj;
			},
			tablecdata(d){//整理表格数据
				let status = {//工单状态
					'NEW':'新建',
					'DLY':'延期',
					'ING':'执行中',
					'SFI':'现场完成',
					'SCK':'现场检查',
					'FIN':'已完成',
					'CHK':'已检查'
				};
				return [
					{name:'计划日期',value:d.pStartDate},
					{name:'工单状态',value:status[d.status]},	
					//{name:'延期日期',value:d.workorderDelaydate || '未延期'},	
					{name:'计划开始时间',value:d.pStartTime},	
					{name:'计划结束时间',value:d.pEndTime},	
					{name:'实际开始时间',value:d.realStartTime || '未开始'},
					{name:'实际结束时间',value:d.realEndTime || '未结束'},
				]
				
			},
			listclick(list){//判断工单类型跳转子页面
				if(this.items.status == "ING"){
					if(list.workorderStatus){
						switch(list.workorderStatus){
							case 'NEW':
								this.operationc[0].show = true;
								this.operationc[1].show = false;
								break;
							case 'ING':
								this.operationc[0].show = false;
								this.operationc[1].show = true;
								break;
							default:
								this.operationClick(this.operationc[this.operationc.length-1],list);
								return false;
								break;
						}
					}
					this.datalist.forEach(e => {
						if(e.id == list.id){
							list.operation = !list.operation;
						}else{
							e.operation = false;
						}
					})
				}else{
					this.operationClick(this.operationc[this.operationc.length-1],list);
				}
			},
			operationClick(li,list){
				if(li.event){
					li.event(list);
				}else{
					return false;
				}
			},
			putStart(list){//开始
				this.$store.commit('showLoading')
				this.$axios.put(this.$root.URL+'eom/api/checkRepair/startChild/'+list.id).then((res) => {
					this.$store.commit('hideLoading')
					let d = res.data;
					if(!d.result){
						this.$Toast({message:'检修开始!'});
						this.getPeriodFindDetail()
					}else{
						this.$MessageBox('提示',d.errorMsg);
					}
				})
			},
			endChild(list){//完成
				this.$store.commit('showLoading')
				this.$axios.put(this.$root.URL+'eom/api/checkRepair/endChild/'+list.id).then((res) => {
					this.$store.commit('hideLoading')
					let d = res.data;
					if(!d.result){
						this.$Toast({message:'已完成!'});
						this.getPeriodFindDetail(true)
					}else{
						let msg = JSON.parse(d.errorMsg);
						let ty = {
							'0':'保养任务',
							'1':'维修任务'
						}
						this.$MessageBox.confirm('发现<font color="red">'+ty[msg.ident]+'</font>第<font color="red">'+msg.num+'</font>项未保存<br/>是否跳转至该项？').then(() => {
							this.$router.push({path:'/workHandle7',query:{id:list.id,name:list.name,msg:msg}});
						})
					}
				})
			}
		},
		beforeRouteEnter(to, from, next){
			next(vm => {
				if(from.meta.index < to.meta.index || vm.items == ''){
					vm.getPeriodFindDetail();
				}
			});
		},
		activated(){
			this.headData[1].html = this.$route.query.name;//修改title
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