<template>
	<div class="row-box" v-loading="getloading">
		<div class="content-title">
			<span class="title">计划维修</span>
			<div class="query-right">
				<el-button plain v-if="list.listTable.length > 0 && activeData.workorderStatus == 'ING'" @click="endVisible = true">维修结束</el-button>
			</div>
		</div>
		<div class="content-body">
			<el-table v-loading="list.loading" ref="singleTable" :data="list.listTable" border style="width: 100%" highlight-current-row @current-change="listCurrentChange">
				<el-table-column prop="workorderStatus" label="状态" min-width="8%">
					<template slot-scope="scope">
						<span v-if="scope.row.workorderStatus=='NEW'">新建</span>
						<span v-if="scope.row.workorderStatus=='DLY'">延期</span>
						<span v-if="scope.row.workorderStatus=='ING'">执行中</span>
						<span v-if="scope.row.workorderStatus=='SFI'">现场完成</span>
						<span v-if="scope.row.workorderStatus=='SCK'">现场检查</span>
						<span v-if="scope.row.workorderStatus=='FIN'">已完成</span>
						<span v-if="scope.row.workorderStatus=='CHK'">已检查</span>
					</template>
				</el-table-column>
				<el-table-column prop="id" label="工单号" min-width="25%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="equName" label="设备" min-width="12%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="major" label="专业" min-width="10%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="oamClassName" label="报修类型" min-width="10%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="reportTime" label="报修时间" min-width="10%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="reportman" label="报修人员" min-width="10%"></el-table-column>
				<el-table-column label="操作" min-width="15%" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<el-tooltip content="到场登记" effect="light">
							<el-button type="success" @click="reachForm.strDate = new Date();reachPop = true;" circle :disabled="scope.row.workorderStatus != 'ING' && scope.row.workorderStatus != 'NEW'">到</el-button>
						</el-tooltip>
						<el-tooltip content="离场登记" effect="light">
							<el-button type="warning" @click="leaveForm.strDate = new Date();leavePop = true" :disabled="scope.row.workorderStatus != 'ING'" circle>离</el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
			  layout="total,prev, pager, next,jumper"
			  @current-change="listPaging"
			  :current-page="list.pageIndex"
			  :page-size="4"
			  :total="list.total">
			</el-pagination>
			<div class="subtitle-box">
				<h2 class="bo-subtitle">任务明细</h2>
				<el-radio-group v-model="tabDetail" class="f-r" size="small">
					<el-radio-button label="1">报修信息</el-radio-button>
					<el-radio-button label="2">维修信息</el-radio-button>
					<el-radio-button label="3">人员信息</el-radio-button>
				</el-radio-group>
			</div>
			<el-table v-if="tabDetail == '2' && list.listTable.length>0" key="wx" v-loading="detail.loading" :data="detail.detailTable" border style="width: 100%" highlight-current-row>
				<el-table-column prop="positionName" label="部位" min-width="12%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="aExecman" label="实际维修人" min-width="12%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="aSTimes" label="开始时间" min-width="20%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="aETimes" label="结束时间" min-width="20%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="aResult" label="维修结果" min-width="12%"></el-table-column>
				<el-table-column prop="repairRange" label="维修时长" min-width="12%">
					<template slot-scope="scope">
						<p v-if="scope.row.repairRange">{{scope.row.repairRange}}min</p>
					</template>
				</el-table-column>
				<el-table-column prop="faultRange" label="故障时长" min-width="12%">
					<template slot-scope="scope">
						<p v-if="scope.row.faultRange">{{scope.row.faultRange}}min</p>
					</template>
				</el-table-column>
			</el-table>
			<el-table v-if="tabDetail == '1' && list.listTable.length>0" key="bx" v-loading="detail.loading" :data="detail.detailTable" border style="width: 100%" highlight-current-row>
				<el-table-column prop="failureLevel" label="故障级别" min-width="12%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="failureTxt" label="故障现象" min-width="12%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="abnormityDes" label="异常描述" min-width="20%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="pDate" label="计划日期" min-width="12%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="pShift" label="计划班次" min-width="12%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="woIssuedTimes" label="下发时间" min-width="20%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="pManager" label="负责人" min-width="12%"></el-table-column>
			</el-table>
			<el-table v-if="tabDetail == '3' && list.listTable.length>0" key="ry" max-height="3.3rem" v-loading="detail.loading" :data="persons" border style="width: 100%" highlight-current-row>
				<el-table-column label="序号" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span>{{scope.$index+1}}</span>
					</template>
				</el-table-column>
				<el-table-column label="工号" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="repairPerson" label="姓名" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="strStartTime" label="到场时间" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="strEndTime" label="离场时间" :show-overflow-tooltip="true"></el-table-column>
			</el-table>
		</div>
		<el-dialog title="到场登记" :visible.sync="reachPop">
			<el-form :model="reachForm" label-width="1.4rem">
				<el-form-item label="姓名:" >
					<el-input v-model="reachForm.repairPerson" style="width: 3.2rem;" placeholder="请输入姓名"></el-input>
				</el-form-item>
				<el-form-item label="到场时间:" >
					<el-date-picker style="width: 3.2rem;"
					  v-model="reachForm.strDate"
					  type="datetime"
					  placeholder="选择日期时间"
					  >
					</el-date-picker>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="reachPop = false">取 消</el-button>
				<el-button type="primary" @click="presentRegister">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="离场登记" :visible.sync="leavePop">
			<el-form :model="leaveForm" label-width="1.4rem">
				<el-form-item label="姓名:" >
					<el-input v-model="leaveForm.repairPerson" style="width: 3.2rem;" placeholder="请输入姓名"></el-input>
				</el-form-item>
				<el-form-item label="离场时间:" >
					<el-date-picker style="width: 3.2rem;"
					v-model="leaveForm.strDate"
					type="datetime"
					placeholder="选择日期时间"
					>
					</el-date-picker>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="leavePop = false">取 消</el-button>
				<el-button type="primary" @click="leaveRegister">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="结束维修" :visible.sync="endVisible">
			<el-form :model="popForm" label-width="1.4rem">
				<el-form-item label="维修结果:" >
					<el-radio-group size="mini" v-model="popForm.aResultId">
						<el-radio label="0">未解决故障</el-radio>
						<el-radio label="1">已解决故障</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="endVisible = false">取 消</el-button>
				<el-button type="primary" @click="pRepairSubmit">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {formatDate} from '@/static/date'
	export default{
		data(){
			return{
				reachPop:false,//到场登记弹框
				leavePop:false,
				getloading:false,
				activeData:null,
				activeIndex:0,
				tabDetail:'1',
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
				},
				persons:[],
				popForm:{
					aResultId:'1'
				},
				endVisible:false,//结束维修弹框
				reachForm:{
					repairPerson:'',
					strDate:new Date(),
				},
				leaveForm:{
					repairPerson:'',
					strDate:new Date(),
				}
			}
		},
		methods:{
			getlistData(){//获取点检工单列表
				this.list.loading = true;
				this.$axios.get(this.$root.URL+'eom/api/repair/list',{
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
						
					}
				})
			},
			getcheckdetaildata(id){//获取工单详情
				this.detail.loading = true;
				this.$axios.get(this.$root.URL+'eom/api/repair/terminal/'+id).then((res) => {
					let data = res.data;
					this.detail.loading = false;
					this.detail.detailTable = [];
					if(!data.result){
						this.detail.detailTable = [{...data.obj}];
						this.persons = data.obj.persons;
					}else{
						
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
				this.activeData = val;
				this.getcheckdetaildata(val.id)
			},
			listPaging(val){
				this.list.pageIndex = val;
				this.activeIndex = 0;
				this.getlistData()
			},
// 			pRepairStart(page){//开始维修
// 				this.$confirm('确认开始维修？','提示',{
// 					type: 'warning'
// 				}).then(()=>{
// 					this.getloading = true;
// 					this.$axios.put(this.$root.URL+'eom/api/repair/start/'+page.id,{
// 						startDateMb:formatDate(new Date(),'yyyy-MM-dd'),
// 						startTimeMb:formatDate(new Date(),'hh:mm')+':00'
// 					})
// 					.then(res => {
// 						this.getloading = false;
// 						let data = res.data;
// 						if(!data.result){
// 							this.$message({message:'开始维修!',type: 'success'});
// 							this.getlistData();
// 						}else{
// 							this.$alert('提交失败!','提示');
// 						}
// 					})
// 				})
// 			},
			presentRegister(){//到场登记
				this.$confirm('确认登记？','提示',{
					type: 'warning'
				}).then(() => {
					this.reachPop = false;
					this.getloading = true;
					this.$axios.post(this.$root.URL+'eom/api/repair/presentRegister',{
						workorderCode:this.activeData.id,
						repairPerson:this.reachForm.repairPerson,
						strStartTime:formatDate(this.reachForm.strDate,'yyyy-MM-dd hh:mm:ss'),
					})
					.then(res => {
						this.getloading = false;
						
						let data = res.data;
						if(!data.result){
							this.$message({message:'登记成功!',type: 'success'});
							this.getlistData();
						}else{
							this.$alert(data.errorMsg,'提示');
						}
					})
				})
			},
			leaveRegister(){//离场登记
				this.$confirm('确认登记？','提示',{
					type: 'warning'
				}).then(() => {
					this.leavePop = false;
					this.getloading = true;
					this.$axios.post(this.$root.URL+'eom/api/repair/leaveRegister',{
						workorderCode:this.activeData.id,
						repairPerson:this.leaveForm.repairPerson,
						strEndTime:formatDate(this.leaveForm.strDate,'yyyy-MM-dd hh:mm:ss'),
					})
					.then(res => {
						this.getloading = false;
						let data = res.data;
						if(!data.result){
							this.$message({message:'登记成功!',type: 'success'});
							this.getlistData();
						}else{
							this.$alert(data.errorMsg,'提示');
						}
					})
				})
			},
			pRepairSubmit(){//结束维修
				this.$confirm('确认结束维修？','提示',{
					type: 'warning'
				}).then(()=>{
					this.getloading = true;
					this.$axios.put(this.$root.URL+'eom/api/repair/presentFinish/'+this.activeData.id,{
						endDateMb:formatDate(new Date(),'yyyy-MM-dd'),
						endTimeMb:formatDate(new Date(),'hh:mm')+':00',
						aResultId:this.popForm.aResultId
					})
					.then(res => {
						this.getloading = false;
						let data = res.data;
						if(!data.result){
							this.endVisible = false;
							this.$message({message:'结束维修!',type: 'success'});
							this.getlistData();
						}else{
							this.$alert(data.errorMsg || '提交失败!','提示');
						}
					})
				})
			},
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