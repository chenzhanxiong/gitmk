<template>
	<header @dblclick="$emit('isWindow')">
		<span class="logo" @dblclick.stop @click.stop="$router.replace('/')">
			<img src="../../assets/image/logo.png">
			<h1>设备管理现场终端</h1>
		</span>
		
		<span class="code" @dblclick.stop @click.stop="codeScale = !codeScale">
			<qrcode :class="{active:codeScale}" :value="$store.state.activeEquId" v-if="qrcodeUrl" :options="{ size: 100 }">
			</qrcode>
		</span>
		<div class="head-right">
			<el-tooltip :content="myddy" effect="light">
				<span class="time" :class="{active:dateColor}">{{date}}</span>
			</el-tooltip>
			<el-popover placement="top-start" trigger="click">
				<el-button @click="outLogin" plain size="mini">注销</el-button>
				<el-button @click="close" plain size="mini">退出</el-button>
				<span slot="reference" class="iconfont icon-tuichu"></span>
			</el-popover>
			<el-tooltip v-if="full" content="退出全屏" effect="light">
				<span @click="$emit('isWindow')" @dblclick.stop class="iconfont icon-tuichuquanping"></span>
			</el-tooltip>
			<el-tooltip v-if="!full" content="全屏" effect="light">
				<span @click="$emit('isWindow')" @dblclick.stop class="iconfont icon-quanping"></span>
			</el-tooltip>
		</div>
	</header>
</template>

<script>
	import {formatDate,lunarHtml} from '@/static/date'
	import Qrcode from '@xkeshi/vue-qrcode'
	export default{
		components:{Qrcode},
		props:['full'],
		data(){
			return{
				dateColor:false,//时间整点
				codeScale:false,//二维码放大
				date:formatDate(new Date(),'yyyy-MM-dd hh:mm:ss'),//当前时间
				myddy:lunarHtml(new Date()),//当前农历
				qrcodeUrl:'https://www.baidu.com'//二维码地址
			}
		},
		methods:{
			outLogin(){//退出登录
				this.$store.commit('del_token');
				this.$router.replace('/login');
			},
			close(){//退出程序
				jsObj.CloseWindow();
			}
		},
		mounted(){
			this.timer = setInterval(()=> {
				let D = new Date();
				this.date = formatDate(D,'yyyy-MM-dd hh:mm:ss')//修改数据date
				this.myddy = lunarHtml(new Date());
				if(D.getMinutes() == '0' || D.getMinutes() == '30'){
					if(D.getSeconds() == '0'){
						let h = D.getHours();
						if(h/12 > 1){
							if(h > 12 && h <= 18){
								h = '下午'+(h%12)
							}
							if(h > 18 && h < 24){
								h = '晚上'+(h%12)
							}
						}else{
							if(h >= 0 && h < 6){
								h = '凌晨'+h;
							}
							if(h >= 6 && h < 12){
								h = '上午'+h;
							}
							if(h == 12){
								h = '中午'+h;
							}
						}
						if(D.getMinutes() == '0'){
							new Audio(
							'http://tts.baidu.com/text2audio?cuid=baiduid&lan=zh&ctp=1&pdt=311&tex=现在是，北京时间，'+h+'点整'
							).play();
						}
						if(D.getMinutes() == '30'){
							new Audio(
							'http://tts.baidu.com/text2audio?cuid=baiduid&lan=zh&ctp=1&pdt=311&tex=现在是，北京时间，'+h+'点30分'
							).play();
						}
					}
					this.dateColor = true;
				}else{
					this.dateColor = false;
				}
			}, 1000);
			
		},
		beforeDestroy(){
			if(this.timer){
				clearInterval(this.timer)
			}
			document.onkeydown = null;
		}
	}
</script>

<style>
	header{
		width: 100%;
		height: 1.08rem;
		background: #00b393;
		padding: 0 0.5rem;
		position: absolute;
		top: 0;
		z-index: 1;
		-moz-user-select: none;
		-khtml-user-select: none;
		user-select: none;
	}
	.logo{
		float: left;
		height: 100%;
		line-height: 1.08rem;
		cursor: pointer;
	}
	.logo:before{
		content: '';
		display: inline-block;
		width: 0;
		height: 100%;
		vertical-align: middle;
	}
	.logo img{
		height: 0.6rem;
		display: inline-block;
		vertical-align: middle;
	}
	header h1{
		vertical-align: middle;
		display: inline-block;
		font-size: 0.44rem;
		color: #fff;
	}
	header .head-right{
		float: right;
		height: 100%;
	}
	header .head-right span{
		color: #fff;
		float: left;
		position: relative;
		top: 50%;
		margin-left: 0.15rem;
	}
	header .head-right span.iconfont{
		font-size: 0.25rem;
		cursor: pointer;
	}
	header .time.active{
		color: yellow;
		font-size: 0.3rem;
		text-shadow: 0 0 0.1rem orangered;
	}
	header .code{
		float: left;
		margin-top: 0.2rem;
		overflow: hidden;
		cursor: pointer;
		margin-left: 0.2rem;
	}
	header .code canvas{
		display: block;
		width: 0.7rem;
		height: 0.7rem;
		transition: all 200ms;
	}
	header .code canvas.active{
		width: 1.35rem;
		height: 1.35rem;
	}
</style>