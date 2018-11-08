<template>
	<div class="row-box">
		<div class="content-title">
			<el-form :model="formInline" ref="formInline" label-width="1.2rem">
				<el-col :span="5">
					<el-form-item label="备件编码">
						<el-input v-model="formInline.elementCode" clearable placeholder="备件编码"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="5">
					<el-form-item label="备件名称">
						<el-input v-model="formInline.elementName" clearable placeholder="设备名称"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="5">
					<el-form-item label="型号">
						<el-input v-model="formInline.elementModel" clearable placeholder="型号"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="5">
					<el-form-item label="图号">
						<el-input v-model="formInline.figureCode" clearable placeholder="图号"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="4">
					<el-form-item style="text-align: right;">
						<el-button plain @click="subClick">查询</el-button>
					</el-form-item>
				</el-col>
			</el-form>
		</div>
		<div class="content-body" style="padding: 0.2rem 0;">
			<el-table v-loading="list.loading" :data="list.listTable" style="width: 100%" highlight-current-row @current-change="handleCurrentChange">
				<el-table-column prop="info1" label="缩略图" min-width="8%" :show-overflow-tooltip="true">
					<template slot-scope="scope">
						<i class="list-icon-tu el-icon-picture"></i>
					</template>
				</el-table-column>
				<el-table-column prop="elementCode" label="备件编码" min-width="8%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="elementName" label="备件名称" min-width="8%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="elementModel" label="型号（参数）" min-width="8%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="elementPartCode" label="件号" min-width="8%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="figureCode" label="图号/位号" min-width="8%" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column prop="elementNum" label="现存库量" min-width="8%"></el-table-column>
				<el-table-column prop="abcClass" label="ABC分类" min-width="8%"></el-table-column>
				<el-table-column prop="ELEMENT_PRICE" label="单价（不含税）" min-width="11%"></el-table-column>
				<el-table-column prop="info9" label="操作" min-width="5%">
					<template slot-scope="scope">
						<el-button plain size="mini">换件</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination
			  layout="total,prev, pager, next,jumper"
			  @current-change="listPaging"
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
				formInline:{
					elementName:'',
					elementCode:'',
					figureCode:'',
					elementModel:''
				},
				list:{
					loading:false,
					pageIndex:1,
					total:0,
					listTable:[]
				},
				
				tableData3: [
					
				]
			}
		},
		
		methods:{
			getlistData(){//获取备件列表列表
				this.list.loading = true;
				this.$axios.get(this.$root.URL+'eom/api/equipment/element',{
					params:{
						params:{
							query:{
								...this.formInline
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
					}else{
						this.$alert('获取列表失败','提示')
					}
				})
			},
			handleCurrentChange(val){
				//console.log(val)
			},
			listPaging(val){
				this.list.pageIndex = val;
				this.getlistData()
			},
			subClick(){
				this.list.pageIndex = 1;
				this.getlistData()
			}
		},
		
		mounted(){
			this.getlistData();
		}
	}
</script>

<style>
	.list-icon-tu{
		font-size: 0.3rem;
		color: #00B393;
		cursor: pointer;
	}
	.list-icon-tu:hover{
		color: #01947A;
	}
</style>