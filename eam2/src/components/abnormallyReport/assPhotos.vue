<template>
	<div class="ass-photos">
		<div class="list-model" style="position: relative;">
			<div class="ass-input-box">
				<i class="logo iconfont icon-sousuo"></i>
				<input type="text" name="" id="" v-model="searchl" placeholder="请输入关键字搜索" />
				<i class="btn iconfont icon-guanbi" v-if="searchl != ''" @click="searchl = ''"></i>
			</div>
			<span class="scan-btn"><i class="iconfont icon-saomiao"></i></span>
		</div>
		<div class="ass-list">
			<div class="ass-h-row">
				<span class="ass-h-title">已选设备/部位</span>
				<ul class="ass-h-ul">
					<li v-if="activeass.one == ''">尚未选择，请选择条件</li>
					<li v-if="activeass.one != '' && list != ''" v-for="(list,i) in activeass" :key="i">{{list.name}}<i class="iconfont icon-guanbi1" @click="assdelete(i)"></i></li>
				</ul>
			</div>
		
			<div class="ass-treepattern">
				<div class="ass-tree-list" v-for="(list,i) in datalist1" :key="i" v-if="activeass.one == ''" @click="assChoice('one',list)">
					<i class="radioui"></i><span v-html="list.name"></span>
				</div>
				<div class="ass-tree-list" v-if="activeass.one != ''">
					<i class="radioui active"></i><span>{{activeass.one.name}}</span>
				</div>
			</div>
			<div class="ass-treepattern1">
				<div class="ass-tree-list1" v-for="(list,i) in activeass.one.child" :key="i" v-if="activeass.one != '' && activeass.two == ''" @click="assChoice('two',list)">
					<i class="radioui"></i><span>{{list.name}}</span>
				</div>
				<div class="ass-tree-list1" v-if="activeass.two != ''">
					<i class="radioui active"></i><span>{{activeass.two.name}}</span>
				</div>
				<div class="ass-tree-list2" v-for="(list,i) in activeass.two.child" :key="i" v-if="activeass.two != '' && activeass.thr == ''" @click="assChoice('thr',list)">
					<i class="radioui"></i><span>{{list.name}}</span>
				</div>
				<div class="ass-tree-list2" v-if="activeass.thr != ''">
					<i class="radioui active"></i><span>{{activeass.thr.name}}</span>
				</div>
			</div>
		</div>
		
	</div>
</template>

<script>
	export default{
		data(){
			let abnorData = this.$store.state.abnorData;
			return{
				searchl:'',
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
						html:'设备BOM'
					},
					{
						show:true,
						html:'保存',
						event:() => {
							this.preservation();
							this.$router.push('/abnormallyReport');
						}
					}
				],
				activeass:{
					one:abnorData.abnorReport.name,
					two:abnorData.abnorReport.position,
					thr:''
				},
				datalist1:[],
				datalist:[
					{
						name:'设备名称1',
						child:[
							{
								name:'部位1',
								child:[
									{
										name:'部位1-1'
									},
									{
										name:'部位1-2'
									},
								]
							},
							{
								name:'部位2',
								child:[
									{
										name:'部位2-1'
									},
									{
										name:'部位2-2'
									},
								]
							}
						]
					},
					{
						name:'设备名称2',
						child:[
							{
								name:'部位1',
								child:[
									{
										name:'部位1-1'
									},
									{
										name:'部位1-2'
									},
								]
							},
							{
								name:'部位2',
								child:[
									{
										name:'部位2-1'
									},
									{
										name:'部位2-2'
									},
								]
							}
						]
					},
					{
						name:'设备名称3'
					},
					{
						name:'设备名称4'
					},
					{
						name:'设备名称5'
					},
					{
						name:'设备名称6'
					},
					{
						name:'设备名称7'
					},
					{
						name:'设备名称8'
					},
				]
			}
		},
		methods:{
			assChoice(i,list) {
				this.activeass[i] = list;
			},
			assdelete(index){
				this.activeass[index] = '';
				if(index == "two"){this.activeass.thr = '';};
				if(index == "one"){this.activeass.two = '';this.activeass.thr = '';};
			},
			preservation(){
				this.$store.state.abnorData.abnorReport.name = this.activeass.one.name;
				this.$store.state.abnorData.abnorReport.position = this.activeass.two.name;
			}
 		},
 		watch:{
 			searchl:function(curVal,oldVal){
 				this.datalist1 = [];
 				let reg = new RegExp(curVal);
				for(let i=0;i<this.datalist.length;i++){
					if(this.datalist[i].name.match(reg)){
				        this.datalist1.push(this.datalist[i]);
				    }
				}
 			}
 		},
 		mounted(){
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
		}
	}
</script>

<style>
	.ass-photos{
		width: 100%;
		height: 100%;
		position: relative;
	}
	.ass-input-box{
		width: 5.5rem;
		margin-left: 0.4rem;
		position: relative;
		border: 0.01rem solid #999;
		border-radius: 0.1rem;
	}
	.ass-input-box input{
		width: 100%;
		height: 0.6rem;
		font-size: 0.26rem;
		color: #666;
		background: none;
		border: none;
		outline: none;
		padding: 0 0.66rem;
	}
	.ass-input-box .logo{
		position: absolute;
		left: 0.2rem;
		top: 50%;
		transform: translate(0,-50%);
		font-size: 0.3rem;
		color: #999;
	}
	.ass-input-box .btn{
		position: absolute;
		right: 0.2rem;
		top: 50%;
		transform: translate(0,-50%);
		font-size: 0.3rem;
		color: #999;
	}
	.ass-input-box input::-webkit-input-placeholder{
		color: #999;
	}
	.scan-btn{
		position: absolute;
		right: 0.4rem;
		top: 50%;
		transform: translate(0,-50%);
	}
	.scan-btn i{
		font-size: 0.44rem;
		color: #00B294;
	}
	.ass-h-row{
		width: 100%;
		padding: 0.3rem 0.4rem;
		background: #f5f5f5;
	}
	.ass-h-row .ass-h-title{
		display: block;
		color: #999;
		font-size: 0.36rem;
	}
	.ass-h-row .ass-h-ul{
		margin-top: 0.24rem;
		overflow: hidden;
	}
	.ass-h-ul li{
		color: #00B294;
		padding: 0 0.24rem;
		margin-left: 0.2rem;
		margin-bottom: 0.2rem;
		line-height: 0.5rem;
		border: 0.01rem solid #DEDEDE;
		background: #fff;
		float: left;
		border-radius: 0.25rem;
		font-size: 0.24rem;
	}
	.ass-h-ul li i{
		margin-left: 0.2rem;
		font-size: 0.24rem;
		color: #999;
	}
	.ass-list{
		overflow: auto;
		position: absolute;
		top: 1.27rem;
		left: 0;
		right: 0;
		bottom: 0;
	}
	.ass-treepattern{
		padding: 0 0.4rem;
	}
	.ass-treepattern1{
		padding: 0 0.4rem;
		background: #f5f5f5;
	}
	.ass-tree-list{
		border-bottom: 0.01rem solid #DEDEDE;
		height: 0.78rem;
		line-height: 0.78rem;
		background: #fff;
		position: relative;
		padding-left: 0.5rem;
	}
	.ass-tree-list i,.ass-tree-list1 i,.ass-tree-list2 i{
		position: absolute;
		top: 50%;
		left: 0;
		transform: translate(0,-50%);
	}
	.ass-tree-list1,.ass-tree-list2{
		height: 0.74rem;
		line-height: 0.74rem;
		background: #f5f5f5;
		position: relative;
	}
	.ass-tree-list1 i{
		left:0.5rem
	}
	.ass-tree-list1{
		padding-left: 1rem;
	}
	.ass-tree-list2 i{
		left:1rem
	}
	.ass-tree-list2{
		padding-left: 1.5rem;
	}
</style>