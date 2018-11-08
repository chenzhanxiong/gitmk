<template>
  <div class="scan">
  	<div class="row-box">
  		<div id="bcid">
      		
    	</div>
  	</div>
  </div>
</template>

<script>
	let scan = null;
	export default {
		data() {
			return {
				codeUrl: '',
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
						html:'扫描',
					},
					{
						show:true,
						html:'打开灯光',
						id:'turnTheLight'
					}
				],
			}
		},
		methods: {
			//创建扫描控件
			startRecognize() {
				let that = this;
				let styles = {
					frameColor: "#00B294",
					scanbarColor: "#00B294",
					background: "#efefef"
				}
				let filter = [
					plus.barcode.QR,
					plus.barcode.EAN13,
					plus.barcode.EAN8,
					plus.barcode.CODE128,
					plus.barcode.CODE39
				];
				if (!window.plus) return;
				scan = new plus.barcode.Barcode('bcid',filter,styles);
				scan.onmarked = onmarked;
				this.startScan();
				//闪光灯处理
				 var flag = false;  
				document.getElementById("turnTheLight").addEventListener('tap',function(){  
				   if(flag == false){  
					  scan.setFlash(true); 
					  that.headData[2].html = '关闭灯光';
					  flag = true;  
				   }else{  
					 scan.setFlash(false);  
					 that.headData[2].html = '打开灯光';
					 flag = false;  
				   }  
				});  
				//扫描处理
				function onmarked(type, result, file) {
				  switch (type) {
					case plus.barcode.QR:
					  type = 'QR';
					  break;
					case plus.barcode.EAN13:
					  type = 'EAN13';
					  break;
					case plus.barcode.EAN8:
					  type = 'EAN8';
					  break;
					case plus.barcode.CODE39:
						type = 'CODE39';
						break;
					case plus.barcode.CODE128:
						type = 'CODE128';
						break;
					default:
					  type = '其它' + type;
					  break;
				  }
				  result = result.replace(/\n/g, '');
				  that.codeUrl = result;
				  that.closeScan();
				  if(that.$route.query.redirect){
					  that.$router.replace({
						  path:that.$route.query.redirect,
						  query:{id:that.codeUrl,...that.$route.query.type}
					  });
				  }
				  
				}
			},
			//开始扫描
			startScan() {
				if (!window.plus) return;
				scan.start();
			},
			//关闭扫描
			cancelScan() {
				if (!window.plus) return;
				scan.cancel();
			},
			//关闭条码识别控件
			closeScan() {
				if (!window.plus) return;
				scan.close();
			},
		},
		activated(){
			this.$store.commit('showLoading')
			setTimeout(() => {
				this.startRecognize();
				this.$store.commit('hideLoading')
			},1000);
			
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
			mui.back = function(){
				history.go(-1)//回退到上一页面
			}
		}
	}
</script>
<style>
	.scan {
    	height: 100%;
		background:#fff;
    }
	.scan .row-box{
		background:#fff;
	}
    .scan #bcid {
		width: 100%;
		position: absolute;
		top: 1.44rem;
		bottom: 0;
	    text-align: center;
	    color: #fff;
	    background: #fff;
    }
	.scan #turnTheLight{
		display: block;
		width: 0.6rem;
		height: 0.6rem;
		background: #ddd;
		position: absolute;
		z-index: 99999;
		bottom: 30%;
		left: 50%;
		transform: translate(0,-50%);
	}
</style>