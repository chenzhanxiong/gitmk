<template>
	<div class="equipchild-box">
		<ul class="equipchild-ul">
			<li @click="$router.push('/workList')">
				<span><i class="iconfont icon-jinggao"></i></span>
				<p>工单</p>
			</li>
			<li @click="$router.push('/abnormallyReport')">
				<span><i class="iconfont icon-dianhua"></i></span>
				<p>异常上报</p>
			</li>
			<li @click="$router.push('/repairCenter')">
				<span><i class="iconfont icon-baoxiu1"></i></span>
				<p>报修中心</p>
			</li>
			<li @click="$router.push('/states')">
				<span><i class="iconfont icon-zhuangtai"></i></span>
				<p>状态</p>
			</li>
			<li @click="$router.push('/archives')">
				<span><i class="iconfont icon-dangan"></i></span>
				<p>档案</p>
			</li>
			<li @click="$router.push('/earlyWarning')">
				<span><i class="iconfont icon-yujing"></i></span>
				<p>预警</p>
			</li>	
		</ul>
		<div class="asset-info">
			<h3 class="asset-info-title">资产信息</h3>
			<ul>
				<li v-for="(list,i) in datalist" :key="i">
					<span>{{list.name}}</span>
					<span>{{list.value}}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
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
				datalist:[
					{name:'设备名称',value:'包装机#1'},
					{name:'设备编码',value:'10001001'},
					{name:'资产编号',value:'10001001'},
					{name:'单位',value:'片'},
					{name:'投产时间',value:'2012-01-09'},
					{name:'设备役龄',value:'2'},
					{name:'ABC分类',value:'重要设备'},
					{name:'设备分类',value:'生产设备'},
					{name:'是否在用',value:'是'},
				]
			}
		},
		mounted(){
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
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
		height: 0.02rem;
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
		border: 0.02rem solid #dedede;
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
		border-bottom: 0.01rem solid #dedede;
		line-height: 0.64rem;
		height: 0.64rem;
		font-size: 0.22rem;
		text-align: center;
		overflow: hidden;
	}
	.asset-info ul li>span{
		float: left;
		width: 50%;
	}
</style>