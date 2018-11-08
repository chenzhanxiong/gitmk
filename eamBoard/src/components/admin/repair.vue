<template>
	<div class="row-box" v-loading="getloading">
		<div class="content-title">
			<span class="title">报修响应</span>
		</div>
		<div class="content-body">
			<el-table v-loading="list.loading" ref="singleTable" :data="list.listTable" border style="width: 100%" highlight-current-row @current-change="listCurrentChange">
				<el-table-column prop="woState" label="状态" min-width="8%">
					<!-- <template slot-scope="scope">
						<span v-if="scope.row.woStateId=='NEW'">新建</span>
						<span v-if="scope.row.woStateId=='DLY'">延期</span>
						<span v-if="scope.row.woStateId=='ING'">执行中</span>
						<span v-if="scope.row.woStateId=='SFI'">现场完成</span>
						<span v-if="scope.row.woStateId=='SCK'">现场检查</span>
						<span v-if="scope.row.woStateId=='FIN'">已完成</span>
						<span v-if="scope.row.woStateId=='CHK'">已检查</span>
						<span v-if="scope.row.woStateId=='ISS'">已下发</span>
						<span v-if="scope.row.woStateId=='DIS'">已分配</span>
						<span v-if="scope.row.woStateId=='COM'">已解决</span>
					</template> -->
				</el-table-column>
				<el-table-column prop="callTime" label="报修时间" min-width="16%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="major" label="报修专业" min-width="8%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="strResponseTime" label="响应时间" min-width="16%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="responseName" label="响应人" min-width="10%"></el-table-column>
				<el-table-column prop="strAssignTime" label="分配时间" min-width="16%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="assignerName" label="分配人" min-width="10%"></el-table-column>
				<el-table-column prop="realClass" label="响应操作" min-width="8%">
					<template slot-scope="scope">
						<el-button plain size="mini" disabled v-if="scope.row.woStateId != 'NEW'">已响应</el-button>
						<el-button plain size="mini" v-if="scope.row.woStateId == 'NEW'" @click="repairCenterResponse(scope.row.id)">响应</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="realClass" label="处理" min-width="8%">
					<template slot-scope="scope">
						<el-button plain size="mini" disabled v-if="scope.row.woStateId != 'RES' && scope.row.woStateId != 'NEW'">已分配</el-button>
						<el-button plain size="mini" v-if="scope.row.woStateId == 'RES'" @click="dialogFormVisible = true">分配</el-button>
					</template>
				</el-table-column>
				
			</el-table>
			<el-pagination
			  layout="total,prev, pager, next,jumper"
			  @current-change="listPaging"
			  :current-page="list.pageIndex"
			  :page-size="6"
			  :total="list.total">
			</el-pagination>
			<h2 class="bo-subtitle">任务明细</h2>
			<el-table v-if="list.listTable.length>0" v-loading="detail.loading" :data="detail.detailTable" border style="width: 100%" highlight-current-row>
				<el-table-column prop="id" label="报修单号" min-width="15%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="positionName" label="设备部位" min-width="15%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="reportLevel" label="上报级别" min-width="15%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="failureTxt" label="故障现象" min-width="12%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="abnormalTxt" label="问题描述" min-width="17%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="callPerson" label="报修人" min-width="12%"></el-table-column>
				<el-table-column prop="trentmentMethodName" label="处理措施" min-width="14%"></el-table-column>
			</el-table>
		</div>
		<el-dialog title="处理" :visible.sync="dialogFormVisible">
			<el-form :rules="rules" ref="form" :model="form" label-width="1.2rem">
				<el-form-item label="分配:" >
					<el-radio-group size="mini" v-model="form.handleId">
						<el-radio label="2">计划维修</el-radio>
						<el-radio label="3">机会维修</el-radio>
						<el-radio label="4">关闭</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="关闭原因:" prop="closeReason">
					<el-input :disabled="form.handleId != '4'" v-model="form.closeReason" type="textarea" :rows="2" placeholder="输入关闭原因">
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="onSubmit('form')">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				getloading:false,
				activeData:null,
				activeLIstIndex:0,
				list:{
					pageIndex:1,
					total:0,
					loading:true,
					listTable:[],
				},
				detail:{
					pageIndex:1,
					total:0,
					loading:true,
					detailTable:[],
				},
				dialogFormVisible:false,//处理弹框
				form:{//处理弹框数据
					handleId:'2',
					closeReason:''
				},
				rules:{//必填项
					closeReason:[
						{required: false, message: '请填写关闭原因'}
					],
				}
			}
		},
		methods:{
			getlistData(){//获取工单列表
				this.list.loading = true;
				this.$axios.get(this.$root.URL+'eom/api/repairCenter/list',{
					params:{
						params:{
							query:{
								equKeyId:this.$store.state.activeEquId,
								isFinish:0//是否完成
							},
							pager:{
								pageIndex:this.list.pageIndex,
								pageSize:6
							}
						}
					}
				}).then((res) => {
					this.list.loading = false;
					let data = res.data;
					if(!data.result){
						this.list.listTable = data.item;
						this.list.total = data.total;
						this.$refs.singleTable.setCurrentRow(this.list.listTable[this.activeLIstIndex]);
					}else{
						
					}
				})
			},
			getcheckdetaildata(id){//获取工单详情
				this.detail.loading = true;
				this.$axios.get(this.$root.URL+'eom/api/repairCenter/detail/'+id).then((res) => {
					this.detail.loading = false;
					let data = res.data;
					this.detail.detailTable = [];
					if(!data.result){
						this.detail.detailTable.push(data.obj);
					}else{
						
					}
				})
			},
			repairCenterResponse(id){//响应
				this.$confirm('确认响应？','提示',{type: 'warning'})
				.then(()=>{
					this.getloading = true;
					this.$axios.put(this.$root.URL+'eom/api/repairCenter/response/'+id).then((res) => {
						this.getloading = false;
						let data = res.data;
						if(!data.result){
							this.$message({message:'已响应！',type: 'success'});
							this.getlistData()
						}else{
							this.$alert(data.errorMsg || '响应失败!','提示');
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
						this.activeLIstIndex = i;
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
			onSubmit(formName){
				this.$refs[formName].validate((valid) => {
				if (valid) {
					this.distribution()
				} else {
					return false;
				}
				});
			},
			distribution(){
				this.$confirm('确认分配？','提示',{type: 'warning'})
				.then(() => {
					this.getloading = true;
					this.$axios.put(this.$root.URL+'eom/api/repairCenter/handle/'+this.activeData.id,{
						...this.form
					}).then((res) => {
						this.getloading = false;
						let data = res.data;
						if(!data.result){
							this.$message({message:'已分配！',type: 'success'});
							this.dialogFormVisible = false;
							this.getlistData()
						}else{
							this.$alert(data.errorMsg || '分配失败!','提示');
						}
					})
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
			},
			'form.handleId'(old){
				this.form.closeReason = '';
				if(old == '4'){
					this.rules.closeReason[0].required = true;
				}else{
					this.rules.closeReason[0].required = false;
					this.$refs.form.validate()
				}
			}
		},
		beforeRouteEnter(to,from,next){
			next(vm => {
				vm.activeLIstIndex = to.query.index || 0
			})
		},
		mounted(){
			this.getlistData();
		}
	}
</script>

<style>
	
</style>