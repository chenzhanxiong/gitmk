<template>
	<div class="describe-box row-box">
		<div class="describe-textarea">
			<textarea v-model="listvalue" :placeholder="textarea.placeholder"></textarea>
		</div>
	</div>
	
</template>

<script>
	import {mapState} from 'vuex'
	export default{
		data(){
			let abnorData = this.$store.state.abnorData;
			return{
				isconfirm:false,
				headData:[
					{
						show:true,
						icon:'icon-fanhui',
						event:() => {
							this.isconfirm = false;
							this.$router.back(-1)
						}
					},
					{
						show:true,
						input:false,
						html:''
					},
					{
						show:true,
						html:'保存',
						event:() => {
							this.isconfirm = true;
							this.$route.params.list[this.$route.params.that] = this.listvalue;
							this.$router.back(-1)
						}
					}
				],
				listvalue:this.$route.params.list[this.$route.params.that]
			}
		},
		methods:{
			preservation(){
				this.$router.push({
					name:this.$route.params.redirect,
					params:{list:this.listvalue}
				})
			}
		},
		computed:{
			...mapState({
				textarea:state => state.abnorData.textarea
			})
		},
		watch:{
			
		},
		beforeRouteLeave(to,from,next){
			to.params.list = this.$route.params.list
			next();
		},
		activated(){
			this.isconfirm =false;
			this.headData[1].html = this.$route.params.name;
			this.listvalue = this.$route.params.list[this.$route.params.that];
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
			mui.back = function(){
				history.go(-1)//回退到上一页面
			}
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