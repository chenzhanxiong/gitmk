<template>
	<div class="describe-box">
		<div class="describe-textarea">
			<textarea v-model="model" placeholder="请输入异常描述"></textarea>
		</div>
	</div>
	
</template>

<script>
	import {mapMutations,mapGetters} from 'vuex';
	export default{
		data(){
			let abnorData = this.$store.state.abnorData;
			return{
				model:abnorData.abnorReport[abnorData.parameters.parameterName],
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
						html:abnorData.parameters.name
					},
					{
						show:true,
						html:'保存',
						event:() => {
							this.$store.commit('gengxin',[abnorData.parameters.parameterName,this.model])
							//this.$store.state.abnorReport[this.$store.state.parameters.parameterName] = this.model;
							this.$router.back(-1);
						}
					}
				],
			}
		},
		computed:{
			...mapGetters(['getAbnorReport']),
		},
		watch:{
			getAbnorReport(old) {
				this.$store.commit('judgeinfo');
			},
		},
		mounted(){
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
		}
	}
</script>

<style>
	.describe-box{
		width: 100%;
	}
	.describe-box .describe-textarea{
		width: 100%;
	}
	.describe-box .describe-textarea textarea{
		width: 100%;
		border: none;
		outline: none;
		height: 2.54rem;
		border-bottom: 1px solid #DEDEDE;
		padding: 0.2rem;
		font-size: 0.26rem;
		color: #666;
	}
	.describe-box .describe-textarea textarea::-webkit-input-placeholder{
		color: #999;
	}
</style>