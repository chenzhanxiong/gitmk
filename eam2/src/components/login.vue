<template>
	<div class="login-box">
		<h1 v-html="$store.state.title"></h1>
		<ul>
			<li>
				<i class="iconfont icon-yonghu"></i>
				<input type="text" v-model="logindata.loginName" placeholder="请输入用户名"/>
			</li>
			<li>
				<i class="iconfont icon-mima"></i>
				<input type="password" v-model="logindata.password" placeholder="请输入密码"/>
			</li>
		</ul>
		<button @click="loginclick" :disabled="loading">登陆</button>
		<mt-popup v-model="popupVisible" popup-transition="popup-fade">
		  	<div class="report-pop-msg login-pop">
		  		<input type="text" v-model="logindata.captcha" placeholder="请输入验证码"/>
		  		<img @click="getCaptcha" :src="'data:image/jpeg;base64,'+verificationSrc"/>
		  	</div>
		  	<div class="report-pop-btn" @click="popcomplete">
		  		<span>完成</span>
		  	</div>
		</mt-popup>
		
		<loading v-if="loading"></loading>
	</div>
</template>

<script>
	import loading from '@/components/assembly/loading'
	export default{
		components:{loading},
		data(){
			return{
				loading:false,
				popupVisible:false,
				errorCode:'',
				logindata:{
					loginName:'',
					password:'',
					captcha:''
				},
				verificationSrc:'',
				capToken:''
			}
		},
		methods:{
			loginclick(){
				if(this.logindata.loginName == "" && !this.popupVisible){
					this.$MessageBox('提示','账号不能为空！');
					return false;
				}
				if(this.logindata.password == "" && !this.popupVisible){
					this.$MessageBox('提示','密码不能为空！');
					return false;
				}
				if((this.errorCode == 'login-004' || this.errorCode == 'login-005') && this.capToken == ''){
					this.popupVisible = true;
					this.getCaptcha();
					return false;
				}
				this.sysvalidate();
			},
			sysvalidate(){
				this.$store.commit('showLoading')
				this.logindata.password = this.$md5(this.logindata.password);
				this.$axios.post('http://192.168.1.171:8021/skydev/api/user/sysvalidate',JSON.stringify(this.logindata)).then((res) => {
					const data = res.data;
					this.$store.commit('hideLoading')
					this.errorCode = data.errorCode;
					if(data.result){
						this.$store.commit('set_token', data.others[0].value);
						if (this.$store.state.token) {
							this.$Toast({message:'登录成功！',position:'bottom'})
							this.$router.push(this.$route.query.redirect || '/');
						} else {
							this.$router.replace('/login');
						}
					}else{
						this.logindata.password = '';
						this.capToken = '';
						this.logindata.captcha = '';
						this.$MessageBox('提示',data.errorMsg);
					}
				}).catch((error) => {
					this.$store.commit('hideLoading')
					this.$MessageBox('提示','网络错误');
				})
			},
			getCaptcha(){
				this.$axios.get('http://192.168.1.171:8021/skydev/api/kaptcha').then((res) => {
					const data = res.data;
					if(data.result){
						this.verificationSrc = data.others[0].value;
						this.capToken = data.others[1].value;
					}
					console.log(data)
				}).catch((reeor) => {
					this.loading = false;
					this.logindata.password = '';
					this.$MessageBox('提示','网络错误');
				})
			},
			popcomplete(){
				this.logindata.extendField = this.capToken;
				this.popupVisible = false;
				//this.sysvalidate();
			}
		},
		mounted(){
		}
	}
</script>

<style>
	.login-box{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #00b294;
	}
	.login-box h1{
		font-size: 0.36rem;
		color: #fff;
		text-align: center;
		font-weight: normal;
		line-height: 0.36rem;
		margin-top: 1.56rem;
	}
	.login-box ul{
		margin-top: 0.92rem;
		padding: 0 0.4rem;
	}
	.login-box ul li{
		margin: 0 auto 0.5rem;
		position: relative;
	}
	.login-box li input{
		width: 100%;
		height: 1.02rem;
		border: 1px solid #FFFFFF;
		border-radius: 0.08rem;
		font-size: 0.3rem;
		padding-left: 1.1rem;
		color: #fff;
		margin: 0 auto;
		display: block;
		background-color: rgba(0,0,0,0);
		outline: none;
	}
	.login-box li input::-webkit-input-placeholder{
		color: #f2f2f2;
	}
	.login-box li i{
		display: block;
		position: absolute;
		left: 0.3rem;
		top: 50%;
		transform: translate(0,-50%);
		font-size: 0.5rem;
		color: #fff;
	}
	.login-box button{
		color: #00b294;
		background: #fff;
		display: block;
		margin: 0.38rem auto 0;
		text-align: center;
		border: none;
		border-radius: 0.08rem;
		width: 6.4rem;
		height: 1rem;
		font-size: 0.36rem;
		outline: none;
	}
	.login-pop{
		overflow: hidden;
		width: 6rem;
	}
	.login-pop input{
		float: left;
		font-size: 0.28rem;
		line-height: 0.36rem;
		padding: 0.175rem 0.2rem;
		border:0.01rem solid #dedede;
		outline: none;
		width: 3rem;
	}
	.login-pop img{
		float: left;
		width: 1.8rem;
		height: 0.7rem;
	}
</style>