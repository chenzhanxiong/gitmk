<template>
	<div>
		<el-row :gutter="14" class="mb-20">
			<el-col :span="6">
				<router-link class="h-140" bgcolor="blue" to="/jtMaintain">
					<div class="home-info">
						<i class="iconfont icon-baoyang"></i>
						<p>机台保养</p>
					</div>
					
				</router-link>
			</el-col>
			<el-col :span="6">
				<router-link class="h-140" bgcolor="blue" to="/jtCheck">
					<div class="home-info">
						<i class="iconfont icon-shebeidianjian"></i>
						<p>机台点检</p>
					</div>
				</router-link>
			</el-col>
			<el-col :span="6">
				<router-link class="h-140" bgcolor="blue" to="/jtFunction">
					<div class="home-info">
						<i class="iconfont icon-yunhangguanli"></i>
						<p>运行管理</p>
					</div>
				</router-link>
			</el-col>
			<el-col :span="6">
				<router-link class="h-140" bgcolor="blue" to="/jtRepair">
					<div class="home-info">
						<i class="iconfont icon-baoxiu"></i>
						<p>报修呼叫</p>
					</div>
				</router-link>
			</el-col>
		</el-row>
		
		<el-row :gutter="14">
			<el-col :span="16">
				<el-row :gutter="14">
					<el-col :span="8" class="mb-20">
						<router-link class="h-140" bgcolor="yellow" to="/round">
							<div class="home-info">
								<i class="iconfont icon-lunxun"></i>
								<p>设备轮保</p>
							</div>
						</router-link>
					</el-col>
					<el-col :span="8" class="mb-20">
						<router-link class="h-140" bgcolor="yellow" to="/check">
							<div class="home-info">
								<i class="iconfont icon-data-"></i>
								<p>点检管理</p>
							</div>
						</router-link>
					</el-col>
					<el-col :span="8" class="mb-20">
						<router-link class="h-140" bgcolor="yellow" to="/planMain">
							<div class="home-info">
								<i class="iconfont icon-jihua"></i>
								<p>计划维修</p>
							</div>
						</router-link>
					</el-col>
					<el-col :span="8">
						<router-link class="h-140" bgcolor="yellow" to="/lubrication">
							<div class="home-info">
								<i class="iconfont icon-tianjiarunhuazhi-copy"></i>
								<p>润滑管理</p>
							</div>
						</router-link>
					</el-col>
					<el-col :span="8">
						<router-link class="h-140" bgcolor="yellow" to="/inspection">
							<div class="home-info">
								<i class="iconfont icon-xunjianjihua"></i>
								<p>巡检管理</p>
							</div>
						</router-link>
					</el-col>
					<el-col :span="8">
						<router-link class="h-140" bgcolor="yellow" to="/repair">
							<div class="home-info">
								<i class="iconfont icon-yingjixiangying"></i>
								<p>报修响应</p>
							</div>
						</router-link>
					</el-col>
				</el-row>
			</el-col>
			<el-col :span="8">
				<el-row :gutter="14">
					<el-col :span="12">
						<router-link style="height: 3.02rem;" bgcolor="green" to="/">
							<div class="home-info home-info-s">
								<i class="iconfont icon-dangan"></i>
								<p>一 机一 档</p>
							</div>
						</router-link>
					</el-col>
					<el-col :span="12">
						<router-link style="height: 3.02rem;" bgcolor="green" to="/partsLibrary">
							<div class="home-info home-info-s">
								<i class="iconfont icon-beipinbeijian"></i>
								<p>备 件查 询</p>
							</div>
						</router-link>
					</el-col>
				</el-row>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	
</script>

<style>
	.el-col a{
		display: block;
		text-align: center;
		color: #fff;
		border-radius: 0.08rem;
		font-size: 0.22rem;
	}
	.el-col a:before{
		content: '';
		display: inline-block;
		width: 0;
		height: 100%;
		vertical-align: middle;
	}
	.home-info{
		display: inline-block;
		vertical-align: middle;
	}
	.el-col a i{
		font-size: 0.65rem;
		display: inline-block;
		margin-bottom: 0.1rem;
	}
	.home-info-s p{
		width: 50%;
		margin: 0 auto;
		text-align: center;
		font-size: 0.26rem;
	}
	.el-col a .home-info-s i{
		font-size: 0.9rem;
		margin-bottom: 0.3rem;
	}
</style>