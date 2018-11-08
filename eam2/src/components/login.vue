<template>
	<div class="login-box">
		<div class="login-item">
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
			<button @click="loginclick" :disabled="loading">登录</button>
		</div>
		<span class="login-edit" @click="editIP">
			<i class="iconfont icon-shezhi"></i>
		</span>
		<mt-popup v-model="popupVisible" popup-transition="popup-fade">
		  	<div class="report-pop-msg login-pop">
		  		<input type="text" v-model="logindata.captcha" placeholder="请输入验证码"/>
		  		<img @click="getCaptcha" :src="'data:image/jpeg;base64,'+verificationSrc"/>
		  	</div>
		  	<div class="report-pop-btn" @click="popcomplete">
		  		<span>完成</span>
		  	</div>
		</mt-popup>
		<mt-popup v-model="popupVisible1" popup-transition="popup-fade">
			<div class="report-pop-msg">
				<ul class="login-pop-input">
					<li>
						<span>IP地址：</span>
						<input type="text" v-model="devhost.host"/>
					</li>
					<li>
						<span>登录端口：</span>
						<input type="text" v-model="devhost.loginPort" />
					</li>
					<li>
						<span>照片端口：</span>
						<input type="text" v-model="devhost.photoPort" />
					</li>
					<li>
						<span>主服务端口：</span>
						<input type="text" v-model="devhost.serPort" />
					</li>
				</ul>
				
			</div>
			<div class="report-pop-btn" @click="devHostClick">
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
				popupVisible1:false,
				errorCode:'',
				logindata:{
					loginName:'',
					password:'',
					captcha:'',
				},
				verificationSrc:'',
				capToken:'',
				devhost:{
					host:this.$store.state.devHost,
					loginPort:this.$store.state.loginPort,
					photoPort:this.$store.state.photoPort,
					serPort:this.$store.state.serPort
				},
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
				this.loading = true;
				this.logindata.password = this.$md5(this.logindata.password);
				this.$axios.post(this.devhost.host+':'+this.devhost.loginPort+'/skydev/api/user/sysvalidate',JSON.stringify(this.logindata)).then((res) => {
					const data = res.data;
					this.loading = false;
					this.errorCode = data.errorCode;
					if(data.result){
						let value = JSON.stringify({token:data.others[0].value,eam_curTime:new Date().getTime()})
						this.$store.commit('set_token', value);
						if (this.$store.state.token) {
							this.$Toast({message:'登录成功',position:'bottom'})
							this.$router.replace(this.$route.query.redirect || '/');
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
					this.loading = false;
				})
			},
			getCaptcha(){
				this.$axios.get(this.devhost.host+':'+this.devhost.loginPort+'/skydev/api/kaptcha').then((res) => {
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
			},
			editIP(){
				this.devhost.host = this.$store.state.devHost;
				this.devhost.loginPort = this.$store.state.loginPort;
				this.devhost.photoPort = this.$store.state.photoPort;
				this.devhost.serPort = this.$store.state.serPort;
				this.popupVisible1 = !this.popupVisible1;
			},
			devHostClick(){
				this.$store.state.devHost = this.devhost.host;
				this.$store.state.loginPort = this.devhost.loginPort;
				this.$store.state.photoPort = this.devhost.photoPort;
				this.$store.state.serPort = this.devhost.serPort;
				localStorage.setItem('DEVHOST',JSON.stringify(this.devhost));
				this.$root.URL = this.devhost.host+':'+this.devhost.serPort+'/';
				this.popupVisible1 = !this.popupVisible1;
			}
		},
		activated(){
			this.$store.state.heads.show = false;
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
	.login-item{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-70%);
	}
	.login-box .login-item h1{
		font-size: 0.36rem;
		color: #fff;
		text-align: center;
		font-weight: normal;
		line-height: 0.36rem;
	}
	.login-box .login-item>ul{
		margin-top: 0.92rem;
	}
	.login-box .login-item>ul li{
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
		padding-right: 0.2rem;
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
	.login-box .login-item button{
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
	.login-box .loading-box{
		top: 0;
	}
	.login-edit{
		position: absolute;
		bottom: 0.3rem;
		right: 0.3rem;
		display: block;
		width: 0.8rem;
		height: 0.8rem;
		border-radius: 50%;
		background: #038B72;
		color: #fff;
		line-height: 0.8rem;
		text-align: center;
	}
	.login-edit i{
		font-size: 0.5rem;
	}
	.login-pop-input li{
		overflow: hidden;
		width: 5rem;
		display: flex;
		padding: 0.2rem 0;
	}
	.login-pop-input li span{
		width: 1.5rem;
		line-height: 0.5rem;
		text-align: right;
	}
	.login-pop-input li input{
		flex: 1;
		border: 1px solid #dedede;
		height: 0;
		width: 2rem;
		padding: 0.2rem;
		color: #666;
		font-size: 0.26rem;
	}
</style>