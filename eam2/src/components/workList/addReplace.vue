<template>
	<div class="add-replace-box row-box">
		<ul class="add-replace-ul">
			<li @click="assPhotosHref">
				<span>添加部位</span>
				<div class="add-replace-page">
					<span>{{$route.query.positionName}}</span>
					<ul class="replace-page-child" @click.stop v-if="bwlist.length > 0">
						<li v-for="(li,i) in bwlist" :key="i">
							<span>{{li.text}}</span>
							<span>
								<i :class="{active:li.num > 1}" @click="numReduce(li,i,'bwlist')">-</i>
								<input type="number" v-model="li.num" disabled/>
								<i class="active" @click="li.num++">+</i>
							</span>
						</li>
					</ul>
				</div>
				<i class="iconfont icon-arr"></i>
			</li>
			<li @click="addSparepart">
				<span>添加备件</span>
				<div class="add-replace-page">
					<span></span>
					<ul class="replace-page-child" @click.stop v-if="bjlist.length > 0">
						<li v-for="(li,i) in bjlist" :key="i">
							<span>{{li.text}}</span>
							<span>
								<i :class="{active:li.num > 1}" @click="numReduce(li,i,'bjlist')">-</i>
								<input type="number" v-model="li.num" disabled/>
								<i class="active" @click="li.num++">+</i>
							</span>
						</li>
					</ul>
				</div>
				<i class="iconfont icon-arr"></i>
			</li>
		</ul>
		
	</div>
</template>

<script>
	export default{
		data(){
			return{
				visitible:'',
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
						html:'添加换件信息'
					},
					{
						show:true,
						html:'保存',
						event:()=>{
							this.postSaveReplaceParts()
						}
					}
				],
				bwlist:[],
				bjlist:[]
				
			}
		},
		methods:{
			assPhotosHref(){
				this.$router.push({path:'/assPhotos',query:{...this.$route.query}})
			},
			addSparepart(){
				this.$router.push({path:'/addSparepart',query:{...this.$route.query,item:this.bjlist}})
			},
			numReduce(list,index,arr){
				if(list.num > 1){
					list.num --;
				}else{
					this.$MessageBox.confirm('确定删除？').then(action => {
						this[arr].splice(index,1)
					})
				}
			},
			postSaveReplaceParts(){//确认换件信息
				let arr = [];
				arr = arr.concat(this.bwlist);
				arr = arr.concat(this.bjlist);
				arr.forEach(e => {
					e.fAwoId = this.$route.query.id;
					e.equKeyId = this.$route.query.equKeyId;
					e.postionId = this.$route.query.postionId;
					e.partId = e.code;
					e.partNum = e.num;
				})
				this.$store.commit('showLoading')
				this.$axios.post(this.$root.URL+'eom/api/common/saveReplaceParts',{
					list:arr
				}).then(res => {
					this.$store.commit('hideLoading')
					let d = res.data;
					if(!d.result){
						this.$Toast({message:'提交成功!'});
						this.$router.back(-1)
					}else{
						this.$MessageBox('提示','提交失败!');
					}
				})
			}
		},
		beforeRouteEnter(to,from,next){
			next(vm => {
				switch (from.name){
					case 'AssPhotos':
						if(vm.$route.params.code){
							vm.bwlist.push({...vm.$route.params,num:1})
						}
					break;
					case 'AddSparepart':
						if(vm.$route.params.item){
							vm.bjlist = vm.$route.params.item
						}
						
					break;
					default:
						vm.bwlist = [];
						vm.bjlist = [];
					break;
				}
			})
		},
		activated(){
			mui.back = function(){
				history.go(-1)//回退到上一页面
			}
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
		}
	}
</script>

<style>
	.add-replace-ul{
		width: 100%;
		padding: 0 0.2rem;
	}
	.add-replace-ul>li{
		padding: 0.2rem;
		overflow: hidden;
		border-bottom: 0.01rem solid #dedede;
	}
	.add-replace-ul>li>span,.add-replace-page{
		float: left;
		line-height: 0.74rem;
		/*height: 0.74rem;*/
		font-size: 0.3rem;
	}
	.add-replace-ul>li>span{
		width: 1.5rem;
	}
	.add-replace-ul>li>.add-replace-page{
		width: 4.5rem;
		color: #666;
	}
	.add-replace-page>span{
		float: right;
	}
	.add-replace-ul>li>i{
		float: right;
		margin-top: 0.2rem;
	}
	.replace-page-child{
		margin-top: 0.74rem;
	}
	.replace-page-child>li>span:first-child{
		width: 3rem;
		float: left;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.replace-page-child>li>span:last-child{
		float: right;
	}
	.replace-page-child>li>span:last-child>input{
		width: 0.4rem;
		text-align: center;
		background: #fff;
		box-shadow: none;
		border: none;
	}
	.replace-page-child>li>span:last-child>input:disabled{
		background: #fff;
		box-shadow: none;
		opacity: 1;
    		-webkit-opacity: 1;
	}
	.replace-page-child>li>span:last-child>i{
		display: inline-block;
		width: 0.25rem;
		height: 0.25rem;
		line-height: 0.23rem;
		text-align: center;
		border: 0.01rem solid #00B393;
		border-radius: 50%;
		color: #00B393;
	}
	.replace-page-child>li>span:last-child>i.active{
		color: #fff;
		background: #00B393;
	}
</style>