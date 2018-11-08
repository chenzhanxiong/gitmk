<template>
	<div class="rightpop-box">
		<transition name="fade">	
			<div class="right-pop" :class="{'right-pop1':abnorData.textareaShow}" v-if="popshow || abnorData.textareaShow" @click="popsild()"></div>
		</transition>
		<transition name="slide">
			<div class="right-curtain" v-if="popshow"><screen @getlistData="$emit('getlistData')" @popsild="popsild"></screen></div>
		</transition>
		<transition name="slide">
			<div class="right-curtain1" v-if="abnorData.textareaShow"><Describe></Describe></div>
		</transition>
	</div>
</template>

<script>
	import Screen from '@/components/repairCenter/screen'
	import Describe from '@/components/abnormallyReport/describe'
	import {mapState} from 'vuex'
	export default{
		computed:{
			...mapState(['abnorData'])
		},
		data(){
			return{
				popshow:false,
				textareaShow:false,
			}
		},
		methods:{
			popsild () {
				this.popshow = !this.popshow;
			}
		},
		components:{ Screen,Describe },
	}
</script>

<style>
	.right-pop{
		position: absolute;
		top: 0rem;
		bottom: 0;
		width:100%;
		background: rgba(0,0,0,0.5);
		z-index: 1;
		transition: all 0.5s;
	}
	.right-pop1{
		top: -1.44rem;
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
	.right-curtain1{
		position: absolute;
		background: #fff;
		top: -1.44rem;
		left: 0;
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