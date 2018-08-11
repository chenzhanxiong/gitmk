<template>
	<div class="archives-box">
		<ul class="archives-ul">
			<li v-for="(list,i) in archivesData.datalist[archivesData.datalist.length - 1]" :key="i" @click="listclick(list)">
				<i class="logo iconfont" :class="list.icon"></i>
				<span>{{list.name}}</span>
				<i class="btn iconfont icon-arr"></i>
			</li>
		</ul>
	</div>
</template>

<script>
	import {mapState} from 'vuex';
	export default{
		data(){
			return{
			}
		},
		computed:{
			...mapState(['archivesData']),
		},
		methods:{
			listclick(list){
				if(this.archivesData.child < 2){
					this.archivesData.child++;
					this.pusharr(this.archivesData.simulation[this.archivesData.child]);
					this.archivesData.title.push(list.name)
				}else{
					return
				}
			},
			pusharr(arr){
				this.archivesData.datalist.push(arr);
			},
			
			returnpage(){
				
			}
		},
		mounted(){
			let arr = this.archivesData.simulation[0]
			this.pusharr(arr)
		}
	}
</script>

<style>
	.archives-box{
		width: 100%;
	}
	.archives-ul{
		position: absolute;
		top: 0rem;
		left: 0;
		right: 0;
		bottom: 0;
		overflow: auto;
		padding: 0 0.2rem;
	}
	.archives-ul li{
		width: 100%;
		line-height: 1rem;
		border-bottom: 0.01rem solid #dedede;
		font-size: 0.28rem;
		overflow: hidden;
		cursor: pointer;
	}
	.archives-ul li>i.logo{
		float: left;
		font-size: 0.48rem;
		color: #00B393;
		margin-right: 0.2rem;
	}
	.archives-ul li>span{
		float: left;
		width: 5.5rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.archives-ul li>i.btn{
		float: right;
		margin-right: 0.2rem;
	}
</style>