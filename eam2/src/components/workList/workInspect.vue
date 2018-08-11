<template>
	<div class="work-inspect-box row-box">
		<swiper :options="swiperOption">
			<swiper-slide>
				<div class="workxun-box" v-if="$store.state.worklistData.worklistHandle.length > 1">
					<swiper :options="swiperOption1">
						<swiper-slide class="workxun-list">
							<span></span>
							<p>2#设备</p>
						</swiper-slide>
						<swiper-slide class="workxun-list">
							<span></span>
							<p>2#设备</p></swiper-slide>
						<swiper-slide class="workxun-list">
							<span></span>
							<p>2#设备</p></swiper-slide>
					</swiper>
				</div>
				<tablec :listdata="worklistHandleData1.tablec"></tablec>
				<inspection-content :listdata="worklistHandleData1"></inspection-content>
				<button class="list-submit" style="margin:0.2rem auto 0.8rem;" @click="worksubmit">提交</button>
			</swiper-slide>
			<swiper-slide v-if="ce">
				<div class="slide-child-box">
					<tablec></tablec>
					<inspection-content></inspection-content>
				</div>
				<div class="work-footer">
					<span @click="startClick">
						<i class="iconfont icon-wancheng"></i>
						<p>开始</p>
					</span>
					<span @click="endClick">
						<i class="iconfont icon-jieshu1"></i>
						<p>结束</p>
					</span>
					<span @click="$router.push('/faultInfo')">
						<i class="iconfont icon-jinggao"></i>
						<p>故障信息</p>
					</span>
					<span>
						<i class="iconfont icon-icon147"></i>
						<p>换件信息</p>
					</span>
				</div>
			</swiper-slide>
			<div v-if="ce" class="swiper-pagination" slot="pagination"></div>
		</swiper>
		<mt-popup v-model="popupStart" popup-transition="popup-fade">
		  	<div class="report-pop-msg">
		  		<div class="pop-page-p"><span>当前时间：</span><span>{{startDate}}</span></div>
		  		<photolist style="padding: 0 0.2rem;" :listdata="img"></photolist>
		  	</div>
		  	<div class="report-pop-btn" @click="popupStart = !popupStart">
		  		<span>提交</span>
		  	</div>
		</mt-popup>
		<mt-popup v-model="popupEnd" popup-transition="popup-fade">
		  	<div class="report-pop-msg">
		  		<div class="work-pop-row">
		  			<ul class="work-pop-radiou">
		  				<li v-for="(list,i) in radioulist" :key="i" @click="radiouactive = list"><span>{{list}}</span><i class="radious" :class="{active:radiouactive == list}"></i></li>
		  			</ul>
		  			<ul class="work-pop-input">
		  				<li>
		  					<span>当前时间：</span>
		  					<input type="" name="" value="" v-model="endDate"/>
		  				</li>
		  				<li>
		  					<span>维修时长：</span>
		  					<input type="" name="" value="" v-model="difference"/>
		  				</li>
		  			</ul>
		  		</div>
		  		<photolist style="padding: 0 0.2rem;" :listdata="img"></photolist>
		  	</div>
		  	<div class="report-pop-btn" @click="popupEnd = !popupEnd">
		  		<span>提交</span>
		  	</div>
		</mt-popup>
	</div>
</template>

<script>
	import Photolist from '@/components/assembly/photolist'
	import {swiper,swiperSlide} from 'vue-awesome-swiper'
	import Tablec from '@/components/assembly/tablec'
	import InspectionContent from '@/components/workList/inspectionContent'
	import {formatDate} from '@/static/date'
	import { MessageBox } from 'mint-ui'
	export default{
		data(){
			let worklistHandleData1 = this.$store.state.worklistData.worklistHandleData1;
			let self = this;
			return{
				img:[],
				radiouactive:'',
				radioulist:['已解决故障','未解决故障'],
				ce:false,
				popupStart:false,
				popupEnd:false,
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
						html:'1#设备'
					},
					{
						show:true,
						html:'状态'
					}
				],
				swiperOption:{
					pagination:{
						el:'.swiper-pagination',
						clickable:true
					},
				},
				swiperOption1:{
					centeredSlides:true,
					slidesPerView:3,
					on:{
						transitionEnd:function(swiper){
							self.$store.state.worklistData.num = this.activeIndex
						}
					}
				},
				startDate:'',
				endDate:'',
				difference:'',
				worklistHandleData1:worklistHandleData1
			}
		},
		components:{ Tablec,InspectionContent,swiper,swiperSlide,Photolist },
		methods:{
			startClick(){
				let date1 = new Date();
				this.startDate = formatDate(date1,"yyyy-MM-dd hh:mm:ss");
				this.popupStart = !this.popupStart;
			},
			endClick(){
				let date2 = new Date();
				this.endDate = formatDate(date2,"hh:mm:ss");
				let t = new Date(date2) - new Date(this.startDate);
				let h,m,s;
				h=Math.floor(t/60/60/1000);
            		m=Math.floor(t/60/1000%60);
            		s=Math.floor(t/1000%60);
            		h = this.checkTime(h);
            		m = this.checkTime(m);
            		s = this.checkTime(s);
				this.difference = h+':'+m+':'+s;
				this.popupEnd = !this.popupEnd;
			},
			checkTime(i){
				if (i<10) {
            			i = "0" +i;
          		}
          		return i;
			},
			worksubmit(){
				MessageBox.confirm('确认提交？').then(() =>{
					this.$parent.handleSubmit();
				})
			}
		},
		mounted(){
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
		}
	}
</script>

<style>
	.workxun-box{
		width: 100%;
		height: 1.94rem;
		padding: 0 0.3rem;
	}
	.workxun-box .swiper-container{
		border-bottom: 0.01rem solid #dedede;
	}
	.work-inspect-box{
		width: 100%;
	}
	.pop-page-p{
		width: 4rem;
		text-align: center;
		margin-bottom: 0.2rem;
	}
	.pop-page-p span{
		white-space: nowrap;
		font-size: 0.23rem;
		display: inline-block;
	}
	.pop-page-p span:first-child{
		font-size: 0.26rem;
		width: 1.44rem;
	}
	.report-pop-msg .photolist-box{
		text-align: center;
	}
	.work-pop-row{
		width:3.7rem;
		overflow: hidden;
	}
	.work-pop-radiou{
		width: 100%;
	}
	.work-pop-radiou li{
		height: 0.55rem;
		line-height: 0.55rem;
		text-align: right;
	}
	.work-pop-radiou li span{
		float: left;
	}
	.work-pop-radiou li:before{
		content: '';
		display: inline-block;
		width: 0;
		height: 100%;
		vertical-align: middle;
	}
	.work-pop-radiou li i{
		vertical-align: middle;
		display: inline-block;
	}
	.work-pop-input{
		width: 100%;
	}
	.work-pop-input li{
		width: 100%;
		line-height: 0.5rem;
		height: 0.5rem;
		text-align: right;
		margin: 0.2rem 0;
	}
	.work-pop-input li span{
		float: left;
		width: 1.26rem;
		text-align: left;
	}
	.work-pop-input input{
		width: 2.44rem;
		display: inline-block;
		border: 0.01rem solid #dedede;
		outline: none;
		padding: 0.1rem 0.2rem;
	}
	.workxun-list{
		text-align: center;
	}
	.workxun-list span{
		display: block;
		margin: 0.2rem auto;
		width: 0.72rem;
		height: 0.72rem;
		border-radius: 0.1rem;
		background-color: #00B393;
		box-sizing: content-box;
		border: 0 solid #b16a42;
		transition: all 200ms;
	}
	.workxun-list.swiper-slide-active>span{
		margin-top: 0.15rem;
		border-width: 0.04rem;
	}
</style>