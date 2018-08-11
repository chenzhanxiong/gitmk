<template>
	<div class="photocom-box row-box">
		<div class="canvas-box" id="canvasBox">
			<canvas id="canvas" width="" height=""></canvas>
		</div>
		<div class="select-option">
			<div class="option-color">
				<span v-for="(list,i) in optionColor" :class="{active:activeColor == list}" @click="initDraw(list)" :key="i" :style="'borderColor:'+list+''"></span>
			</div>
			<div class="legend-box">
				<span :class="{active:activeColor == list}" v-for="(list,i) in optionimg" :key="i" @click="initDraw(list)">
					<img :src="list.src" alt="" />
				</span>
			</div>
			<div class="revokeor">
				<span @click="clear"><i class="iconfont icon-chexiao"></i></span>
				<span @click="save"><i class="iconfont icon-zhongzuo"></i></span>
			</div>
		</div>
		<div class="photocom-footer">
			<span class="active">
				<i class="iconfont icon-geomark-icon"></i>
				<p>标注</p>
			</span>
			<span>
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
	        this.canvas = document.getElementById(this.el)
	        this.cxt = this.canvas.getContext('2d')
	        this.stage_info = this.canvas.getBoundingClientRect()
	        this.path = {
	            beginX: 0,
	            beginY: 0,
	            endX: 0,
	            endY: 0
	        }
	    }
	    init() {
	        var that = this;
	        this.canvas.addEventListener('touchstart', function(event) {
	            document.addEventListener('touchstart', preHandler, { passive: false }); 
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
	    drawImg(e,url){
	    		let that = this;
	    		let imgs = new Image();
	    		imgs.src = url.src;
	    		let x = e.changedTouches[0].clientX - that.stage_info.left - 25;
	    		let y= e.changedTouches[0].clientY - that.stage_info.top - 25;
	    		imgs.onload = function(){
	    			this.width = 30;
	    			this.height = 30;
	    			that.cxt.drawImage(this,x,y,50,50)
	    		}
	    }
	    drawBegin(e,color) {
	        var that = this;
	        window.getSelection() ? window.getSelection().removeAllRanges() : document.selection.empty()
	        this.cxt.strokeStyle = color;
	        this.cxt.lineWidth = 4;
	        this.cxt.beginPath()
	        this.cxt.moveTo(
	            e.changedTouches[0].clientX - this.stage_info.left,
	            e.changedTouches[0].clientY - this.stage_info.top
	        )
	        this.path.beginX = e.changedTouches[0].clientX - this.stage_info.left
	        this.path.beginY = e.changedTouches[0].clientY - this.stage_info.top
	        	canvas.addEventListener("touchmove",that.drawing,false)
	    }
	    drawing = function(e) {
	        this.cxt.lineTo(
	            e.changedTouches[0].clientX - this.stage_info.left,
	            e.changedTouches[0].clientY - this.stage_info.top
	        )
	        this.path.endX = e.changedTouches[0].clientX - this.stage_info.left
	        this.path.endY = e.changedTouches[0].clientY - this.stage_info.top
	        this.cxt.stroke();
	    }.bind(this)
	    drawEnd() {
	        document.removeEventListener('touchstart', preHandler, { passive: false }); 
	        document.removeEventListener('touchend', preHandler, { passive: false });
	        document.removeEventListener('touchmove', preHandler, { passive: false });
	        //canvas.ontouchmove = canvas.ontouchend = null
	    }
	    clear() {
	    		this.cxt.clearRect(0,0,canvas.width,canvas.height);
	    }
	    save(){
	       return canvas.toDataURL("image/png");
	    }
	}
	export default{
		data(){
			return{
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
							this.$MessageBox.confirm('确认提交？').then(() =>{
								console.log(1)
							})
						}
					}
				],
				optionimg:[
					{src:'../static/images/leaking.png',name:'漏油'},
					{src:'../static/images/damage.png',name:'损坏'}
				],
				optionColor:['#e5620a','#feff00','#21ae37','#00b9ef','#930882','#000000','#db3472','#a4292a','#ffffff'],
				activeColor:'',
				draw:null,
			}
		},
		methods:{
		     setCanvasinfo(){
		     	let box = document.getElementById("canvasBox");
		     	let	c = document.getElementById("canvas");
		     	c.width = box.clientWidth;
		     	c.height = box.clientHeight;
		     	c.style.backgroundImage = 'url('+this.$store.state.imgSrc+')';
		     },
		     clear:function(){
		        this.draw.clear();
		    	},
		    save:function(){
		        var data = this.draw.save();
		        this.url = data;
		    },
		    initDraw(list){
		    		this.activeColor = list;
		    		this.draw.color = this.activeColor;
		    		this.draw.init();
		    }
		},
		mounted(){
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
			setTimeout(() => {
				this.setCanvasinfo();
				this.draw = new Draw('canvas');
				this.draw.init();
				this.initDraw();
			},1000)
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
	}
	.canvas-box canvas{
		width: 100%;
		background-size: 100%;
		background-position: center;
		background-repeat: no-repeat;
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
		height: 0.78rem;
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
		width: 0.6rem;
		height: 0.6rem;
		margin: 0 0.2rem;
		padding: 0.1rem;
		overflow: hidden;
	}
	.legend-box>span.active{
		border: 0.01rem solid #dedede;
		border-radius: 0.1rem;
		background: rgba(0,0,0,0.1);
	}
	.legend-box>span>img{
		display: block;
		width: 100%;
		height: 100%;
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