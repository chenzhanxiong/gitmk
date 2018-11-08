<template>
	<div class="photocom-box row-box">
		<div class="canvas-box" id="canvasBox">
			<div id="canvasDiv">
				<canvas id="canvas" width="" height=""></canvas>
			</div>
		</div>
		<div class="select-option">
			<div class="option-color">
				<span v-for="(list,i) in optionColor" :class="{active:activeColor == list}" @click="initDraw(list)" :key="i" :style="'borderColor:'+list+''"></span>
			</div>
			<div class="legend-box">
				<span :class="{active:activeColor == list}" v-for="(list,i) in optionimg" :key="i" @click="initDraw(list)">
					<img :src="list.src" :alt="list.name" />
					<p>{{list.name}}</p>
				</span>
			</div>
			<div class="revokeor">
				<span @click="clear"><i class="iconfont icon-chexiao"></i></span>
				<!-- <span @click="save"><i class="iconfont icon-zhongzuo"></i></span> -->
			</div>
		</div>
		<div class="photocom-footer">
			<span class="active">
				<i class="iconfont icon-geomark-icon"></i>
				<p>标注</p>
			</span>
			<span @click="relation">
				<i class="iconfont icon-saomiao"></i>
				<p>关联</p>
			</span>
		</div>
	</div>
</template>

<script>
	var preHandler = function(e){e.preventDefault();}
	class Draw {
	    constructor(el) {
	        this.el = el;
	        this.lineL = [];
	        this.line = [];
	        this.color = '';
			this.item = [];
	        this.canvas = document.getElementById(this.el)
	        this.cxt = this.canvas.getContext('2d')
	        this.stage_info = this.canvas.getBoundingClientRect();
	        this.path = {
	            beginX: 0,
	            beginY: 0,
	            endX: 0,
	            endY: 0
	        },
			this.ratio = this.getPixelRatio(this.cxt);
	    }
	    init() {
			this.color = null;
	        let that = this;
	        this.canvas.addEventListener('touchstart', function(event) {
	            document.addEventListener('touchstart', preHandler, { passive: false });
				if(that.color == null){
					canvas.removeEventListener('touchmove',that.drawing);
					return false
				};
	            if(typeof that.color === 'string'){
	            	that.drawBegin(event,that.color)
	            }else{
					that.cxt.beginPath();
					canvas.removeEventListener('touchmove',that.drawing);
					that.drawImg(event,that.color);
	            }
	        })
	        this.canvas.addEventListener('touchend', function(event) { 
	            document.addEventListener('touchend', preHandler, { passive: false }); 
	            that.drawEnd()
	        })
	        //this.clear()
		}
		getPixelRatio(context) {
			let backingStore = context.backingStorePixelRatio ||
					context.webkitBackingStorePixelRatio ||
					context.mozBackingStorePixelRatio ||
					context.msBackingStorePixelRatio ||
					context.oBackingStorePixelRatio ||
					context.backingStorePixelRatio || 1;
			return (window.devicePixelRatio || 1) / backingStore;
		}
		drawImg(e,url){
			let size = document.getElementsByTagName('html')[0].style.fontSize;
			let that = this;
			let imgs = new Image();
			imgs.src = url.src;
			let x = e.changedTouches[0].clientX - that.stage_info.left - 25;
			let y= e.changedTouches[0].clientY - that.stage_info.top - 25;
			imgs.onload = function(){
				this.width = 30;
				this.height = 30;
				that.cxt.drawImage(this,x*that.ratio,y*that.ratio,50*that.ratio,50*that.ratio)
				that.item.push(url.name);
			}
	    }
	    drawBegin(e,color) {
			let size = document.getElementsByTagName('html')[0].style.fontSize;
	        let that = this;
	        window.getSelection() ? window.getSelection().removeAllRanges() : document.selection.empty()
	        this.cxt.strokeStyle = color;
	        this.cxt.lineWidth = 4*this.ratio;
	        this.cxt.beginPath()
	        this.cxt.moveTo(
	            (e.changedTouches[0].clientX - this.stage_info.left)*this.ratio,
	            (e.changedTouches[0].clientY - this.stage_info.top)*this.ratio
	        )
	        this.path.beginX = (e.changedTouches[0].clientX - this.stage_info.left)*this.ratio
	        this.path.beginY = (e.changedTouches[0].clientY - this.stage_info.top)*this.ratio
	        	canvas.addEventListener("touchmove",that.drawing,false)
	    }
	    drawing = function(e) {
	        this.cxt.lineTo(
	            (e.changedTouches[0].clientX - this.stage_info.left)*this.ratio,
	            (e.changedTouches[0].clientY - this.stage_info.top)*this.ratio
	        )
	        this.path.endX =  (e.changedTouches[0].clientX - this.stage_info.left)*this.ratio
	        this.path.endY = (e.changedTouches[0].clientY - this.stage_info.top)*this.ratio
	        this.cxt.stroke();
	    }.bind(this)
	    drawEnd() {
	        document.removeEventListener('touchstart', preHandler, { passive: false }); 
	        document.removeEventListener('touchend', preHandler, { passive: false });
	        document.removeEventListener('touchmove', preHandler, { passive: false });
	        canvas.ontouchmove = canvas.ontouchend = null
	    }
	    clear() {
			this.item = [];
	    	this.cxt.clearRect(0,0,canvas.width,canvas.height);
	    }
	    save(){
			this.color = null;
			return {
				url:canvas.toDataURL("image/jpeg"),
				item:this.item
			}
	    }
	}
	export default{
		data(){
			return{
				isSub:false,
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
						html:'照片处理'
					},
					{
						show:true,
						html:'保存',
						event:()=>{
							this.save();
							this.fileUpload();
						}
					}
				],
				optionimg:[
					{src:'static/images/leaking.png',name:'漏油'},
					{src:'static/images/damage.png',name:'损坏'}
				],
				optionColor:['#e5620a','#feff00','#21ae37','#00b9ef','#930882','#000000','#db3472','#a4292a','#ffffff'],
				activeColor:'',
				draw:null,
				url:'',
				item:[]
			}
		},
		methods:{
			getPixelRatio(context) {
				let backingStore = context.backingStorePixelRatio ||
						context.webkitBackingStorePixelRatio ||
						context.mozBackingStorePixelRatio ||
						context.msBackingStorePixelRatio ||
						context.oBackingStorePixelRatio ||
						context.backingStorePixelRatio || 1;
				return (window.devicePixelRatio || 1) / backingStore;
			},
			setCanvasinfo(){
				let box = document.getElementById("canvasBox");
				let page = document.getElementById("canvasDiv");
				let c = document.getElementById("canvas");
				let cxt = c.getContext('2d');
				let ratio = this.getPixelRatio(cxt);
				let imgs = new Image();
				imgs.src = this.$store.state.imgSrc;
				imgs.onload = function(){
					let rote = box.clientWidth/imgs.width;
					let width = imgs.width * rote;
					let height = imgs.height * rote;
					c.width = width*ratio;
					c.height = height*ratio;
					c.style.width = width+ 'px';
					c.style.height = height+ 'px';
					page.width = width + 'px';
					page.height = height + 'px';
					cxt.drawImage(this,0,0,width*ratio,height*ratio);
					
				}
				//c.style.backgroundImage = 'url('+this.$store.state.imgSrc+')';
				
			},
			clear(){
				this.draw.clear();
				this.setCanvasinfo();
			},
			save(){
				this.activeColor = null;
				var data = this.draw.save().url;
				this.url = data;
				this.item = [...new Set(this.draw.save().item)];
			},
			initDraw(list){
				this.activeColor = list;
				this.draw.init();
				this.draw.color = this.activeColor;
				this.$store.commit('hideLoading')
			},
			fileUpload(){//图片上传服务器
				this.$store.commit('showLoading')
				this.$axios.post(this.$store.state.devHost+':'+this.$store.state.photoPort+'/skydev/api/file/upload/base64?ft=photo&dp=eom/photo',{
					body:this.url
				}).then((res) => {
					this.$store.commit('hideLoading')
					let d = res.data;
					if(!d.result){
						this.$Toast({message:'保存成功!'});
						if(this.$route.query.imgBindId == 'abnImgId'){
							this.$store.state.abnImgId.push({
								fafbOutKey:d.others[0].value,
								path:'eom/photo/'+d.others[1].value,
								imgItem:this.item.join(",")
							})
							this.$router.go(-1)
							return false;
						}
						if(this.$store.state.imgBindId[this.$route.query.imgBindId]){
							this.$store.state.imgBindId[this.$route.query.imgBindId].push({
								imgBindKey:this.$route.query.imgBindId,
								fafbOutKey:d.others[0].value,
								path:'eom/photo/'+d.others[1].value,
								imgItem:this.item.join(",")
							});
						}else{
							this.$store.state.imgBindId[this.$route.query.imgBindId] = [];
							this.$store.state.imgBindId[this.$route.query.imgBindId].push({
								imgBindKey:this.$route.query.imgBindId,
								fafbOutKey:d.others[0].value,
								path:'eom/photo/'+d.others[1].value,
								imgItem:this.item.join(",")
							});
						}
 						this.$router.go(-1);
					}else{
						this.$MessageBox('提示','保存失败!');
					}
				})
			},
			relation(){
				this.$router.push({
					path:'/assPhotos',
					query:{
						infoType:'0',
						equCode:this.$route.params.equCode || '',
						positionCode:this.$route.params.positionCode || ''
					}
				})
			}
		},
		beforeRouteLeave(to, from, next){
			
			if(to.name == 'AssPhotos'){
				from.meta.isUseCache = true;
			}else{
				this.draw.color = null;
				this.draw.item = [];
				this.activeColor = null;
				from.meta.isUseCache = false;
			}
			next()
		},
		activated(){
			if(!this.$route.meta.isUseCache){
				this.draw = null;
				this.$store.commit('showLoading')
				setTimeout(() => {
					this.setCanvasinfo();
					this.draw = new Draw('canvas');
					this.initDraw(null);
				},1000)
			}
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
			mui.back = function(){
				history.go(-1)//回退到上一页面
			}
		}
	}
</script>

<style>
	.canvas-box{
		width: 100%;
		position: absolute;
		top: 0;
		bottom: 0.96rem;
		left: 0;
		right: 0;
		overflow: hidden;
	}
	.canvas-box #canvas,.canvas-box #canvasDiv{
		max-height: 100%;
	}
	.photocom-footer{
		width: 100%;
		height: 0.96rem;
		background: #00B393;
		position: absolute;
		bottom: 0;
		display: flex;
	}
	.photocom-footer>span{
		flex: 1;
		text-align: center;
		color: #fff;
		font-size: 0.2rem;
		padding-top: 0.1rem;
	}
	.photocom-footer>span>i{
		font-size: 0.4rem;
	}
	.photocom-footer>span.active{
		font-weight: bold;
	}
	.select-option{
		position: absolute;
		bottom: 0.96rem;
		width: 100%;
	}
	.legend-box{
		width: 100%;
		height: 1.2rem;
		border-top: 0.02rem solid #00B393;
		text-align: center;
	}
	.legend-box:before{
		content: '';
		display: inline-block;
		width: 0;
		height: 100%;
		vertical-align: middle;
	}
	.legend-box>span{
		vertical-align: middle;
		display: inline-block;
		margin: 0 0.2rem;
		padding: 0.1rem 0.2rem;
		text-align: center;
		overflow: hidden;
	}
	.legend-box>span.active{
		border: 0.01rem solid #dedede;
		border-radius: 0.1rem;
		background: rgba(0,0,0,0.1);
	}
	.legend-box>span>img{
		
		display: line-block;
		width: 0.4rem;
		height: 0.4rem;
	}
	.option-color{
		text-align: center;
		height: 1rem;
		width: 100%;
	}
	.option-color:before{
		content: '';
		width: 0;
		height: 100%;
		display: inline-block;
		vertical-align: middle;
	}
	.option-color>span{
		display: inline-block;
		width: 0rem;
		height: 0rem;
		border-radius: 50%;
		border-width: 0.2rem;
		border-style: solid;
		margin: 0 0.14rem;
		box-sizing: content-box;
		transition: all 200ms;
		vertical-align: middle;
	}
	.option-color>span.active{
		width: 0.24rem;
		height: 0.24rem;
	}
	.revokeor{
		position: absolute;
		bottom: 2rem;
		right: 0.4rem;
	}
	.revokeor>span{
		display: block;
		width: 0.74rem;
		height: 0.74rem;
		background: #fff;
		border-radius: 50%;
		line-height: 0.74rem;
		text-align: center;
		margin-bottom: 0.1rem;
	}
	.revokeor>span>i{
		font-size: 0.34rem;
	}
</style>