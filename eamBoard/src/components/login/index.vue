<template>
	<div class="login-box" v-loading="loginLoading">
		<div class="login-item" @keyup.enter="loginclick">
			<div class="login-title">
				<img src="../../assets/image/logo.png">
				<span>设备管理现场终端</span>
			</div>
			<ul>
				<li>
					<i class="iconfont icon-yonghu"></i>
					<input type="text" v-model="logindata.loginName" placeholder="请输入用户名"/>
				</li>
				<li>
					<i class="iconfont icon-mima"></i>
					<input type="password" v-model="logindata.password" placeholder="请输入密码"/>
				</li>
				<li class="captcha" v-if="captchaShow">
					<i class="iconfont icon-yanzhengma"></i>
					<input type="text" v-model="logindata.captcha" placeholder="请输入验证码"/>
					<img @click="getCaptcha" :src="'data:image/jpeg;base64,'+verificationSrc"/>
				</li>
			</ul>
			<button class="login-button" @click="loginclick" :disabled="loginLoading">登录</button>
		</div>
		<span class="login-edit" @click="editIP">
			<i class="iconfont icon-shezhi"></i>
		</span>
		<el-dialog
		  title="编辑访问信息"
		  :visible.sync="dialogVisible"
		  width="40%"
		  >
		  <el-form :model="devhost">
			<el-form-item label="IP地址" :label-width="formLabelWidth">
			  <el-input v-model="devhost.host" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="登录端口号" :label-width="formLabelWidth">
				<el-input v-model="devhost.loginPort" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="照片端口号" :label-width="formLabelWidth">
				<el-input v-model="devhost.photoPort" autocomplete="off"></el-input>
			</el-form-item>
			<el-form-item label="主端口号" :label-width="formLabelWidth">
				<el-input v-model="devhost.serPort" autocomplete="off"></el-input>
			</el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
			<el-button type="primary" @click="devHostClick">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				formLabelWidth:'1.5rem',
				loginLoading:false,
				dialogVisible:false,
				captchaShow:false,
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
				if(this.logindata.loginName == ""){
					this.$message.error('账号不能为空');
					return false;
				}
				if(this.logindata.password == ""){
					this.$message.error('密码不能为空');
					return false;
				}
				if(this.captchaShow && this.logindata.captcha == ''){
					this.$message.error('验证不能为空');
					return false;
				}
				this.sysvalidate();
			},
			sysvalidate(){
				this.loginLoading = true;
				this.logindata.password = this.$md5(this.logindata.password);
				this.$axios.post(this.devhost.host+':'+this.devhost.loginPort+'/skydev/api/user/sysvalidate',JSON.stringify(this.logindata)).then((res) => {
					const data = res.data;
					this.loginLoading = false;
					this.errorCode = data.errorCode;
					if(data.result){
						let value = JSON.stringify({token:data.others[0].value,eam_curTime:new Date().getTime()})
						this.$store.commit('set_token', value);
						if (this.$store.state.token) {
							this.$message({
							  message: '登录成功！',
							  type: 'success'
							});
							this.$router.replace(this.$route.query.redirect || '/');
						} else {
							this.$router.replace('/login');
						}
					}else{
						this.logindata.password = '';
						this.capToken = '';
						this.logindata.captcha = '';
						this.captchaShow = true;
						this.getCaptcha();
						this.$alert(data.errorMsg,'提示')
					}
				}).catch((error) => {
					this.loginLoading = false;
				})
			},
			getCaptcha(){
				this.$axios.get(this.devhost.host+':'+this.devhost.loginPort+'/skydev/api/kaptcha').then((res) => {
					const data = res.data;
					if(data.result){
						this.verificationSrc = data.others[0].value;
						this.capToken = data.others[1].value;
						this.logindata.extendField = this.capToken;
					}
				}).catch((reeor) => {
					this.loginLoading = false;
					this.logindata.password = '';
					this.$MessageBox('提示','网络错误');
				})
			},
			editIP(){
				this.devhost.host = this.$store.state.devHost;
				this.devhost.loginPort = this.$store.state.loginPort;
				this.devhost.photoPort = this.$store.state.photoPort;
				this.devhost.serPort = this.$store.state.serPort;
				this.dialogVisible = !this.dialogVisible;
			},
			devHostClick(){
				this.$store.state.devHost = this.devhost.host;
				this.$store.state.loginPort = this.devhost.loginPort;
				this.$store.state.photoPort = this.devhost.photoPort;
				this.$store.state.serPort = this.devhost.serPort;
				localStorage.setItem('DEVHOST',JSON.stringify(this.devhost));
				this.$root.URL = this.devhost.host+':'+this.devhost.serPort+'/';
				this.dialogVisible = !this.dialogVisible;
			},
			handleClose(){
				
			}
		},
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
		transform: translate(-50%,-60%);
	}
	.login-title{
		text-align: center;
		font-size: 0.4rem;
		line-height: 0.72rem;
		font-weight: bold;
		height: 0.72rem;
		color: #fff;
	}
	.login-title:before{
		content: '';
		display: inline-block;
		width: 0;
		height: 100%;
		vertical-align: middle;
	}
	.login-title img{
		height: 0.6rem;
		display: inline-block;
		vertical-align: middle;
	}
	.login-title span{
		display: inline-block;
		vertical-align: middle;
	}
	.login-box .login-item>ul{
		width: 6rem;
		margin: 0.4rem auto;
	}
	.login-box .login-item>ul li{
		margin-bottom: 0.5rem;
		position: relative;
	}
	.login-box li input{
		width: 100%;
		height: 0.9rem;
		border: 2px solid #FFFFFF;
		border-radius: 0.08rem;
		font-size: 0.32rem;
		padding-left: 0.78rem;
		padding-right: 0.2rem;
		color: #fff;
		display: block;
		background-color: rgba(0,0,0,0);
		outline: none;
	}
	.login-box li input::-webkit-input-placeholder{
		color: #f2f2f2;
	}
	.login-box li.captcha input{
		width: 4rem;
	}
	.login-box li.captcha img{
		position: absolute;
		right: 0;
		top: 0;
		width: 1.8rem;
		height: 100%;
	}
	.login-box li i{
		display: block;
		position: absolute;
		left: 0.17rem;
		top: 50%;
		transform: translate(0,-50%);
		font-size: 0.5rem;
		color: #fff;
	}
	.login-box .login-button{
		color: #00b294;
		background: #fff;
		display: block;
		margin: 0.5rem auto 0;
		text-align: center;
		border: none;
		border-radius: 0.08rem;
		width: 6rem;
		height: 0.9rem;
		font-size: 0.36rem;
		outline: none;
		cursor: pointer;
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
		cursor: pointer;
	}
	.login-edit i{
		font-size: 0.5rem;
	}
</style>