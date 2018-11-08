<template>
	<div class="camera-box">
	</div>
</template>

<script>
	export default{
		data(){
			return{
				imgSrc:'',
			}
		},
		methods:{
			  captureImage(){
			  	let This=this
				var cmr = plus.camera.getCamera();//获取摄像头管理对象
				var res = cmr.supportedImageResolutions[0];//字符串数组，摄像头支持的拍照分辨率
				var fmt = cmr.supportedImageFormats[0];//字符串数组，摄像头支持的拍照文件格式
				cmr.captureImage(( path ) => {//进行拍照操作
					// 通过URL参数获取目录对象或文件对象
					plus.io.resolveLocalFileSystemURL(path, function(entry) {
						var tmpPath= entry.toLocalURL();//获取目录路径转换为本地路径URL地址
						This.convertImgToBase64(tmpPath,function(url){
							This.$store.state.imgSrc=url;
							This.$store.commit('showLoading');
							This.$router.replace({
								replace: true,
								path:'/photocom',
								query:{...This.$route.query}
							});
						})
					})
				},( error ) => {//捕获图像失败回调
					This.$router.back(-1);
			   	},{resolution:res,format:fmt});
			},
			convertImgToBase64(url, callback, outputFormat){
				var canvas = document.createElement('CANVAS');
				var ctx = canvas.getContext('2d');
    				var img = new Image();
    				img.crossOrigin = 'Anonymous';
				img.onload = function(){
					var width = img.width;
					var height = img.height;
					var rate = (width < height ? width / height : height / width) / 3;
					canvas.width = width * rate;
					canvas.height = height * rate;
					ctx.drawImage(img, 0, 0, width, height, 0, 0, width * rate, height * rate);
					var dataURL = canvas.toDataURL(outputFormat || 'image/png');
					callback.call(this, dataURL);
					canvas = null;
				}
				img.src = url;
			}
		},
		beforeRouteEnter(to,from,next){
			next(vm => {
				if(from.meta.index < to.meta.index){
					if(window.plus){
						vm.captureImage();
					}else{
						document.addEventListener('plusready', vm.captureImage, false);
					}
// 					vm.$router.replace({
// 						path:'/photocom',
// 						query:{...vm.$route.query}
// 					});
				}
			})
		},
		activated(){
			this.$store.state.heads.show = false;

			mui.back = function(){
				history.go(-1)//回退到上一页面
			}
			
		}
	}
</script>

<style>
	.camera-box{
		width: 100%;
	}
</style>