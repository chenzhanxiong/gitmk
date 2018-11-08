<template>
	<div class="ass-photos row-box">
		<div class="list-model" style="position: relative;">
			<div class="ass-input-box">
				<i class="logo iconfont icon-sousuo"></i>
				<input type="text" name="" id="" v-model="searchl.equName" placeholder="请输入关键字搜索" @input="inputclick"/>
				<i class="btn iconfont icon-guanbi" v-if="searchl.equName != ''" @click="searchl.equName = '';inputclick()"></i>
			</div>
			<span class="scan-btn" @click="scanCode"><i class="iconfont icon-saomiao"></i></span>
		</div>
		<div class="ass-list">
			<div class="ass-h-row">
				<span class="ass-h-title">已选设备/部位</span>
				<ul class="ass-h-ul">
					<li v-if="activeass.length <= 0">尚未选择，请选择条件</li>
					<li v-if="activeass.length > 0 && list != ''" v-for="(list,i) in activeass" :key="i">{{list.text}}<i class="iconfont icon-guanbi1" @click="assdelete(i)"></i></li>
				</ul>
			</div>
		
			<div v-if="initdata.length > 0" class="ass-treepattern">
				<div class="ass-tree-list" v-for="(list,i) in initdata" :key="i" v-if="activeass.length <= 0" @click="assChoice(list,false)">
					<i class="radioui"></i><span v-html="list.text"></span>
				</div>
				<div class="ass-tree-list" v-if="activeass.length > 0" @click="assdelete(0)">
					<i class="radioui active"></i><span v-html="activeass[0].text"></span>
				</div>
			</div>
			<div class="ass-treepattern1" v-for="(list,index) in activeass" :key="index" v-if="activeass.length > 0">
				<div :class="'ass-tree-list'+(index+1)" v-for="(lists,i) in datalist1" :key="'a'+i" v-if="!activeass[index+1]" @click="assChoice(lists,true)">
					<i class="radioui"></i><span v-html="lists.text"></span>
				</div>
				<div :class="'ass-tree-list'+(index+1)" v-if="activeass[index+1]" @click="assdelete(index+1)">
					<i class="radioui active"></i><span v-html="activeass[index+1].text"></span>
				</div>
			</div>
			<not-found v-if="initdata.length <= 0" not="true"></not-found>
		</div>
		
	</div>
</template>

<script>
	const delay = (function() {
	  let timer = 0;
	  return function(callback, ms) {
		clearTimeout(timer);
		timer = setTimeout(callback, ms);
	  };
	})();
	import notFound from '@/components/notFound'
	export default{
		components:{notFound},
		data(){
			let abnorData = this.$store.state.abnorData;
			return{
				isconfirm:false,
				searchl:{
					equCode:'',
					positionCode:'',
					equName:''
				},
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
							this.confirma()
						}
					}
				],
				activeass:[],
				datalist1:[],
				initdata:[],
			}
		},
		methods:{
			isinfoType(){//判断类型
				switch (this.$route.query.infoType){
					case '0':
						this.getfindFaultMessageInit()
					break;
					case '1':
						this.getfindClassReplacePartInit()
					break;
					case '2':
						this.getfind()
					break;
				} 
			},
			scanCode(){//扫描跳转
				this.$router.push({
					path:'/scanCode',
					query:{
						redirect:'/assPhotos',
						type:{
							infoType:this.$route.query.infoType
						},
					},
				})
			},
			assChoice(list,type) {
				if(!type){
					this.searchl.equCode = list.code;
				}else{
					this.searchl.positionCode = list.code;
				}
				this.isinfoType();
			},
			assdelete(index){
				let len = this.activeass.length - index;
				this.activeass.splice(index,len);
				if(this.activeass.length > 0){
					this.searchl.equCode = this.activeass[0].code;
					this.searchl.positionCode = this.activeass[this.activeass.length-1].code;
				}else{
					this.searchl.equCode = '';
					this.searchl.positionCode = '';
				}
				if(this.searchl.equName){
					this.searchl.equName = '';
				}
				this.isinfoType();
			},
			arrangeItem(item,last){//整理数据
				this.activeass.push({
					text:item.text,
					code:item.code,
					id:item.id
				});
				if(last){
					return false;
				}
				if(item.items[0].last){
					this.arrangeItem(item.items[0],true)
				}else if(item.items.length == 1 && item.items[0].items.length > 0){
					this.arrangeItem(item.items[0])
				}else{
					this.datalist1 = item.items;
				}
			},
			getfindFaultMessageInit(){//故障信息BOM 初始化
				this.$store.commit('showLoading')
				this.$axios.get(this.$root.URL+'eom/api/common/findFaultMessageInit',{
					params:{
						...this.searchl
					}
				}).then(res => {
					this.activeass = [];
					this.datalist1 = [];
					this.$store.commit('hideLoading')
					let d = res.data;
					if(!d.result){
						this.initdata = d.items;
						if(this.initdata.length <= 0 || this.initdata[0] == null){
								return false
						}
						if(d.items[0].last){
							this.arrangeItem(d.items[0],true)
						}else if(this.initdata.length == 1 && d.items[0].items.length > 0){
							this.arrangeItem(d.items[0])
						}
					}
				})
			},
			getfindClassReplacePartInit(){//换件信息BOM 初始化
				this.$store.commit('showLoading')
				this.$axios.get(this.$root.URL+'eom/api/common/findClassReplacePartInit',{
					params:{
						...this.searchl
					}
				}).then(res => {
					this.activeass = [];
					this.datalist1 = [];
					this.$store.commit('hideLoading')
					let d = res.data;
					if(!d.result){
						this.initdata = d.items;
						if(this.initdata.length <= 0 || this.initdata[0] == null){
								return false
						}
						if(d.items[0].last){
							this.arrangeItem(d.items[0],true)
						}else if(this.initdata.length == 1 && d.items[0].items.length > 0){
							this.arrangeItem(d.items[0])
						}
					}
				})
			},
			getfind(){//异常上报
				
			},
			confirma(){//保存
				this.isconfirm = true;
				this.$router.back(-1);
			},
			inputclick(){
				delay(() => {
					this.isinfoType()
				},300)
			}
 		},
		computed:{
			
		},
 		watch:{
 			
 		},
		beforeRouteEnter(to, from, next){
			next(vm=>{
				if(from.name == 'ScanCode'){
					vm.searchl.equCode = vm.$route.query.id;
				}else{
					vm.searchl.equCode = vm.$route.query.equCode || '';
					vm.searchl.positionCode = vm.$route.query.positionCode || '';
				}
				vm.isinfoType();
			});
		},
		beforeRouteLeave(to,from,next){
			if(this.isconfirm && this.activeass.length > 0){
				if(to.name == 'AbnormallyReport' || to.name == 'Photocom'){
					let abn = this.$store.state.abnorData.listvalue;
					abn.equKeyId = this.activeass[0].id || '';
					abn.equName = this.activeass[0].text || '';
					abn.equCode = this.activeass[0].code || '';
					if(this.activeass.length > 1){
						abn.postionId = this.activeass[this.activeass.length-1].id || '';
						abn.positionName = this.activeass[this.activeass.length-1].text || '';
						abn.positionCode = this.activeass[this.activeass.length-1].code || ''
					}
					if(to.name == 'Photocom'){
						this.$Toast('已关联');
						to.params.equCode = abn.equCode;
						to.params.positionCode = abn.positionCode;
					}
					
				}else{
					let d = this.activeass[this.activeass.length - 1];
					to.params.code = d.code;
					to.params.text = d.text;
					to.params.id = d.id;
				}
			}
			next();
		},
 		activated(){
			this.activeass = [];
			this.datalist1 = [];
			this.initdata = [];
			this.isconfirm = false;
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
			mui.back = function(){
				history.go(-1)//回退到上一页面
			}
		}
	}
</script>

<style>
	.ass-photos{
		width: 100%;
	}
	.ass-input-box{
		width: 5.5rem;
		margin-left: 0.4rem;
		position: relative;
		border: 0.02rem solid #999;
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
		border: 1px solid #DEDEDE;
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
		border-bottom: 1px solid #DEDEDE;
		height: 0.78rem;
		background: #fff;
		position: relative;
		padding-left: 0.3rem;
	}
	.ass-tree-list i,.ass-tree-list1 i,.ass-tree-list2 i,.ass-tree-list3 i,.ass-tree-list4 i{
		display: inline-block;
		vertical-align: middle;
		left: -0.2rem;
	}
	.ass-tree-list1,.ass-tree-list2,.ass-tree-list3,.ass-tree-list4{
		font-size: 0.24rem;
		height: 0.74rem;
		background: #f5f5f5;
		position: relative;
		overflow: hidden;
	}
	.ass-tree-list span,.ass-tree-list1 span,.ass-tree-list2 span,.ass-tree-list3 span,.ass-tree-list4 span{
		display: inline-block;
		vertical-align: middle;
	}
	.ass-tree-list:before,.ass-tree-list1:before,.ass-tree-list2:before,.ass-tree-list3:before,.ass-tree-list4:before{
		content: '';
		display: inline-block;
		width: 0;
		height: 100%;
		vertical-align: middle;
	}
	
	.ass-tree-list1{
		padding-left: 0.8rem;
	}

	.ass-tree-list2{
		padding-left: 1.3rem;
	}
	
	.ass-tree-list3{
		padding-left: 1.8rem;
	}

	.ass-tree-list4{
		padding-left: 2.3rem;
	}
</style>