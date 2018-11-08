<template>
	<div class="card-box" v-loading="swipeLoading">
		<swiper :options="swiperOption">
			<swiper-slide v-for="(list,i) in listdata" :key="i">
				<div class="card-img">
					<img :src="list.user" alt="">
				</div>
				<ul class="card-ul">
					<li>
						<span>姓名：</span><el-tooltip :open-delay="500" :content="list.personName"><span>{{list.personName}}</span></el-tooltip>
					</li>
					<li>
						<span>岗位：</span><el-tooltip :open-delay="500" :content="list.roleName"><span>{{list.roleName}}</span></el-tooltip>
					</li>
					<li>
						<span>职称：</span><el-tooltip :open-delay="500" :content="list.title"><span>{{list.title}}</span></el-tooltip>
					</li>
				</ul>
				<el-rate
				  v-model="list.evaluate"
				  disabled
				  :colors="['#99A9BF','#51c3e5','#00B393']"
				  >
				</el-rate>

			</swiper-slide>
			<div class="swiper-pagination" slot="pagination"></div>
		</swiper>
	</div>
</template>

<script>
	import { swiper, swiperSlide } from 'vue-awesome-swiper'
	export default{
		components:{ swiper, swiperSlide },
		data(){
			return{
				swipeLoading:false,
				evaluate:5,
				listdata:[],
				swiperOption:{
					pagination: {
						el: '.swiper-pagination',
						clickable :true,
					},
					autoplay:true,
					initialSlide:0,
					slideToClickedSlide: true,
					slidesPerView:3,
					slidesPerGroup:3,
				}
			}
		},
		methods:{
			findEquAndRole(){
				this.swipeLoading = true;
				this.$axios.get(this.$root.URL+'eom/api/role/findEquAndRole',{
					params:{
						equCode:this.$store.state.activeEquId
					}
				}).then((res) => {
					this.swipeLoading = false;
					let data = res.data;
					if(!data.result){
						data.items.forEach(e =>{
							e.user = './static/images/user.png';
							e.evaluate = 5;
						})
						this.listdata = data.items;
					}else{
						
					}
				})
			}
		},
		computed:{
			activeEquId(){
				return this.$store.state.activeEquId;
			}
		},
		watch:{
			activeEquId(){
				this.findEquAndRole();
			},
		},
		mounted(){
			this.findEquAndRole();
		}
	}
</script>

<style>
	.card-box{
		width: 100%;
		height: 100%;
		padding: 0.2rem;
		padding-bottom: 0;
	}
	.swiper-container {
		height: 100%;
	}
	.card-img{
		width: 1.2rem;
		height: 1.2rem;
		overflow: hidden;
		border: 1px solid #00B393;
		float: left;
		margin-right: 0.1rem;
	}
	.card-img img{
		display: block;
		width: 100%;
		height: 100%;
	}
	.card-ul{
		height: 1.2rem;
		line-height: 0.4rem;
	}
	.card-ul li{
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.el-rate__icon{
		font-size: 0.2rem;
		margin-right: 0.06rem;
	}
	.el-rate{
		height: 0.2rem;
	}
</style>