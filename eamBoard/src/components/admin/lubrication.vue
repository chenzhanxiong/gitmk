<template>
	<div class="row-box" v-loading="boxloading">
		<div class="content-title">
			<span class="title">润滑管理</span>
			<div class="query-right">
				<el-button plain @click="submitClick">润滑完成</el-button>
			</div>
		</div>
		<div class="content-body">
			<el-table v-loading="list.loading" ref="singleTable" :data="list.listTable" border style="width: 100%" highlight-current-row @current-change="listCurrentChange">
				<el-table-column prop="woStateId" label="状态" min-width="15%">
					<template slot-scope="scope">
						<span v-if="scope.row.woStateId=='NEW'">新建</span>
						<span v-if="scope.row.woStateId=='DLY'">延期</span>
						<span v-if="scope.row.woStateId=='ING'">执行中</span>
						<span v-if="scope.row.woStateId=='SFI'">现场完成</span>
						<span v-if="scope.row.woStateId=='SCK'">现场检查</span>
						<span v-if="scope.row.woStateId=='FIN'">已完成</span>
						<span v-if="scope.row.woStateId=='CHK'">已检查</span>
					</template>
				</el-table-column>
				<el-table-column prop="id" label="工单号" min-width="25%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="equName" label="设备" min-width="20%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="realDate" label="润滑日期" min-width="20%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="realClass" label="班次" min-width="20%"></el-table-column>
			</el-table>
			<el-pagination
			  layout="total,prev, pager, next,jumper"
			  @current-change="listPaging"
			  :current-page="list.pageIndex"
			  :page-size="4"
			  :total="list.total">
			</el-pagination>
			<h2 class="bo-subtitle">任务明细</h2>
			<el-table v-if="list.listTable.length>0" v-loading="detail.loading" :data="detail.table" border style="width: 100%" highlight-current-row>
				<el-table-column label="序号" min-width="7%">
					<template slot-scope="scope">
						<span>{{4*(detail.pageIndex-1)+1+scope.$index}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="positionName" label="部位" min-width="15%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="internalOil" label="润滑油/脂" min-width="12%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="content" label="润滑内容" min-width="15%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="fashion" label="润滑方式" min-width="15%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="points" label="润滑点数" min-width="8%"></el-table-column>
				<el-table-column prop="result" label="润滑结果" min-width="10%">
					<template slot-scope="scope">
						<el-radio-group v-model="scope.row.result" size="mini" :disabled="scope.row.isSave != '-1'">
							<el-radio-button label="1">正常</el-radio-button>
							<el-radio-button label="0">异常</el-radio-button>
						</el-radio-group>
					</template>
				</el-table-column>
				<el-table-column label="异常上报" min-width="8%">
					<template slot-scope="scope">
						<el-button type="danger" :disabled="scope.row.isSave != '-1'" plain v-if="scope.row.result == 0" @click="abnRepClick(scope.row)" size="mini">异常上报</el-button>
					</template>
				</el-table-column>
				<el-table-column label="操作" min-width="10%">
					<template slot-scope="scope">
						<el-button :disabled="scope.row.isSave != '-1'" plain @click="tableSubClick(scope.row)" size="mini">提交</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination v-if="list.listTable.length>0"
			layout="total,prev, pager, next,jumper"
			@current-change="detailPaging"
			:current-page="detail.pageIndex"
			:page-size="4"
			:total="detail.detailTable.length">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import {formatDate} from '@/static/date'
	export default{
		data(){
			return{
				boxloading:false,
				activeData:null,
				activeIndex:0,
				list:{
					pageIndex:1,
					total:0,
					loading:false,
					listTable:[],
				},
				detail:{
					pageIndex:1,
					total:0,
					loading:false,
					detailTable:[],
					table:[]
				},
				
			}
		},
		methods:{
			getlistData(){//获取点检工单列表
				this.list.loading = true;
				this.$axios.get(this.$root.URL+'eom/api/lubrication/list',{
					params:{
						params:{
							query:{
								equKeyId:this.$store.state.activeEquId,
								isFinish:0//是否完成
							},
							pager:{
								pageIndex:this.list.pageIndex,
								pageSize:4
							}
						}
					}
				}).then((res) => {
					this.list.loading = false;
					let data = res.data;
					if(!data.result){
						this.list.listTable = data.item;
						this.list.total = data.total;
						this.$refs.singleTable.setCurrentRow(this.list.listTable[this.activeIndex]);
					}else{
						this.$alert('获取列表失败','提示')
					}
				})
			},
			getcheckdetaildata(id){//获取点检工单详情
				this.detail.loading = true;
				this.$axios.get(this.$root.URL+'eom/api/lubrication/detail/'+id).then((res) => {
					let data = res.data;
					this.detail.loading = false;
					if(!data.result){
						this.detail.detailTable = data.obj.results;
						this.detailPaging(this.detail.pageIndex)
					}else{
						this.$alert('获取详情失败','提示')
					}
				})
			},
			listCurrentChange(val){
				if(this.list.listTable.length == 0){
					return false;
				}
				this.list.listTable.forEach((e,i) =>{
					if(e.id == val.id){
						this.activeIndex = i;
					}
				})
				this.detail.detailTable = [];
				this.activeData = val;
				this.getcheckdetaildata(val.id)
			},
			listPaging(val){
				this.list.pageIndex = val;
				this.activeIndex = 0;
				this.getlistData()
			},
			detailPaging(val){
				this.detail.pageIndex = val;
				this.detail.table = this.detail.detailTable.slice(4*(val-1),4*val)
			},
			tableSubClick(page){
				this.$confirm('确认提交？','提示').then(()=>{
					this.boxloading = true;
					this.$axios.put(this.$root.URL+'eom/api/lubrication/submit/'+page.id,{
						result:page.result,
						endDate:formatDate(new Date(),'yyyy-MM-dd'),
						endTime:formatDate(new Date(),'hh:mm')+':00',
					}).then((res) => {
						this.boxloading = false;
						let d = res.data;
						if(!d.result){
							this.$message({message:'提交成功!',type: 'success'});
							this.getcheckdetaildata(this.activeData.id);
						}else{
							this.$alert(d.errorMsg || '提交失败！','提示')
						}
					})
				}).catch(()=>{
					
				})
			},
			
			submitClick(){//提交全部
				this.$confirm('确认该工单全部完成？','提示').then(()=>{
					this.boxloading = true;
					this.$axios.put(this.$root.URL+'eom/api/lubrication/submitAll/'+this.activeData.id).then((res) => {
						this.boxloading = false;
						let d = res.data;
						if(!d.result){
							this.$message({message:'提交成功!',type: 'success'});
							this.getlistData()
						}else{
							this.$alert(d.errorMsg || '提交失败！','提示')
						}
					})
				}).catch(()=>{
					
				})
			},
			abnRepClick(val){//异常上报
				this.$router.push({
					path:'/jtRepair',
					query:{
						positionCode:val.positionCode,
						positionName:val.positionName,
						majorId:this.activeData.majorId
					}
				})
			}
		},
		computed:{
			activeEquId(){
				return this.$store.state.activeEquId;
			}
		},
		watch:{
			activeEquId(){
				this.getlistData();
			}
		},
		mounted(){
			this.getlistData();
		}
	}
</script>

<style>
	
</style>