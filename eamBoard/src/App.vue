<template>
	<div id="app" @keyup.esc="isWindow">
		<bo-header v-if="$store.state.headData" :full="full" @isWindow="isWindow"></bo-header>
		<div class="content-box" :class="{lg:!$store.state.headData}">
			<user-info v-if="$store.state.headData" @getjsobj="getjsobj" :userList="userList"></user-info>
			<transition :name="transitionName">
				<router-view v-cloak></router-view>
			</transition>
		</div>
		<span class="fullScreen-btn">
			
		</span>
	</div>
</template>

<script>
	import boHeader from '@/components/header'
	import userInfo from '@/components/assembly/userInfo'
	export default {
	  name: 'App',
	  components:{boHeader,userInfo},
		data(){
			return{
				full:true,
				userList:[],
				transitionName:'slide-left',
				equId:'',
			}
		},
		watch: {//使用watch 监听$router的变化
			$route(to, from) {
				//如果to索引大于from索引,判断为前进状态,反之则为后退状态
				if(to.meta.index > from.meta.index){
					//设置动画名称
					this.transitionName = 'slide-left';
				}else{
					this.transitionName = 'slide-right';
				}
				
			}
		},
		methods:{
			isWindow(){//全屏
				if(this.full){
					jsObj.NormalWindow();
					this.full = false;
				}else{
					jsObj.FullWindow();
					this.full = true;
				}
			},
			getEquipmentDetail(id,index){//获取设备信息
				this.$axios.get(this.$root.URL+'eom/api/equipment/detail/'+id).then((res)=>{
					let d = res.data;
					if(!d.result){
						this.userList.push(d.obj)
						if(index == 0){
							this.$store.state.activeEquId = d.obj.id;
							this.$store.state.activeEquName = d.obj.equName;
							this.$store.state.activeAssetNumber = d.obj.assetNumber
						}
					}
				})
			},
			getjsobj(){
				this.equId = '1262020320181030000001X,1262020320181030000002X'
// 				if(jsObj){
// 					this.equId = jsObj.GetParams();
// 				}
				
				this.equId.split(",").forEach((item,i) => {
					if(i == 0){
						this.$store.state.activeEquId = item;
					}
					this.getEquipmentDetail(item,i)
					
				})
				
			}
		},
		created(){
			var lett = this;
			document.onkeydown = function(e) {
			var key = window.event.keyCode;
				if (key == 27) {
					jsObj.NormalWindow();
					lett.full = false;
				}
			}
		},
		mounted(){
			this.userList = [];
		},
		
	}
</script>

<style>
	#app{
		width: 100%;
		min-width: 1024px;
		position: absolute;
		top: 0;
		bottom: 0;
		overflow: auto;
	}
	.content-box{
		width: 100%;
		position: absolute;
		top: 1.08rem;
		bottom: 0;
	}
	.content-box.lg{
		top: 0;
	}
	.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 500ms;
  position: absolute;
	background: #fff;
}
.slide-right-enter {
  opacity: 0;
}
.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-enter {
  opacity: 0;
}
.slide-left-leave-active {
  opacity: 0;
}

</style>
