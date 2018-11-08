<template>
	<div class="equipchild-box row-box">
		<ul class="equipchild-ul">
			<li @click="$router.push({path:'/workList',query:{id:$route.query.id,name:$route.query.equName}})">
				<span><i class="iconfont icon-jinggao"></i><em v-if="datalist.untreatedNum>0">{{datalist.untreatedNum}}</em></span>
				<p>工单</p>
			</li>
			<li @click="$router.push({path:'/abnormallyReport',query:{equKeyId:datalist.id,equName:datalist.equName,equCode:datalist.equIcucode}})">
				<span><i class="iconfont icon-dianhua"></i></span>
				<p>异常上报</p>
			</li>
			<li @click="$router.push({path:'/repairCenter',query:{id:$route.query.id}})">
				<span><i class="iconfont icon-baoxiu1"></i><em v-if="datalist.reportNum>0">{{datalist.reportNum}}</em></span>
				<p>报修中心</p>
			</li>
			<!-- <li @click="$router.push({path:'/states',query:{id:$route.query.id}})">
				<span><i class="iconfont icon-zhuangtai"></i></span>
				<p>状态</p>
			</li>
			<li @click="$router.push({path:'/archives',query:{id:$route.query.id}})">
				<span><i class="iconfont icon-dangan"></i></span>
				<p>档案</p>
			</li>
			<li @click="$router.push({path:'/earlyWarning',query:{id:$route.query.id}})">
				<span><i class="iconfont icon-yujing"></i></span>
				<p>预警</p>
			</li> -->	
		</ul>
		<div class="asset-info">
			<h3 class="asset-info-title">资产信息</h3>
			<ul v-if="show">
				<li class="border-bottom">
					<span>设备名称</span>
					<span>{{datalist.equName}}</span>
				</li>
				<li class="border-bottom">
					<span>设备编码</span>
					<span>{{datalist.equIcucode}}</span>
				</li>
				<li class="border-bottom">
					<span>资产编号</span>
					<span>{{datalist.assetNumber}}</span>
				</li>
				<li class="border-bottom">
					<span>单位</span>
					<span>{{datalist.unitOfMeasure}}</span>
				</li>
				<li class="border-bottom">
					<span>投产时间</span>
					<span>{{datalist.dateForProduction}}</span>
				</li>
				<li class="border-bottom">
					<span>设备役龄</span>
					<span>{{datalist.age}}</span>
				</li>
				<li class="border-bottom">
					<span>ABC分类</span>
					<span>{{datalist.abcClassify}}</span>
				</li>
				<li class="border-bottom">
					<span>设备分类</span>
					<span>{{datalist.equCategory}}</span>
				</li>
				<li class="border-bottom">
					<span>是否在用</span>
					<span>{{datalist.isUse}}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				show:false,
				headData:[
					{
						show:true,
						icon:'icon-fanhui',
						event:() => {
							this.$router.back(-1);
						}
					},
					{
						show:true,
						input:false,
						html:'设备',
					}
				],
				datalist:{},
			}
		},
		methods:{
			getEquipmentDetail(){//获取数据
				this.$store.commit('showLoading');
				this.$axios.get(this.$root.URL+'eom/api/equipment/detail/'+ this.$route.query.id).then(res => {
					this.$store.commit('hideLoading')
					let d = res.data;
					if(!d.result){
						this.datalist = d.obj;
						this.show = true;
					}else{
						this.$MessageBox('提示',d.errorMsg);
					}
				})
			},
		},
		activated(){
			this.show = false;
			this.getEquipmentDetail();
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
			mui.back = function(){
				history.go(-1)//回退到上一页面
			}
		}
	}
</script>

<style>
	.equipchild-box{
		width: 100%;
	}
	.equipchild-ul{
		width: 100%;
		overflow: hidden;
	}
	.equipchild-ul li{
		float: left;
		width: 25%;
		text-align: center;
		margin-top: 0.25rem;
	}
	.equipchild-ul li>span{
		position: relative;
		display: inline-block;
		width: 1rem;
		height: 1rem;
		border: 0.01rem solid #00B393;
		border-radius: 50%;
		vertical-align: middle;
	}
	.equipchild-ul li>span:after{
	  content:'';
	  width:0;
	  height:100%;
	  display:inline-block;
	  vertical-align:middle;
	}
	.equipchild-ul li>span>i{
    	vertical-align: middle;
    	display: inline-block;
		color: #00B393;
		font-size: 0.5rem;
	}
	.equipchild-ul li>span>em{
		position: absolute;
		left: 0.7rem;
		top: 0rem;
		display: block;
		height: 0.3rem;
		line-height: 0.34rem;
		background: red;
		color: #fff;
		border-radius: 0.3rem;
		min-width: 0.3rem;
		padding: 0 0.05rem;
		font-size: 0.24rem;
		font-style: normal;
	}
	.equipchild-ul li>p{
		line-height: 0.5rem;
		font-size: 0.26rem;
		color: #666;
	}
	.asset-info{
		margin-top: 0.4rem;
		position: relative;
	}
	.asset-info:before{
		content: "";
		position: absolute;
		height: 1px;
		width: 80%;
		top: 0;
		left: 10%;
		background:#dedede;
	}
	.asset-info .asset-info-title{
		position: absolute;
		top: 0;
		left: 50%;
		transform: translate(-50%,-50%);
		padding: 0 0.4rem;
		line-height: 0.5rem;
		font-size: 0.26rem;
		background: #fff;
	}
	.asset-info .asset-info-title:before,.asset-info .asset-info-title:after{
		content: "";
		position: absolute;
		width: 0.14rem;
		height: 0.14rem;
		border: 1px solid #dedede;
		top: 50%;
		transform: translate(0,-50%) rotate(45deg);
	}
	.asset-info .asset-info-title:before{
		left: 0.1rem;
	}
	.asset-info .asset-info-title:after{
		right: 0.1rem;
	}
	.asset-info ul{
		width: 100%;
		padding: 0.3rem;
	}
	.asset-info ul li{
		line-height: 0.64rem;
		height: 0.64rem;
		font-size: 0.22rem;
		text-align: center;
		overflow: hidden;
	}
	.asset-info ul li>span{
		float: left;
		width: 50%;
		padding: 0 0.2rem;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.asset-info ul li>span:first-child{
		width: 40%;
	}
	.asset-info ul li>span:last-child{
		width: 60%;
	}
</style>