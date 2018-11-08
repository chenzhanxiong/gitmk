<template>
	<div class="photolist-box">
		<span v-if="listdata.length > 0" class="routine-img-li" :class="{delete1:deleteVisible}" v-for="(list,i) in listdata" :key="i" @touchstart="function(){if(!isFinish) showDeleteButton()}" @touchend="clearLoop">
			<i v-if="deleteVisible" @click="delete1(list,i)" class="delete iconfont icon-guanbi"></i>
			<img @click="imagebig(list)" :src="imgUrlBase+list.path"/>
		</span>
		<span class="routine-img-li" v-if="!isFinish"><i class="add iconfont icon-tianjia" @click="jump"></i></span>
		<mt-popup v-model="popupVisible" popup-transition="popup-fade">
			<img v-if="bigSrc" @click="popupVisible = false;bigSrc=''" class="bigimg" :src="imgUrlBase+bigSrc">
		</mt-popup>
	</div>
</template>

<script>
	export default{
		props:['isFinish'],
		data(){
			return{
				imgUrlBase:this.$store.state.devHost+'/files/',
				popupVisible:false,
				deleteVisible:false,
				photoQuery:false,
				listdata:[],
				imgBindId:'',
				bigSrc:'',
			}
		},
		methods:{
			showDeleteButton(){
				clearInterval(this.Loop);//再次清空定时器，防止重复注册定时器
			    this.Loop=setTimeout(() => {
			        this.deleteVisible = true;
			    },800);
			},
			clearLoop() {
			    clearInterval(this.Loop);
			},
			delete1(list,index){
				if(!this.photoQuery){
					this.listdata.splice(index,1);
					return false;
				}
				this.$axios.delete(this.$root.URL+'eom/api/photo/deleteFileSave/'+list.woId,).then(res => {
					let d = res.data;
					if(!d.result){
						this.listdata.splice(index,1);
						this.$Toast('照片删除成功！')
					}else{
						this.$MessageBox('提示','照片删除失败！')
					}
				})
			},
			jump(){
				this.$router.push({
					path:'/camera',
					query:{
						redirect: this.$router.currentRoute.fullPath,
						imgBindId:this.imgBindId
					}
				})
			},
			imagebig(list){
				this.bigSrc = list.path;
				this.popupVisible = true;
			},
			
			getPhoto(){//获取照片
				this.$axios.get(this.$root.URL+'eom/api/photo/query',{
					params:{
						imgBindId:this.imgBindId
					}
				}).then(res => {
					let d = res.data;
					if(!d.result){
						this.listdata = d.item;
						this.$store.state.imgBindId[this.imgBindId] = d.item
					}
				})
			},
			displayImg(imgBindId){
				this.imgBindId = imgBindId;
				this.listdata = [];
				let d = this.$store.state.imgBindId[this.imgBindId]
				if(d){
					this.listdata = d;
				}else{
					this.photoQuery = true;
					this.getPhoto()
				}
			},
			disAbnImg(){
				this.imgBindId = 'abnImgId';
				this.listdata = [];
				this.listdata = this.$store.state.abnImgId;
			}
		},
		mounted(){
			document.addEventListener('click',(e) => {
				if(e.target.className!='routine-img-li'){
						this.deleteVisible=false;
				}
			})
		}
	}
</script>

<style>
	.photolist-box{
		width: 100%;
		overflow: hidden;
	}
	.photolist-box .routine-img-li{
		display: inline-block;
		width: 1rem;
		height: 1rem;
		margin: 0.15rem;
		overflow: hidden;
		position: relative;
	}
	.photolist-box .routine-img-li.delete1{
		overflow: visible;
		top: -0.15rem;
	}
	.photolist-box .routine-img-li>img{
		width: 1rem;
		height: 1rem;
		display: inline-block;
	}
	.photolist-box .mint-popup{
		border-radius: 0;
	}
	.bigimg{
		display: block;
		width: 6rem;
	}
	.photolist-box .routine-img-li>.big{
		width: 80%;
		height: auto;
		left: 10%;
		top: 1.44rem;
	}
	.photolist-box .routine-img-li>i.add{
		font-size: 0.95rem;
		display: block;
		position: relative;
		font-weight: normal;
		color: #ccc;
	}
	.photolist-box .routine-img-li>i.delete{
		position: absolute;
		top: -0.17rem;
		right: -0.17rem;
		color: #f66;
		font-size: 0.35rem;
		z-index: 1;
	}
	.photolist-box .mint-popup{
		position: fixed;
	}
</style>