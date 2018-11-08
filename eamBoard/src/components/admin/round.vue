<template>
	<div class="row-box" v-loading="getloading">
		<div class="content-title">
			<span class="title">设备轮保</span>
			<div class="query-right">
				<el-button plain v-if="workStatus == 'NEW'" @click="startSubClick">轮保开始</el-button>
				<el-button plain v-if="workStatus == 'ING'" @click="endSubClick">轮保完成</el-button>
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
				<el-table-column prop="workorderCode" label="工单号" min-width="25%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="modelName" label="设备" min-width="15%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="planStartTime" label="计划轮保日期" min-width="15%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="planEndTime" label="计划完成时间" min-width="15%"></el-table-column>
				<el-table-column prop="realClass" label="下发时间" min-width="10%"></el-table-column>
				<el-table-column prop="realClass" label="责任人" min-width="12%"></el-table-column>
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
					<el-radio-button label="0">保养任务</el-radio-button>
					<el-radio-button label="1">维修任务</el-radio-button>
				</el-radio-group>
			</div>
			
			<el-table v-if="tabDetail == '0' && list.listTable.length>0" ref="maintainTable" v-loading="maintainDetail.loading" :data="maintainDetail.table" border style="width: 100%" highlight-current-row>
				<el-table-column label="状态" min-width="6%" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<span v-if="scope.row.isSave=='-1'">未提交</span>
						<span v-if="scope.row.isSave !='-1'">已提交</span>
					</template>
				</el-table-column>
				<el-table-column prop="positionName" label="部位" min-width="9%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="maintainContent" label="保养内容" min-width="20%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="maintainStandard" label="保养标准" min-width="12%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="maintainSourceName" label="来源类型" min-width="10%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="standarddetailCode" label="标准明细编号" min-width="15%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="result" label="点检结果" min-width="10%">
					<template slot-scope="scope">
						<el-radio-group v-model="scope.row.result" size="mini" :disabled="scope.row.isSave != '-1'">
							<el-radio-button label="1">正常</el-radio-button>
							<el-radio-button label="0">异常</el-radio-button>
						</el-radio-group>
					</template>
				</el-table-column>
				<el-table-column label="异常上报" min-width="8%">
					<template slot-scope="scope">
						<el-button type="danger" :disabled="scope.row.isSave != '-1' || workStatus != 'ING'" plain v-if="scope.row.result == 0" @click="abnRepClick(scope.row)" size="mini">异常上报</el-button>
					</template>
				</el-table-column>
				<el-table-column label="操作" min-width="10%">
					<template slot-scope="scope">
						<el-button :disabled="scope.row.isSave != '-1' || workStatus != 'ING'" plain @click="maintainSubClick(scope.row)" size="mini">提交</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination v-if="tabDetail == '0' && list.listTable.length>0"
			layout="total,prev, pager, next,jumper"
			@current-change="detailPaging"
			:current-page="maintainDetail.pageIndex"
			:page-size="4"
			:total="maintainDetail.detailTable.length">
			</el-pagination>
			<el-table v-if="tabDetail == '1' && list.listTable.length>0" ref="repairTable" v-loading="repairDetail.loading" :data="repairDetail.table" border style="width: 100%" highlight-current-row>
				<el-table-column label="状态" min-width="8%">
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
				<el-table-column prop="positionName" label="部位" min-width="10%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="faultDesc" label="故障现象/异常描述" min-width="15%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="major" label="专业" min-width="9%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="maintainSourceName" label="来源类型" min-width="15%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="aProcedureTxt" label="维修过程描述" min-width="15%" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column prop="result" label="点检结果" min-width="10%">
					<template slot-scope="scope">
						<el-radio-group v-model="scope.row.result" size="mini" :disabled="!(workStatus == 'ING' && scope.row.woStateId == 'ING')">
							<el-radio-button label="1">正常</el-radio-button>
							<el-radio-button label="0">异常</el-radio-button>
						</el-radio-group>
					</template>
				</el-table-column>
				<el-table-column label="异常上报" min-width="8%">
					<template slot-scope="scope">
						<el-button type="danger" :disabled="!(workStatus == 'ING' && scope.row.woStateId == 'ING')" plain v-if="scope.row.result == 0" @click="abnRepClick(scope.row)" size="mini">异常上报</el-button>
					</template>
				</el-table-column>
				<el-table-column label="操作" min-width="10%">
					<template slot-scope="scope">
						<el-tooltip content="开始" effect="light">
							<el-button type="success" @click="pRepairStart(scope.row)" :disabled="!(workStatus == 'ING' && scope.row.woStateId == 'NEW')" icon="iconfont icon-kaishi" circle></el-button>
						</el-tooltip>
						<el-tooltip content="结束" effect="light">
							<el-button type="danger" @click="wxActiveData = scope.row;endVisible = true;" :disabled="!(workStatus == 'ING' && scope.row.woStateId == 'ING')" icon="iconfont icon-jieshu" circle></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination v-if="tabDetail == '1' && list.listTable.length>0"
			layout="total,prev, pager, next,jumper"
			@current-change="detailPaging1"
			:current-page="repairDetail.pageIndex"
			:page-size="4"
			:total="repairDetail.detailTable.length">
			</el-pagination>
		</div>
		<el-dialog title="结束维修" :visible.sync="endVisible">
			<el-form :model="popForm" label-width="1.4rem">
				<el-form-item label="维修过程描述">
					<el-input type="textarea" :rows="3" v-model="popForm.aProcedureTxt" placeholder="输入维修过程描述"></el-input>
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
				endVisible:false,
				wxActiveData:null,
				popForm:{
					aProcedureTxt:'',
				},
				getloading:false,
				tabDetail:'0',
				workStatus:false,
				activeIndex:0,
				activeData:null,//当前选择
				list:{
					pageIndex:1,
					total:0,
					loading:false,
					listTable:[],
				},
				maintainDetail:{
					pageIndex:1,
					total:0,
					loading:false,
					detailTable:[],
					table:[]
				},
				repairDetail:{
					pageIndex:1,
					total:0,
					loading:false,
					detailTable:[],
					table:[]
				},
				
			}
		},
		methods:{
			getlistData(){//获取轮保工单列表
				this.list.loading = true;
				this.$axios.get(this.$root.URL+'eom/api/turn/list',{
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
			getMaintainDetaildata(id){//获取轮保工单详情保养任务
				this.maintainDetail.loading = true;
				this.$axios.get(this.$root.URL+'eom/api/turn/MaintainDetail/'+id).then((res) => {
					let data = res.data;
					this.maintainDetail.loading = false;
					if(!data.result){
						this.maintainDetail.detailTable = data.obj.results;
						this.detailPaging(this.maintainDetail.pageIndex)
					}else{
						
					}
				})
			},
			getRepairDetaildata(id){//获取轮保工单详情维修任务
				this.repairDetail.loading = true;
				this.$axios.get(this.$root.URL+'eom/api/turn/RepairDetail/'+id).then((res) => {
					let data = res.data;
					this.repairDetail.loading = false;
					if(!data.result){
						this.repairDetail.detailTable = data.obj.results;
						this.detailPaging1(this.repairDetail.pageIndex)
					}else{
						
					}
				})
			},
			startSubClick(){//开始轮保
				this.$confirm('确认开始工单？','提示',{type: 'warning'}).then(()=>{
					this.getloading = true;
					this.$axios.put(this.$root.URL+'eom/api/turn/start/'+this.activeData.id).then((res) => {
						let d = res.data;
						this.getloading = false;
						if(!d.result){
							this.$message({message:'工单开始!',type: 'success'});
							this.getlistData()
						}else{
							this.$alert(d.errorMsg || '开始任务失败!','提示');
						}
					})
				})
			},
			endSubClick(){//完成工单
				this.$confirm('确认完成工单？','提示',{type: 'warning'}).then(()=>{
					this.getloading = true;
					this.$axios.put(this.$root.URL+'eom/api/turn/submitAll/'+this.activeData.id).then((res) => {
						let d = res.data;
						this.getloading = false;
						if(!d.result){
							this.$message({message:'已完成!',type: 'success'});
							this.activeIndex = 0;
							this.getlistData()
						}else{
							let msg = JSON.parse(d.errorMsg);
							let ty = {
								'0':'保养任务',
								'1':'维修任务'
							}
							this.radio3 = msg.ident;
							this.$alert('发现<font color="red">'+ty[msg.ident]+'</font>第<font color="red">'+msg.num+'</font>项未保存!','提示',{
								dangerouslyUseHTMLString: true
							}).then(()=>{
								if(msg.ident == '0'){
									this.$refs.maintainTable.setCurrentRow(this.maintainDetail.table[(msg.num-1)%4]);
								}
								if(msg.ident == '1'){
									this.$refs.repairTable.setCurrentRow(this.repairDetail.table[(msg.num-1)%4]);
								}
							});
							
						}
					})
				})
			},
			maintainSubClick(page){//保养任务提交
				this.$confirm('确认提交？','提示',{type: 'warning'}).then(()=>{
					this.getloading = true;
					this.$axios.put(this.$root.URL+'eom/api/turn/submitMaintain/'+page.id,{
						result:page.result,
						endDateMb:formatDate(new Date(),'yyyy-MM-dd'),
						endTimeMb:formatDate(new Date(),'hh:mm')+':00',
					}).then((res) => {
						this.getloading = false;
						let d = res.data;
						if(!d.result){
							this.$message({message:'提交成功!',type: 'success'});
							this.getMaintainDetaildata(this.activeListId);
						}else{
							this.$alert(d.errorMsg || '提交失败!','提示');
						}
					})
				})
			},
			pRepairStart(page){//开始维修
				this.$confirm('确认开始维修？','提示',{
					type: 'warning'
				}).then(()=>{
					this.getloading = true;
					this.$axios.put(this.$root.URL+'eom/api/turn/startRepair/'+page.id,{
						startDateMb:formatDate(new Date(),'yyyy-MM-dd'),
						startTimeMb:formatDate(new Date(),'hh:mm')+':00'
					})
					.then(res => {
						this.getloading = false;
						let data = res.data;
						if(!data.result){
							this.$message({message:'开始维修!',type: 'success'});
							this.getRepairDetaildata(this.activeData.id);
						}else{
							this.$alert(d.errorMsg || '提交失败!','提示');
						}
					})
				})
			},
			pRepairSubmit(page){//结束维修
				this.$confirm('确认结束维修？','提示',{
					type: 'warning'
				}).then(()=>{
					this.endVisible = false;
					this.getloading = true;
					this.$axios.put(this.$root.URL+'eom/api/turn/endRepair/'+this.wxActiveData.id,{
						endDateMb:formatDate(new Date(),'yyyy-MM-dd'),
						endTimeMb:formatDate(new Date(),'hh:mm')+':00',
						maintainDesc:this.popForm.aProcedureTxt,
						result:this.wxActiveData.result
					})
					.then(res => {
						this.getloading = false;
						let data = res.data;
						if(!data.result){
							this.$message({message:'结束维修!',type: 'success'});
							this.getRepairDetaildata(this.activeData.id);
						}else{
							this.$alert(d.errorMsg || '提交失败!','提示');
						}
					})
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
				this.workStatus = val.workorderStatus;
				this.activeData = val;
				this.getMaintainDetaildata(val.id)
				this.getRepairDetaildata(val.id)
			},
			listPaging(val){
				this.list.pageIndex = val;
				this.activeIndex = 0;
				this.getlistData()
			},
			detailPaging(val){
				this.maintainDetail.pageIndex = val;
				this.maintainDetail.table = this.maintainDetail.detailTable.slice(4*(val-1),4*val)
			},
			detailPaging1(val){
				this.repairDetail.pageIndex = val;
				this.repairDetail.table = this.repairDetail.detailTable.slice(4*(val-1),4*val)
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