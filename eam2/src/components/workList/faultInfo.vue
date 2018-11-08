<template>
	<div class="faultInfo-box row-box">
		<ul class="faultInfo-ul" style="min-height: 1rem;">
			<li class="list-item" :data-type="list.dataType" v-if="$route.query.infoType == '0'" v-for="(list,i) in guzhangdata" >
				<div class="item-box" @touchstart.capture="touchStart" @touchend.capture="touchEnd(list,$event)" @click="skip">
					<span class="left-page"><i class="iconfont icon-guzhangkuaicha"></i></span>
					<div class="cont-page">
						<p>{{list.positionName}}</p>
						<p class="fault-p">
							<span>{{list.failureTxt}}</span>
							<span>{{list.faultReason}}</span>
						</p>
					</div>
					<div class="right-page m">
						<span>{{list.faultCode}}</span>
					</div>
				</div>
				 <div class="delete" @click="deleteList(list)">删除</div>
			</li>
			<li class="list-item" :data-type="list.dataType" v-if="$route.query.infoType == '1'" v-for="(list,i) in guzhangdata">
				<div class="item-box" @touchstart.capture="touchStart" @touchend.capture="touchEnd(list,$event)" @click="skip">
					<span class="left-page"><i class="iconfont icon-guzhangkuaicha"></i></span>
					<div class="cont-page repla">
						<p>{{list.elementName}}<span><font color="red">{{list.partNum}}个</font></span></p>
						<p>
							<span>{{list.positionName}}</span>
							<span>{{list.bakfigureCode}}</span>
							<span>{{list.elementCode}}</span>
							<span>{{$route.query.failureTxt}}</span>
						</p>
					</div>
				</div>
				<div class="delete" @click="deleteList1(list)">删除</div>
			</li>
			
		</ul>
		<div class="add-info" @click="addinfo" v-if="$route.query.workorderStatus!='NEW' && $route.query.woStateId != 'NEW' && $route.query.workorderStatus!='FIN' && $route.query.woStateId != 'FIN'">
			<i class="iconfont icon-add"></i>
			<span>添加{{headData[1].html}}</span>
		</div>
		<button class="list-submit" style="margin-top: 0.4rem;" @click="$router.back(-1)">确认返回</button>
	</div>
</template>

<script>
	export default{
		data(){
			console.log(this.$route.query)
			return{
				headData:[
					{
						show:true,
						icon:'icon-fanhui',
						close:true,
						event:() => {
							this.$router.back(-1);
						}
					},
					{
						show:true,
						input:false,
						html:''
					}
				],
				guzhangdata:[],
				huanjiandata:[]
			}
		},
		methods:{
			addinfo(){
				if(this.$route.query.infoType == '0'){
					this.addguzhang()
				}
				if(this.$route.query.infoType == '1'){
					this.addhuanjian()
				}
			},
			addguzhang(){
				this.$router.push({path:'/faultshu',query:{...this.$route.query}})
			},
			addhuanjian(){
				this.$router.push({path:'/addReplace',query:{...this.$route.query}})
			},
			deleteList(list){//删除故障
				this.$MessageBox.confirm('确定删除该故障信息？').then(action => {
					this.deleteFaultConfirm(list.id)
				})
			},
			deleteList1(list){//删除换件
				this.$MessageBox.confirm('确定删除该换件信息？').then(action => {
					this.deleteReplacePart(list.id)
				})
			},
			getfindFaultMessage(){//获取故障信息
				this.$store.commit('showLoading')
				this.$axios.get(this.$root.URL+'eom/api/common/findFaultMessage',{
					params:{
						woId:this.$route.query.id
					}
				}).then(res => {
					this.$store.commit('hideLoading')
					let d = res.data;
					if(!d.result){
						d.items.forEach(e => {
							e.dataType = '0'
						})
						this.guzhangdata = d.items;
					}
				})
			},
			getfindReplacePart(){//获取换件信息
				this.$store.commit('showLoading')
				this.$axios.get(this.$root.URL+'eom/api/common/findReplacePart',{
					params:{
						woId:this.$route.query.id
					}
				}).then(res => {
					this.$store.commit('hideLoading')
					let d = res.data;
					if(!d.result){
						d.items.forEach(e => {
							e.dataType = '0'
						})
						this.guzhangdata = d.items;
					}
				})
			},
			deleteFaultConfirm(id){//删除故障信息
				this.$store.commit('showLoading')
				this.$axios.delete(this.$root.URL+'eom/api/common/deleteFaultConfirm/'+id).then(res => {
					this.$store.commit('hideLoading')
					let d = res.data;
					if(!d.result){
						this.$Toast({message:'删除成功!'});
						this.getfindFaultMessage();
					}else{
						this.$MessageBox('提示','删除失败!');
					}
				})
			},
			deleteReplacePart(id){//删除换件信息
				this.$store.commit('showLoading')
				this.$axios.delete(this.$root.URL+'eom/api/common/deleteReplacePart/'+id).then(res => {
					this.$store.commit('hideLoading')
					let d = res.data;
					if(!d.result){
						this.$Toast({message:'删除成功!'});
						this.getfindReplacePart();
					}else{
						this.$MessageBox('提示','删除失败!');
					}
				})
			},
			//跳转
			skip(){
				if( this.checkSlide() ){
					
					this.restSlide();
				}
			},
			//滑动开始
			touchStart(e){
				// 记录初始位置
				if(this.$route.query.workorderStatus == "NEW" || this.$route.query.workorderStatus == "FIN" || this.$route.query.woStateId == "NEW" || this.$route.query.woStateId == "FIN"){
					return false;
				}
				this.startX = e.touches[0].clientX;
			},
			 //滑动结束
			touchEnd(list,e){
				// 当前滑动的父级元素
				let parentElement = e.currentTarget.parentElement;
				// 记录结束位置
				this.endX = e.changedTouches[0].clientX;
				// 左滑
				if( list.dataType == 0 && this.startX - this.endX > 30){
					this.restSlide();
					list.dataType = 1;
				}
				// 右滑
				if( list.dataType == 1 && this.startX - this.endX < -30 ){
					this.restSlide();
					list.dataType = 0;
				}
				this.startX = 0;
				this.endX = 0;
			},
			//判断当前是否有滑块处于滑动状态
			checkSlide(){
				for(let i = 0, len = this.guzhangdata.length; i < len; i++){
					if(this.guzhangdata[i].dataType == 1){
						return true;
					}
				}
				return false;
			},
			//复位滑动状态
			restSlide(){
				this.guzhangdata.forEach(e => {
					e.dataType = 0;
				})
			},
		},
		activated(){
			this.guzhangdata = [];
			this.headData[1].html = this.$route.query.infoType == '0'?'故障信息':'换件信息';
			if(this.$route.query.infoType == '0'){
				this.getfindFaultMessage();
			}
			if(this.$route.query.infoType == '1'){
				this.getfindReplacePart();
			}
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
			mui.back = function(){
				history.go(-1)//回退到上一页面
			}
		}
	}
</script>

<style>
	.faultInfo-box{
		width: 100%;
	}
	
</style>