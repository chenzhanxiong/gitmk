<template>
	<div class="rightpop-box">
		<transition name="fade">	
			<div class="right-pop" v-if="popshow" @click="popsild()"></div>
		</transition>
		<transition name="slide">
			<div class="right-curtain" v-if="popshow"><screen @popsild="popsild"></screen></div>
		</transition>
	</div>
</template>

<script>
	import Screen from '@/components/repairCenter/screen'
	export default{
		data(){
			return{
				popshow:false,
			}
		},
		methods:{
			popsild () {
				this.popshow = !this.popshow;
			}
		},
		components:{ Screen },
	}
</script>

<style>
	.right-pop{
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0,0,0,0.5);
		z-index: 1;
		transition: all 0.5s;
	}
	.right-curtain{
		position: absolute;
		background: #fff;
		top: 0;
		left: 1rem;
		right: 0;
		bottom: 0;
		z-index: 2;
	}
	.fade-enter-active,
	.fade-leave-active,
	.slide-enter-active,
	.slide-leave-active {
	  will-change: transform;
	  transition: all 500ms;
	  position: absolute;
	}
	.fade-enter {
	  opacity: 0;
	}
	.fade-leave-active {
	  opacity: 0;
	}
	.slide-enter {
	  opacity: 0;
	  transform: translate3d(100%, 0, 0);
	}
	.slide-leave-active {
	  opacity: 0;
	  transform: translate3d(100%, 0, 0);
	}
</style>