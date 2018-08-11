<template>
	<div class="photolist-box">
		<span class="routine-img-li" v-for="(list,i) in listdata" :key="i" @touchstart="showDeleteButton(list)" @touchend="clearLoop"><i v-if="list.delete1" @click="delete1(i)" class="delete iconfont icon-guanbi"></i><img :src="list.src"/></span>
		<span class="routine-img-li"><i class="add iconfont icon-tianjia" @click="jump"></i></span>
	</div>
</template>

<script>
	export default{
		props:['listdata'],
		methods:{
			showDeleteButton(list){
				clearInterval(this.Loop);//再次清空定时器，防止重复注册定时器
			    this.Loop=setTimeout(() => {
			        list.delete1 = true;
			        console.log(list)
			    },1000);
			},
			clearLoop() {
			    clearInterval(this.Loop);
			},
			delete1(index){
				this.listdata.splice(index,1);
			},
			jump(){
				this.$router.replace('/camera')
			}
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
		position: relative;
	}
	.photolist-box .routine-img-li>img{
		width: 100%;
		height: 100%;
	}
	.photolist-box .routine-img-li>i.add{
		font-size: 1rem;
		position: relative;
		top: -0.05rem;
		color: #DEDEE0;
		font-weight: normal;
		color: #DEDEDE;
	}
	.photolist-box .routine-img-li>i.delete{
		position: absolute;
		top: -0.17rem;
		right: -0.17rem;
		color: #f66;
		font-size: 0.35rem;
		z-index: 1;
	}
</style>