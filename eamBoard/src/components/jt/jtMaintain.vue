<template>
	<div class="row-box">
		<div class="content-title">
			<span class="title">机台保养标准</span>
			<div class="query-right">
				<span>保养分类：</span>
				<el-select v-model="searchCriteria.classId" clearable placeholder="请选择">
					<el-option
					v-for="item in screenData.class"
					:key="item.value"
					:label="item.text"
					:value="item.value">
					</el-option>
				</el-select>
				<span class="ml-10">保养专业：</span>
				<el-select v-model="searchCriteria.majorId" clearable placeholder="请选择">
					<el-option
					v-for="item in screenData.major"
					:key="item.value"
					:label="item.text"
					:value="item.value">
					</el-option>
				</el-select>
				<el-button plain @click="getlistData">查询</el-button>
			</div>
		</div>
		<div class="content-body">
			<el-table v-loading="list.loading" ref="singleTable" :data="list.listTable" border style="width: 100%" highlight-current-row >
				<el-table-column prop="positionName" label="部位" min-width="8%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="className" label="保养分类" min-width="8%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="major" label="保养专业" min-width="8%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="manhour" label="标准工时" min-width="8%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="content" label="保养内容" min-width="28%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="benchmark" label="保养标准" min-width="16%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="cycle" label="周期" min-width="8%"></el-table-column>
				<el-table-column label="操作" min-width="8%">
					<template slot-scope="scope">
						<el-button plain type="danger" @click="reportClick(scope.row)" size="mini">异常上报</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="info9" label="查看" min-width="8%">
					<template slot-scope="scope">
						<el-button type="success" icon="el-icon-search" circle></el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
			  layout="total,prev, pager, next,jumper"
			  @current-change="listPaging"
			  :current-page="list.pageIndex"
			  :page-size="10"
			  :total="list.total">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				list:{
					pageIndex:1,
					total:0,
					listTable:[],
					loading:true,
				},
				searchCriteria:{
					classId:'',
					majorId:''
				},
				screenData:{
					major:[],
					class:[],
				}
			}
		},
		methods:{
			getlistData(){//获取点检工单列表
				this.list.loading = true;
				this.$axios.get(this.$root.URL+'eom/api/daily/findStadard',{
					params:{
						params:{
							query:{
								equCode:this.$store.state.activeEquId,
								classId:this.searchCriteria.classId,
								majorId:this.searchCriteria.majorId
							},
							pager:{
								pageIndex:this.list.pageIndex,
								pageSize:10
							}
						}
					}
				}).then((res) => {
					this.list.loading = false;
					let data = res.data;
					if(!data.result){
						this.list.listTable = data.item;
						this.list.total = data.total;
						this.$refs.singleTable.setCurrentRow(this.list.listTable[0]);
					}else{
						this.$alert('获取列表失败','提示')
					}
				})
			},
			getScreen(){//查询筛选条件
				this.$axios.all([
					this.$axios.get(this.$root.URL+'eom/api/screen/major'),
					this.$axios.get(this.$root.URL+'eom/api/screen/class/03')
				]).then(this.$axios.spread((a,b) => {
					if(!a.data.result){
						this.screenData.major = a.data.items;
					}
					if(!b.data.result){
						this.screenData.class = b.data.items;
					}
				}))
			},
			handleCurrentChange(val){
				
			},
			listPaging(val){
				this.list.pageIndex = val;
				this.getlistData()
			},
			reportClick(val){
				this.$router.push({
					path:'/jtRepair',
					query:val
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
			this.getScreen();
			this.getlistData();
		}
	}
</script>

<style>
	
</style>