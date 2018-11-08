<template>
	<div class="setup-box row-box">
		<div class="setup-info" v-for="(list,i) in datalist">
			<h3 class="setup-title">{{list.title}}</h3>
			<ul>
				<li @click="li.event()" v-for="(li,i) in list.list">
					<span>{{li.name}}</span>
					<span>
						<span v-if="li.switchs" class="eam-switch" :class="{active:li.state}" @click.stop="li.state = !li.state"></span>
						<span>{{li.value}}</span>
						<i v-if="li.event" class="iconfont icon-arr"></i>
					</span>
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
						html:'设置'
					}
				],
				datalist:[
					{
						title:'系统信息',
						list:[
							{name:'关于',value:'',event:()=>{
								console.log(window)
								checkUpdate();
							}},
							{name:'产品与服务修改意见',value:'',event:()=>{}},
						]
					},
					{
						title:'设置',
						list:[
							{name:'关于',value:'',switchs:true,state:false},
							{name:'自动升级',value:'',switchs:true,state:false},
							{name:'清除本地缓存',value:'0.2MB',event:()=>{}},
							{name:'修改密码',value:'',event:()=>{}},
							{name:'切换账号',value:'',event:()=>{
								this.$store.commit('del_token');
								this.$router.replace('/login');
							}},
						]
					}
				]
			}
		},
		activated(){
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
		}
	}
</script>

<style>
	.setup-box{
		width: 100%;
	}
	.setup-info{
		width: 100%;
	}
	.setup-info .setup-title{
		width: 100%;
		height: 1.06rem;
		line-height: 1.06rem;
		background: #f8f8f8;
		padding-left: 0.5rem;
		font-size: 0.26rem;
		font-weight: normal;
	}
	.setup-info li{
		line-height:0.85rem;
		padding-left: 0.5rem;
		padding-right: 0.4rem;
		color: #666;
		border-bottom: 0.01rem solid #dedede;
		background: #fff;
		font-size: 0.26rem;
		overflow: hidden;
	}
	.setup-info li:before{
		content: "";
		display: inline-block;
		width: 0;
		height: 100%;
		vertical-align: middle;
	}
	.setup-info li>span:last-child{
		float: right;
		color: #999;
	}
	.setup-info li>span:last-child>i{
		margin-left: 0.1rem;
		font-weight: bold;
	}
</style>