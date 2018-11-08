<template>
	<div class="repairlist-box">
		<span class="reqair-list" @click="listevent" :class="{vnew:listdata.vnew,delay:listdata.delay}">
			<span class="left-icon"><i class="iconfont" :class="listdata.icon"></i></span>
			<div class="content-page">
				<p>{{listdata.name}}</p>
				<p>{{listdata.date}}</p>
			</div>
			<div class="content-name">
				<p>{{listdata.equipment1}}</p>
				<p>{{listdata.equipment}}</p>
			</div>
			<div class="right-arr">
				<i class="iconfont icon-add"></i>
				<p>{{listdata.state}}</p>
			</div>
		</span>
		<div class="rep-operation-box" v-if="listdata.operation">
			<span v-for="(list,i) in listdata.operation" :key="i" @click="operationClick(list)">
				<i class="iconfont" :class="operation[list].icon"></i>
				<span>{{operation[list].info}}</span>
			</span>
		</div>
	</div>
	
</template>

<script>
	export default {
		props:['listdata'],
		data(){
			return{
				operation:{
					start:{
						icon:'icon-kaishi',
						info:'开始',
						event:() => {
							this.$router.push('/workInspectlun')
						}
					},
					delay:{
						icon:'icon-yanqi',
						info:'延迟',
						event:() => {
							this.$parent.openPicker();
						}
					},
					complete:{
						icon:'icon-jieshu',
						info:'已完成',
					},
					normal:{
						icon:'icon-zhengchang',
						info:'正常检点',
						event:() => {
							this.$router.push('/workInspect')
						}
					}
				}
			}
		},
		methods:{
			listevent(){
				if(this.listdata.event){
					this.listdata.event(this.listdata)
				}else{
					return false;
				}
				
			},
			operationClick(list){
				if(this.operation[list].event){
					this.operation[list].event(this.listdata)
				}else{
					return false;
				}
			}
		}
	}
</script>

<style>

</style>