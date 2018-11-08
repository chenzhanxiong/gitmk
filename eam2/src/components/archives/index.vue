<template>
	<div class="spareparts-box">
		<div class="row-box" v-if="show">
			<div class="archives-title">
				<span v-for="(list,i) in archivesData.title" :key="i">{{list}}</span>
			</div>
			<div class="spareparts-page">
				<swiper :options="swiperOption">
					<swiper-slide><spare-p></spare-p></swiper-slide>
					<swiper-slide><spare-map></spare-map></swiper-slide>
					<swiper-slide><spare-list></spare-list></swiper-slide>
					<div class="swiper-pagination" slot="pagination"></div>
				</swiper>
			</div>
		</div>
		<not-found v-if="!show" kaifazhong="true"></not-found>
	</div>
</template>

<script>
	import {mapState} from 'vuex'
	import notFound from '@/components/notFound'
	import SpareMap from '@/components/archives/spareMap'
	import SpareList from '@/components/archives/spareList'
	import SpareP from '@/components/archives/spareP'
	import {swiper,swiperSlide} from 'vue-awesome-swiper'
	export default{
		components:{ SpareMap,SpareList,SpareP,swiper,swiperSlide,notFound },
		data(){
			const self = this;
			return{
				show:true,
				title:['零件图','零件列表'],
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
						html:'零件图'
					}
				],
				swiperOption:{
					pagination:{
						el:'.swiper-pagination',
						clickable:true
					},
					on:{
						slideChangeTransitionEnd(){
							if(this.activeIndex == 0){
								self.$store.state.heads.show = 'archivesShow';
							}else{
								self.$store.state.heads.show = true;
								self.$store.state.heads.headData = self.headData;
								self.headData[1].html = self.title[this.activeIndex-1]
							}
							
						}
					}
				}
			}
		},
		computed:{
			...mapState(['archivesData']),
		},
		activated(){
			this.$store.state.heads.show = 'archivesShow';
			mui.back = function(){
				history.go(-1)//回退到上一页面
			}
		}
	}
</script>

<style>
	.spareparts-box{
		width: 100%;
	}
	.spareparts-page{
		position: absolute;
		top: 0.8rem;
		left: 0;
		right: 0;
		bottom: 0;
		overflow: auto;
	}
</style>