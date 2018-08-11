<template>
	<div class="inspectionContent-box">
		<div class="inspectionContent-title">
			<span>{{listdata.title}}内容:</span>
			<span>{{listdata.page}}/{{listdata.total}}</span>
			<div class="inspectionContent-tab">
				<button class="list-submit-m" :disabled="listdata.page == 1" @click="prev">上一条</button>
				<button class="list-submit-m" :disabled="listdata.page == listdata.total" @click="next">下一条</button>
			</div>
		</div>
		<ul class="inspectionContent-ul">
			<li v-for="(list,i) in listdata.inspection.arr" :key="i">
				<span>{{list.name}}：</span>
				<span>{{list.value}}</span>
			</li>
		</ul>
		<ul class="inspectionContent-in">
			<li v-if="listdata.inspection.realRead">
				<span>{{listdata.inspection.realRead.name}}</span>
				<input class="inspectionContent-type" type="text" v-model="listdata.inspection.realRead.value"/>
			</li>
			<li>
				<span>{{listdata.inspection.exeResult.name}}</span>
				<span @click="popupVisible = !popupVisible" class="inspectionContent-type exeResult">{{listdata.inspection.exeResult.value}}</span>
				<button class="list-submit-m" @click="$router.push('/abnormallyReport')">异常上报</button>
			</li>
		</ul>
		<photolist style="padding: 0 0.2rem;" :listdata="img"></photolist>
		<mt-popup v-model="popupVisible" popup-transition="popup-fade">
		  	<div class="report-pop-msg">
		  		<span class="radio-list" v-for="(list,i) in popuplist" :key="i" @click="listdata.inspection.exeResult.value = list;popupVisible = !popupVisible"><i class="radious" :class="{active:listdata.inspection.exeResult.value == list}"></i>{{list}}</span>
		  	</div>
		</mt-popup>
	</div>
</template>

<script>
	import Photolist from '@/components/assembly/photolist'
	export default{
		props:['listdata'],
		data(){
			return{
				popupVisible:false,
				popuplist:['正常','不正常'],
				img:'',
			}
		},
		components:{ Photolist },
		methods:{
			next(){
				let num = this.$store.state.worklistData.num;
				let standardList = this.$store.state.worklistData.worklistHandle[num].standardList;
				standardList[this.listdata.page-1].realRead = this.listdata.inspection.realRead.value;
				standardList[this.listdata.page-1].exeResult = this.listdata.inspection.exeResult.value;
				this.listdata.page++;
				let d = standardList[this.listdata.page-1];
				this.listdata.inspection = this.$parent.$parent.$parent.$parent.dataHandle(d);
				
			},
			prev(){
				let num = this.$store.state.worklistData.num;
				let standardList = this.$store.state.worklistData.worklistHandle[num].standardList;
				standardList[this.listdata.page-1].realRead = this.listdata.inspection.realRead.value;
				standardList[this.listdata.page-1].exeResult = this.listdata.inspection.exeResult.value;
				this.listdata.page--;
				let d = this.$store.state.worklistData.worklistHandle[num].standardList[this.listdata.page-1];
				this.listdata.inspection = this.$parent.$parent.$parent.$parent.dataHandle(d)
			}
		},
		mounted(){
			//console.log(this.$emit('dataHandle'))
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
		border-bottom: 0.01rem solid #DEDEDE;
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
	.inspectionContent-in{
		width: 100%;
		padding: 0.28rem 0.38rem 0;
	}
	.inspectionContent-in>li{
		line-height: 0.5rem;
		height: 0.5rem;
		margin-bottom: 0.32rem;
		overflow: hidden;
	}
	.inspectionContent-in>li>span{
		display: block;
		float: left;
		width: 25%;
		text-align: center;
	}
	.inspectionContent-in .inspectionContent-type{
		float: left;
		height: 0.5rem;
		border: 1px solid #DEDEDE;
		outline: none;
		width: 75%;
		padding: 0 0.2rem;
	}
	.inspectionContent-in .inspectionContent-type.exeResult{
		width:-webkit-calc(75% - 1.22rem);
		text-align: left;
	}
	.inspectionContent-in .list-submit-m{
		float: right;
	}
</style>