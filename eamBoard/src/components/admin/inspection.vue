<template>
	<div class="row-box" v-loading="boxloading">
		<div class="content-title">
			<span class="title">巡检管理</span>
			<div class="query-right">
				<el-button plain v-if="activeData.isIng == '0'" @click="startSubClick">巡检开始</el-button>
				<el-button plain v-if="activeData.isIng == '1'" @click="submitAll">巡检完成</el-button>
			</div>
		</div>
		<div class="content-body">
			<el-table v-loading="list.loading" ref="singleTable" :data="list.listTable" border style="width: 100%" highlight-current-row @current-change="listCurrentChange">
				<el-table-column prop="workorderStatus" label="状态" min-width="10%">
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
				<el-table-column prop="lineCode" label="工单号" min-width="20%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="lineName" label="设备" min-width="20%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="realDate" label="巡检日期"min-width="15%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="className" label="班次" min-width="7%"></el-table-column>
				<el-table-column prop="oamClass" label="巡检分类" min-width="10%"></el-table-column>
				<el-table-column prop="major" label="专业" min-width="8%"></el-table-column>
			</el-table>
			<el-pagination
			  layout="total,prev, pager, next,jumper"
			  @current-change="listPaging"
			  :current-page="list.pageIndex"
			  :page-size="4"
			  :total="list.total">
			</el-pagination>
			<h2 class="bo-subtitle">任务明细</h2>
			<el-table v-if="list.listTable.length>0" ref="detailTable" v-loading="detail.loading" :data="detail.table" border style="width: 100%" highlight-current-row>
				<el-table-column label="序号" min-width="5%">
					<template slot-scope="scope">
						<span>{{4*(detail.pageIndex-1)+1+scope.$index}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="positionName" label="部位" min-width="10%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="checkItem" label="巡检项目" min-width="15%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="checkContent" label="巡检内容" min-width="10%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="benchmark" label="巡检基准" min-width="15%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column label="读数" min-width="20%">
					<template slot-scope="scope">
						<el-input v-if="scope.row.checkPointType == 2" :disabled="activeData.isIng == '0' || scope.row.isSave != '-1'" size="mini" placeholder="请输入读数" v-model="scope.row.setValue" @keyup.native="proving(scope.row)"></el-input>
					</template>
				</el-table-column>
				<el-table-column prop="result" label="巡检结果" min-width="15%">
					<template slot-scope="scope">
						<el-radio-group v-model="scope.row.result" size="mini" :disabled="activeData.isIng == '0' || scope.row.isSave != '-1'">
							<el-radio-button label="1">正常</el-radio-button>
							<el-radio-button label="0">异常</el-radio-button>
						</el-radio-group>
					</template>
				</el-table-column>
				<el-table-column label="异常上报" min-width="8%">
					<template slot-scope="scope">
							<el-button type="danger" :disabled="activeData.isIng == '0' || scope.row.isSave != '-1'" plain v-if="scope.row.result == 0" @click="abnRepClick(scope.row)" size="mini">异常上报</el-button>
						</template>
				</el-table-column>
				<el-table-column label="操作" min-width="10%">
					<template slot-scope="scope">
						<el-button :disabled="activeData.isIng == '0' || scope.row.isSave != '-1'" plain @click="clickSubmit(scope.row)" size="mini">提交</el-button>
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
				activeData:'',
				activeIndex:0,
				list:{
					pageIndex:1,
					total:0,
					listTable:[],
					loading:false,
				},
				detail:{
					pageIndex:1,
					total:0,
					detailTable:[],
					table:[],
					loading:false,
				},
			}
		},
		methods:{
			getlistData(){//获取巡检工单列表
				this.list.loading = true;
				this.list.listTable = [];
				this.$axios.get(this.$root.URL+'eom/api/line/list',{
					params:{
						params:{
							query:{
								equKeyId:'',
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
			getcheckdetaildata(id){//获取巡检工单详情
				this.detail.loading = true;
				this.$axios.get(this.$root.URL+'eom/api/line/detail/'+id).then((res) => {
					let data = res.data;
					this.detail.loading = false;
					if(!data.result){
						this.detail.detailTable = data.obj.results;
						this.detailPaging(this.detail.pageIndex)
					}else{
						
					}
				})
			},
			startSubClick(){//开始
				
				this.$confirm('确认开始巡检？','提示',{
					type: 'warning'
				}).then(() => {
					this.boxloading = true;
					this.$axios.put(this.$root.URL+'eom/api/line/start/'+this.activeData.id).then((res) => {
						this.boxloading = false;
						let d = res.data;
						if(!d.result){
							this.$message({message:'开始巡检!',type: 'success'});
							this.getlistData()
						}else{
							this.$alert(d.errorMsg || '开始任务失败!','提示');
						}
					})
				})
			},
			clickSubmit(page){ //确认提交
				this.$confirm('确认提交？','提示',{
					type: 'warning'
				}).then(() => {
					this.boxloading = true;
					this.$axios.put(this.$root.URL+'eom/api/line/submit/'+ page.id,{
						actualReading:page.setValue,
						checkResult:page.result,
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
				})
			},
			submitAll(){//提交完成
				this.$confirm('确认完成巡检？','提示',{
					type: 'warning'
				}).then(() => {
					this.boxloading = true;
					this.$axios.put(this.$root.URL+'eom/api/line/submitAll/'+this.activeData.id).then((res) => {
						this.boxloading = false;
						let d = res.data;
						if(!d.result){
							this.$message({message:'完成巡检!',type: 'success'});
							this.getlistData()
						}else{
							this.$message.error('第'+d.errorMsg+'项未提交');
							let index = Math.ceil(d.errorMsg/4)
							this.detailPaging(index)
							this.$refs.detailTable.setCurrentRow(this.detail.table[(d.errorMsg-1)%4]);
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
			abnRepClick(val){//异常上报
				this.$router.push({
					path:'/jtRepair',
					query:{
						positionCode:val.positionCode,
						positionName:val.positionName,
						majorId:this.activeData.majorId
					}
				})
			},
			proving(val){
				val.setValue = val.setValue.replace(/[^\.\d]/g,'');
				val.setValue = val.setValue.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
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