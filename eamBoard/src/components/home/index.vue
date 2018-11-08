<template>
	<div class="row-home">
		<el-row :gutter="20">
			<el-col :span="16">
				<div class="bo-box mb-30">
					<div class="bo-head">
						<span class="bo-title">设备管理卡</span>
						<ul class="bo-head-info f-r">
							<li class="f-l">
								<span>资产号:</span>
								<span>{{$store.state.activeAssetNumber}}</span>
							</li>
						</ul>
					</div>
					<div class="bo-body" style="height: 2.1rem;">
						<card></card>
					</div>
				</div>
				<info></info>
			</el-col>
			<el-col :span="8">
				<div class="bo-box mb-30">
					<div class="bo-head">
						<span class="bo-title">通知公告</span>
					</div>
					<div v-loading="tz.loading" class="bo-body" style="height: 3rem;">
						<ul>
							<li class="home-list" v-for="(list,i) in tz.tzlist" :key="i" @click="getNoticeDetail(list.id)">
								<span>{{i+1}}、{{list.title}}</span>
								<span>{{list.noticeTime}}</span>
							</li>
						</ul>
						<div v-if="tz.tzlist.length==0" class="el-tree__empty-block"><span class="el-tree__empty-text">暂无数据</span></div>
					</div>
				</div>
				<div class="bo-box">
					<div class="bo-head">
						<span class="bo-title">异常警示</span>
					</div>
					<div v-loading="yc.loading" class="bo-body" style="height: 3rem;">
						<ul>
							<li class="home-list" v-for="(list,i) in yc.yclist" :key="i">
								<el-tooltip :open-delay="500" :content="(list.positionName || '')+(list.failureTxt || list.abnormalTxt)" placement="left">
									<span>{{i+1}}、{{list.positionName}}{{list.failureTxt || list.abnormalTxt}}</span>
								</el-tooltip>
								<el-tag type="success" size="mini">{{list.woState}}</el-tag>
								<span>{{list.callTime.split(' ')[0]}}</span>
							</li>
						</ul>
						<div v-if="yc.yclist==0" class="el-tree__empty-block"><span class="el-tree__empty-text">暂无数据</span></div>
					</div>
				</div>
			</el-col>
		</el-row>
		<el-dialog :visible.sync="dialogVisible">
		  <div v-html="tz.content"></div>
		</el-dialog>
	</div>
	
</template>

<script>
	import card from '@/components/home/card'
	import info from '@/components/home/info'
	export default{
		components:{card,info},
		data(){
			return{
				dialogVisible:false,
				tz:{
					loading:false,
					tzlist:[],
					content:'',
				},
				yc:{
					loading:false,
					yclist:[],
				}
				
			}
		},
		methods:{
			getNoticeList(){//获取通知公告列表
				this.tz.loading = true;
				this.$axios.get(this.$root.URL+'eom/api/notice/findList').then((res) => {
					this.tz.loading = false;
					let data = res.data;
					this.tz.tzlist = data;
				})
			},
			getNoticeDetail(id){//获取通知公告详情
				this.$axios.get(this.$root.URL+'eom/api/notice/detail/'+id).then((res) => {
					let data = res.data;
					this.tz.content = data.obj.content;
					this.dialogVisible = true;
				})
			},
			getlistData(){//获取异常警示列表
				this.yc.loading = true;
				this.$axios.get(this.$root.URL+'eom/api/repairCenter/list',{
					params:{
						params:{
							query:{
								equKeyId:this.$store.state.activeEquId,
								isFinish:0//是否完成
							},
							pager:{
								pageIndex:1,
								pageSize:10
							}
						}
					}
				}).then((res) => {
					this.yc.loading = false;
					let data = res.data;
					if(!data.result){
						this.yc.yclist = data.item;
					}else{
						
					}
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
			this.getNoticeList();
		}
		
	}
</script>

<style>
	.home-list{
		width: 100%;
		line-height: 0.6rem;
		height: 0.6rem;
		border-bottom: 1px solid #ddd;
		padding: 0 0.2rem;
		font-size: 0.2rem;
		color:#666;
		cursor: pointer;
	}
	.home-list{
		overflow: hidden;
	}
	.home-list span:first-child{
		float: left;
		width: 2.1rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.home-list span:last-child{
		float: right;
		color: #999;
	}
</style>