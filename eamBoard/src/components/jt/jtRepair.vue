<template>
	<div class="row-box" v-loading="jtrepLoading">
		<div class="content-title">
			<span class="title">报修呼叫</span>
		</div>
		<div class="content-body">
			<el-row :gutter="0">
				<el-col :span="20">
					<div class="bo-box mb-25">
						<el-col :span="14">
							<div class="bo-head">
								<span class="bo-title">异常部位</span>
								<el-tag class="abn-tag" closable @close="tagClose(i)" v-for="(item,i) in activeass" :key="i">{{item.text}}</el-tag>
							</div>
							<ul class="bo-body" v-loading="abnloading" style="height: 3.64rem;border-right: 1px solid #acacac;">
								<li class="jt-list" :class="{active:abnActiveCode == list.code}" @click="arrangeItem(list)" v-for="(list,index) in abnList" :key="index">
									<i class="iconfont icon-weixiu"></i>
									<span class="jt-list-item">{{list.text}}</span>
									<!-- <span class="num">15</span> -->
								</li>
								<div v-if="abnList.length == 0" class="el-tree__empty-block"><span class="el-tree__empty-text">暂无数据</span></div>
							</ul>
						</el-col>
						<el-col :span="10">
							<div class="bo-head">
								<span class="bo-title">异常现象</span>
							</div>
							<ul class="bo-body" v-loading="phenoAbn.loading" style="height: 3.64rem;">
								<li class="jt-list" :class="{active:formInline.faultCode == item.faultCode}" v-for="(item,i) in phenoAbn.list" :key="i" @click="phenoAbnClick(item)">
									<i class="iconfont icon-xiangji"></i>
									<el-tooltip :open-delay="500" :content="item.faultName" placement="left">
										<span class="jt-list-item">{{item.faultName}}</span>
									</el-tooltip>
									<span class="num">{{item.faultCount}}</span>
								</li>
								<div v-if="phenoAbn.list.length == 0" class="el-tree__empty-block"><span class="el-tree__empty-text">暂无数据</span></div>
							</ul>
						</el-col>
					</div>
				</el-col>
				<el-col :span="4">
					<div class="jt-from-submit" style="margin:2rem auto 0" @click="onSubmit('formInline')">
						<i class="iconfont icon-weixiu1"></i>
						<p>报修</p>
					</div>
				</el-col>
			</el-row>
			<el-form :rules="rules" :model="formInline" ref="formInline" label-width="1.6rem">
				<el-col :span="6">
					<el-form-item label="设备:" prop="equCode">
						<el-input v-model="formInline.equName" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="部位:">
						<el-input v-model="formInline.positionName" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="专业:" prop="majorId">
						<el-select v-model="formInline.majorId" placeholder="专业">
							<el-option v-for="item in major" :key="item.value" :label="item.text" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="上报级别:" prop="reportLevelId">
						<el-select v-model="formInline.reportLevelId" placeholder="上报级别" @change="reportLevelChange">
							<el-option v-for="item in reportLevel" :key="item.value" :label="item.text" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="故障发现时间:" prop="strFaultT">
						<el-date-picker
						  v-model="formInline.strFaultT"
						  type="datetime"
						  placeholder="选择日期时间">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="异常描述:" prop="failTxt">
						<el-input type="textarea" :rows="3" v-model="formInline.abnormalTxt" placeholder="异常描述内容"></el-input>
					</el-form-item>
					<el-form-item label="故障现象:" prop="failTxt">
						<el-input type="textarea" :rows="2" v-model="formInline.failureTxt" disabled placeholder="故障现象内容">
						</el-input>
						<el-button plain size="mini" @click="openPopFault">选择故障现象</el-button>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="维修时间:" prop="strTime" v-if="formInline.reportLevelId == '4'">
						<el-date-picker v-model="formInline.strTime"
							type="datetimerange"
							align="right"
							range-separator="至" 
							start-placeholder="开始时间"
							end-placeholder="结束时间"
							>
						</el-date-picker>
					</el-form-item>
					<el-form-item label="处理描述:" prop="aProcedureTxt" v-if="formInline.reportLevelId == '4'">
						<el-input type="textarea" :rows="3"  v-model="formInline.aProcedureTxt" placeholder="处理描述内容"></el-input>
					</el-form-item>
				</el-col>
			</el-form>
		</div>
		<el-dialog :visible.sync="dialogTableVisible" width="4rem">
			<el-table v-loading="faultData.loading" height="4.8rem" border :data="faultData.list" highlight-current-row @current-change="listCurrentChange">
				<el-table-column property="text" label="故障现象" :show-overflow-tooltip="true"></el-table-column>
			</el-table>
			<el-pagination
				small
				@current-change="listPaging"
				:current-page="faultData.pageIndex"
				layout="prev, pager, next"
				:page-size="8"
				:total="faultData.total">
			</el-pagination>
		</el-dialog>
	</div>
	
</template>

<script>
	import card from '@/components/home/card'
	import {formatDate} from '@/static/date'
	export default{
		components:{card},
		data(){
			return{
				jtrepLoading:false,//页面加载
				dialogTableVisible:false,//故障现象弹框
				faultData:{//故障现象弹框表格数据
					list:[],
					total:0,
					pageIndex:1,
					loading:false
				},
				activeass:[],//选中的异常部位
				abnloading:false,//异常部位加载状态
				abnList:[],//异常部位列表
				abnActiveCode:'',//当前异常部位code
				major:[],//专业下拉选项
				reportLevel:[],//上报级别下拉选项
				phenoAbn:{//异常现象
					list:[],
					loading:false,
				},
				formInline:{//报修内容
					equName:'',//设备名称
					equCode:'',//设备编号
					positionCode:'',//部位编号
					positionName:'',//部位名称
					failureTxt:'',//故障现象描述
					faultCode:'',//故障代码
					majorId:'',//专业ID
					reportLevelId:'',//上报级别ID
					strFaultT:'',//故障发现时间1
					strFaultTime:'',//故障发现时间
					abnormalTxt:'',//异常描述
					strTime:'',//w维修时间
					strStartTime:'',//维修开始时间
					strEndTime:'',//维修结束时间
					aProcedureTxt:'',//处理描述
					failTxt:'',//
				},
				rules:{//必填项
					equCode:[
						{required: true, message: '请选择设备', trigger: 'blur'}
					],
					majorId:[
						{required: true, message: '请选择专业', trigger: 'change'}
					],
					reportLevelId:[
						{required: true, message: '请选择上报级别', trigger: 'change'}
					],
					strFaultT:[
						{required: true, message: '请选择故障发现时间', trigger: 'change'}
					],
					failTxt:[
						{required: true, message: '异常描述与故障现象必须选一个!'}
					],
					strTime:[
						{required: false, message: '请选择维修时间!', trigger: 'change'}
					],
					aProcedureTxt:[
						{required: false, message: '请输入处理描述!', trigger: 'blur'}
					]
				}
			}
		},
		methods:{
			getScreen(){//查询筛选条件
				this.$axios.all([
					this.$axios.get(this.$root.URL+'eom/api/screen/major'),
					this.$axios.get(this.$root.URL+'eom/api/screen/reportLevel')
				]).then(this.$axios.spread((a,b) => {
					if(!a.data.result){
						this.major = a.data.items;
						if(this.$route.query.majorId){
							this.formInline.majorId = this.$route.query.majorId
						}else{
							this.formInline.majorId = this.major[0].value
						}
					}
					if(!b.data.result){
						this.reportLevel = b.data.items;
						this.formInline.reportLevelId = this.reportLevel[0].value
					}
				}))
			},
			onSubmit(formName){
				this.$refs[formName].validate((valid) => {
				  if (valid) {
					this.repairCenterSubmit()
				  } else {
					return false;
				  }
				});
			},
			reportLevelChange(val){//选择上报级别
				this.formInline.strTime = '';
				this.formInline.aProcedureTxt = '';
				if(val == '4'){
					this.rules.strTime[0].required = true;
					this.rules.aProcedureTxt[0].required = true;
				}else{
					this.rules.strTime[0].required = false;
					this.rules.aProcedureTxt[0].required = false;
				}
			},
			getformData(){
				this.formInline.equName = this.$store.state.activeEquName;
				this.formInline.equCode = this.$store.state.activeEquId;
			},
			getfindNextNode(obj){//故障信息
				this.abnloading = true;
				this.$axios.get(this.$root.URL+'eom/api/common/findNextNode',{
					params:{
						equCode:this.$store.state.activeEquId,
						code:this.abnActiveCode
					}
				}).then(res => {
					this.abnloading = false;
					let d = res.data;
					if(!d.result){
						if(d.items.length > 0){
							this.abnList = d.items;
						}else{
							this.abnList = [{...obj,last:true}]
						}
						this.getfindFaultMessage();
					}
				})
			},
			arrangeItem(item){//整理数据
				if(item.last){
					return false;
				}
				this.abnActiveCode = item.code;
				this.activeass.push({
					...item
				});
				this.getfindNextNode(item);
			},
			tagClose(index){//删除
				let len = this.activeass.length - index;
				this.activeass.splice(index,len);
				if(this.activeass.length > 0){
					this.abnActiveCode = this.activeass[this.activeass.length-1].code;
				}else{
					this.abnActiveCode = '';
				}
				this.getfindNextNode();
			},
			getfindFaultMessage(){//获取异常现象
				this.phenoAbn.loading = true;
				this.$axios.get(this.$root.URL+'eom/api/common/findFault',{
					params:{
						positionCode:this.formInline.positionCode
					}
				}).then(res => {
					this.phenoAbn.loading = false;
					let d = res.data;
					if(!d.result){
						this.phenoAbn.list = d.items;
						this.formInline.faultCode = '';
						this.formInline.failureTxt = '';
					}
				})
			},
			getfindFault(){//获取故障现象
				this.faultData.loading = true;
				this.$axios.get(this.$root.URL+'eom/api/screen/findFault',{
					params:{
						params:{
							query:{
								text:''
							},
							pager:{
								pageIndex:this.faultData.pageIndex,
								pageSize:8
							}
						}
					}
				}).then(res => {
					this.faultData.loading = false;
					let d = res.data;
					if(!d.result){
						this.faultData.list = d.item;
						this.faultData.total = d.total
					}
				})
			},
			listPaging(val){
				this.faultData.pageIndex = val;
				this.getfindFault()
			},
			phenoAbnClick(item){//点击异常现象
				this.formInline.faultCode = item.faultCode;
				this.formInline.failureTxt = item.faultName;
			},
			openPopFault(){//打开故障现象弹框
				this.dialogTableVisible = true;
				this.getfindFault();
			},
			listCurrentChange(val){//弹框选择故障现象
				this.formInline.faultCode = '';
				this.formInline.failureTxt = val.text;
				this.dialogTableVisible = false;
			},
			repairCenterSubmit(){//提交
				this.$confirm('确认报修？','提示',{
					type: 'warning'
				}).then(()=>{
					this.jtrepLoading = true;
					this.$axios.post(this.$root.URL+'eom/api/repairCenter/submit',{
						...this.formInline,
					}).then(res => {
						this.jtrepLoading = false;
						let d = res.data;
						if(!d.result){
							this.$message({message:'报修成功！',type: 'success'});
							this.$router.go(-1);
						}else{
							this.$alert(d.Message,'提示');
						}
					})
				})
				
			},
		},
		computed:{
			activeEquId(){
				return this.$store.state.activeEquId;
			},
			
		},
		watch:{
			activeEquId(){
				this.abnActiveCode = '';
				//this.$refs.formInline.validate()
				this.activeass = [];
				this.getformData();
				this.getfindNextNode()
			},
			activeass(old){
				if(old.length > 0){
					this.formInline.positionCode = old[old.length - 1].code;
					this.formInline.positionName = old[old.length - 1].text;
				}else{
					this.formInline.positionCode = '';
					this.formInline.positionName = '';
				}
			},
			'formInline.abnormalTxt'(old){
				if(old){
					this.formInline.failTxt = true;
				}else{
					this.formInline.failTxt = '';
				}
			},
			'formInline.failureTxt'(old){
				if(old){
					this.formInline.failTxt = true;
				}else{
					this.formInline.failTxt = '';
				}
			},
			'formInline.strTime'(old){
				if(old){
					this.formInline.strStartTime = formatDate(old[0],'yyyy-MM-dd hh:mm:ss')
					this.formInline.strEndTime = formatDate(old[1],'yyyy-MM-dd hh:mm:ss')
				}else{
					this.formInline.strStartTime = '';
					this.formInline.strEndTime = '';
				}
			},
			'formInline.strFaultT'(old){
				if(old){
					this.formInline.strFaultTime = formatDate(old,'yyyy-MM-dd hh:mm:ss')
				}else{
					this.formInline.strFaultTime = '';
				}
			}
		},
		beforeRouteEnter(to,from,next){
			next(vm => {
				if(to.query.positionCode){
					vm.arrangeItem({
						code:to.query.positionCode,
						text:to.query.positionName
					})
				}
			})
		},
		mounted(){
			this.getScreen();
			this.getformData()
			this.getfindNextNode()
			
		}
		
	}
</script>

<style>
	
	.jt-list{
		width: 100%;
		height: 0.52rem;
		padding: 0 0.2rem;
		border-bottom: 1px solid #acacac;
		cursor: pointer;
	}
	.jt-list.tree{
		border:none;
		height: 100%;
	}
	.jt-list:hover,.jt-list.active{
		background-color: #e7efef;
	}
	
	.jt-list:before{
		content: '';
		display: inline-block;
		width: 0;
		height: 100%;
		vertical-align: middle;
	}
	.jt-list i{
		font-size: 0.3rem;
		color: #0087e8;
		vertical-align: middle;
	}
	.jt-list-item{
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: inline-flex;
		vertical-align: middle;
		width: 70%;
	}
	.jt-list .num{
		float: right;
		position: relative;
		margin-top: 0.05rem;
		padding: 0 0.1rem;
		min-width: 0.44rem;
		line-height: 0.4rem;
		height: 0.4rem;
		text-align: center;
		background: #ff6c19;
		border-radius: 0.08rem;
		color: #fff;
		cursor: pointer;
	}
	.jt-list .num:before{
		content: '';
		position: absolute;
		width: 0;
		height: 0;
		border: 0.05rem solid #FF6C19;
		transform: rotate(45deg) translateY(-70%);
		top: 50%;
		left: -0.08rem;
	}
	.jt-list .num:hover{
		background: #f15700;
	}
	.jt-list .num:hover:before{
		border-color: #f15700;
	}
	.jt-from-submit{
		width: 2rem;
		height: 2rem;
		color: #fff;
		text-align: center;
		background-color: #00B393;
		border-radius: 0.1rem;
		padding: 0.3rem 0;
		font-size: 0.3rem;
		cursor: pointer;
		transition: all 200ms;
	}
	.jt-from-submit:hover{
		background-color: #01947a;
	}
	.jt-from-submit i{
		display: inline-block;
		font-size: 0.76rem;
		margin-bottom: 0.17rem;
	}
	.abn-tag.el-tag{
		color: #fff;
		border: none;
	}
	.abn-tag.el-tag .el-icon-close{
		color: #fff;
	}
	
</style>