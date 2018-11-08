<template>
	<div class="workfoot">
		<div class="work-footer">
			<span v-if="isSave && (page.workorderStatus=='NEW' || page.woStateId == 'NEW')" @click="startClick">
				<i class="iconfont icon-kaishi"></i>
				<p>开始</p>
			</span>
			<span v-if="page.workorderStatus=='ING' || page.woStateId == 'ING'" @click="endClick">
				<i class="iconfont icon-jieshu1"></i>
				<p>结束</p>
			</span>
			<span v-if="page.workorderStatus=='SFI'" @click="closeClick">
				<i class="iconfont icon-wancheng"></i>
				<p>完成</p>
			</span>
			<span @click="fault">
				<i class="iconfont icon-jinggao"></i>
				<p>故障信息</p>
			</span>
			<span @click="replacement">
				<i class="iconfont icon-icon147"></i>
				<p>换件信息</p>
			</span>
		</div>
		<mt-popup v-model="popupStart" popup-transition="popup-fade">
			<div class="report-pop-msg">
				<div class="pop-page-p"><span>当前时间：</span><span>{{startDateMb}} {{startTimeMb}}</span></div>
				<photolist style="padding: 0 0.2rem;" ref="imglists"></photolist>
			</div>
			<div class="report-pop-btn" @click="startfn">
				<span>提交</span>
			</div>
		</mt-popup>
		<mt-popup v-model="popupEnd" popup-transition="popup-fade">
			<div class="report-pop-msg">
				<div class="work-pop-row">
					<ul class="work-pop-radiou">
						<li v-for="(list,i) in radioulist" :key="i" @click="radiouactive = list.value"><span>{{list.name}}</span><i class="radious" :class="{active:radiouactive == list.value}"></i></li>
					</ul>
					<ul class="work-pop-input">
						<li>
							<span>当前时间：</span>
							<input type="" name="" value="" readonly v-model="endTimeMb"/>
						</li>
						<li>
							<span>维修时长：</span>
							<input type="" name="" value="" readonly v-model="difference"/>
						</li>
					</ul>
				</div>
				<photolist style="padding: 0 0.2rem;" ref="imglist"></photolist>
			</div>
			<div class="report-pop-btn" @click="endfn">
				<span>提交</span>
			</div>
		</mt-popup>
	</div>
	
</template>

<script>
	import {formatDate} from '@/static/date'
	import Photolist from '@/components/assembly/photolist'
	export default{
		props:['page','isSave'],
		components:{Photolist},
		data(){
			return{
				img:[],
				radiouactive:this.page.result || this.page.aResultId || '1',
				radioulist:[{name:'已解决故障',value:'1'},{name:'未解决故障',value:'0'}],
				popupStart:false,
				popupEnd:false,
				startDateMb:this.page.startDateMb || '',
				startTimeMb:this.page.startTimeMb || '',
				endTimeMb:this.page.endTimeMb || '',
				difference:'',
			}
		},
		methods:{
			startClick(){//点击开始
				let date1 = new Date();
				this.startDateMb = formatDate(date1,"yyyy-MM-dd");
				this.startTimeMb = formatDate(date1,"hh:mm:ss");
				this.$refs.imglists.displayImg(this.page.imgBindId);
				this.popupStart = true;
			},
			startfn(){
				this.popupStart = false;
				this.page.startDateMb = this.startDateMb;
				this.page.startTimeMb = this.startTimeMb
				this.$emit('startFn');
			},
			endClick(){
				let date2 = new Date();
				this.endDateMb = formatDate(date2,"yyyy-MM-dd");
				this.endTimeMb = this.endTimeMb = formatDate(date2,"hh:mm:ss");
				let t = date2 - new Date(this.page.startDateMb.replace(/-/g,"/") +' '+ this.page.startTimeMb);
				let h,m,s;
				h=Math.floor(t/60/60/1000);
					m=Math.floor(t/60/1000%60);
					s=Math.floor(t/1000%60);
					h = this.checkTime(h);
					m = this.checkTime(m);
					s = this.checkTime(s);
				this.difference = h+':'+m+':'+s;
				this.$refs.imglist.displayImg(this.page.imgBindId);
				this.popupEnd = !this.popupEnd;
				if(this.page.result){
					this.radiouactive = this.page.result;
				}
			},
			endfn(){
				this.page.endDateMb = this.endDateMb;
				this.page.endTimeMb = this.endTimeMb;
				if(this.page.result){
					this.page.result = this.radiouactive;
				}else{
					this.page.aResultId = this.radiouactive;
				}
				this.popupEnd = false;
				this.$emit('endFn');
			},
			closeClick(){
				this.$MessageBox.confirm('确定关闭该工单？').then(action => {
					this.$emit('closeFn');
				})
			},
			fault(){
				this.$router.push({
					path:'/faultInfo',
					query:{...this.page,infoType:'0'}
				})
			},
			replacement(){
				this.$router.push({
					path:'/faultInfo',
					query:{...this.page,infoType:'1'}
				})
			},
			checkTime(i){
				if (i<10) {
					i = "0" +i;
				}
				return i;
			}
			
		}
	}
</script>

<style>
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
	.workfoot .v-modal{
		position: absolute;
		top: 0;
	}
	.workfoot .mint-popup{
		position: absolute;
	}
</style>