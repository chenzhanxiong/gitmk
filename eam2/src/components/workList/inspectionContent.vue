<template>
	<div class="inspectionContent-box">
		<div class="inspectionContent-title">
			<span>{{handle.title}}内容:</span>
			<span>{{handle.page}}/{{handle.total}}</span>
			<div class="inspectionContent-tab">
				<button class="list-submit-m" :disabled="handle.page == 1" @click="isPaging(false)">上一条</button>
				<button class="list-submit-m" :disabled="handle.page == handle.total || handle.total < '2'" @click="isPaging(true)">下一条</button>
			</div>
		</div>
		<ul class="inspectionContent-ul">
			<li v-for="(list,i) in listdata.arr" :key="i">
				<span>{{list.name}}：</span>
				<span>{{list.value}}</span>
			</li>
		</ul>
		<ul class="workdetail-in">
			<li v-if="listdata.setValue">
				<span>{{listdata.setValue.name}}</span>
				<input class="workdetail-type" type="number" @click="realPopshow" readonly  v-model="listdata.setValue.value"/>
			</li>
			<li>
				<span>{{listdata.result.name}}</span>
				<div class="workdetail-radio">
					<span v-for="(list,i) in popuplist" :key="i" 
						@click="function(){if(listdata.isSave) clickResule(list.index)}">
						<i class="radious" :class="{active:listdata.result.value == list.index,disabled:!listdata.isSave}"></i>{{list.value}}</span>
				</div>
				<button class="list-submit-m" :disabled="!listdata.isSave" v-if="listdata.result.value == '0'" @click="abnormal">异常上报</button>
			</li>
		</ul>
		<routine-list class="worklb" v-if="listdata.aProcedureTxt" :name="listdata.aProcedureTxt.name" :value="listdata.aProcedureTxt.value" :arr="listdata.isSave" @event="jumphref"></routine-list>
		<photolist style="padding: 0.2rem;" ref="imglist" :isFinish="!listdata.isSave"></photolist>
		<mt-popup v-model="realReadpop" popup-transition="popup-fade">
			<div class="report-pop-msg" style="width: 6rem;padding: 0.6rem 0.2rem;">
				<input class="pop-input" v-focus="popInputType" type="number" placeholder="请输入实际读数" :disabled="!listdata.isSave" v-model="realReadV">
			</div>
			<div class="report-pop-btn" @click="realcomplete">
				<span>完成</span>
			</div>
		</mt-popup>
		<mt-popup v-model="popupVisible" popup-transition="popup-fade">
			<div class="report-pop-msg" style="width: 6rem;padding: 0.6rem 0.2rem;">
				<textarea class="pop-textarea" v-focus="popInputType" placeholder="请输入维修过程描述" :disabled="!listdata.isSave" v-model="textareaV"></textarea>
			</div>
			<div class="report-pop-btn" @click="popcomplete">
				<span>完成</span>
			</div>
		</mt-popup>
		<date-list :datelist="datelist" ref="childdate" @sureSubmit="$emit('sureSubmit')"></date-list>
	</div>
</template>

<script>
	import Photolist from '@/components/assembly/photolist'
	import RoutineList from '@/components/assembly/routineList'
	import dateList from '@/components/assembly/dateList'
	export default{
		props:['listdata','handle','obj','datelist'],
		data(){
			return{
				popuplist:[
					{index:'1',value:'正常'},
					{index:'0',value:'异常'}
				],
				img:'',
				childFinish:false,
				popupVisible:false,
				realReadpop:false,
				textareaV:'',
				realReadV:'',
				pop:false,
				popInputType:false,
				
			}
		},
		components:{ Photolist,RoutineList,dateList},
		methods:{
			isPaging(type){//点击翻页 type为true下一页
				if(type){
					this.handle.page++;
				}else{
					this.handle.page--;
				}
				this.$emit('dataHandle');
				this.$refs.imglist.displayImg(this.listdata.phone.value);
			},
			
			clickResule(val){//选择正常异常
				this.listdata.result.value = val;
				this.obj.results[this.handle.page-1].result = val;
			},
			jumphref(){//描述
				if(!this.listdata.isSave){
					return false;
				}
				this.popInputType = true;
				this.textareaV = this.listdata.aProcedureTxt.value;
				this.popupVisible = !this.popupVisible;
			},
			realPopshow(){//读数
				this.popInputType = true;
				this.realReadV = this.listdata.setValue.value;
				this.realReadpop = !this.realReadpop;
			},
			popcomplete(){//确认描述
				this.popInputType = false;
				this.popupVisible = !this.popupVisible;
				this.listdata.aProcedureTxt.value = this.textareaV;
				this.obj.results[this.handle.page-1].aProcedureTxt = this.textareaV;
			},
			realcomplete(){//确认读数
				this.popInputType = false;
				this.realReadpop = !this.realReadpop;
				this.listdata.setValue.value = this.realReadV;
				this.obj.results[this.handle.page-1].setValue = this.realReadV;
				
			},
			abnormal(){//异常上报
				this.$router.push({
					path:'/abnormallyReport',
					query:{...this.listdata.query}
				})
			},
			startRecognize(text) {//语音录入
				if(plus.os.name=='Android'&&navigator.userAgent.indexOf('StreamApp')>0){
					plus.nativeUI.toast('当前环境暂不支持语音识别插件');
					return;
				}
				var options = {};
				options.engine = 'iFly';
				options.punctuation = false;	// 是否需要标点符号 
				text = "";
				outSet( "开始语音识别：" );
				plus.speech.startRecognize( options, function ( s ) {
					outLine( s );
					text += s;
				}, function ( e ) {
					outSet( "语音识别失败："+e.message );
				} );
			}
			
		},
		directives:{
			focus:function(el,type){
				if(type.value){
					el.focus();
				}else{
					el.blur();
				}
				
			}
		},
		watch:{
			'page.woStateId':{
				deep:true,
				handler(old){
					this.childFinish = old == '03'?true:false;
				}
			},
		},
		mounted(){
// 			if(this.page){
// 				this.childFinish = this.page.woStateId == '03'?true:false;
// 			}
			this.$refs.imglist.displayImg(this.listdata.phone.value);
		},
		activated(){
			this.$refs.imglist.displayImg(this.listdata.phone.value);
		}
	}
</script>

<style>
	.inspectionContent-box{
		width: 100%;
		padding: 0 0.3rem;
		
	}
	.inspectionContent-title{
		font-size: 0.34rem;
		padding: 0.2rem 0.2rem 0.2rem 0.4rem;
		line-height: 0.54rem;
		overflow: hidden;
		height: 0.94rem;
	}
	.inspectionContent-title>span{
		position: relative;
		top: 0.1rem;
	}
	.inspectionContent-tab{
		float: right;
	}
	.inspectionContent-ul{
		padding: 0.2rem 0.3rem;
		border-bottom: 0.02rem solid #DEDEDE;
	}
	.inspectionContent-ul li{
		line-height: 0.56rem;
		font-size: 0.24rem;
		overflow: hidden;
	}
	.inspectionContent-ul li span{
		float: left;
	}
	.inspectionContent-ul li span:first-child{
		text-align: right;
		width: 1.6rem;
	}
	.inspectionContent-ul li span:last-child{
		width: calc(100% - 1.6rem);
	}
	.worklb{
		padding:0 !important;
		
	}
	.worklb .routine-li{
		padding-left: 0.4rem;
	}
	.worklb span{
		font-size: 0.22rem !important;
	}
	.worklb .routine-li>span:last-child{
		max-width: 4rem;
	}
	.pop-textarea{
		width: 100%;
		height: 2.5rem;
		border: 1px solid #ddd;
		padding: 0.2rem;
		outline: none;
		color: #666;
		font-size: 0.3rem;
		resize:none;
	}
	.pop-textarea::-webkit-input-placeholder{
		color: #999;
	}
	.pop-input{
		width: 100%;
		font-size: 0.4rem;
		border: 1px solid #ececec;
		padding: 0.2rem;
		height: 1.5rem;
		outline: none;
		color: #666;
	}
	.inspectionContent-box .v-modal{
		position: absolute;
		top: 0;
	}
	
</style>