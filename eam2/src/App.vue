<template>
  <div id="app">
  	<eam-head v-if="$store.state.heads.show" :mes="$store.state.heads.headData"></eam-head>
	<transition :name="transitionName">
		<keep-alive v-if="$route.meta.keepAlive">
			<router-view :class="{iphonex:$root.iphonex}" ref="editUser" v-cloak></router-view> 
		</keep-alive>
		<router-view ref="editUser" v-cloak v-if="!$route.meta.keepAlive"></router-view> 
	</transition>
    <loading v-if="LOADING"></loading>
	
  </div>
</template>

<script>
import EamHead from '@/components/assembly/header'
import loading from '@/components/assembly/loading'
import rightPop from '@/components/assembly/rightPop'
import {mapState} from 'vuex'
export default {
  name: 'App',
  components:{ EamHead,loading,rightPop },
  data () {
      return {
        transitionName: 'slide-left'
      }
    },
    watch:{
    		$route(to,from){
    			this.$store.commit('hideLoading');
    			if(from.name == 'ScanCode'){
    				this.$refs.editUser.closeScan();
    			}
					if(from.name == 'NotFound' || to.name == 'NotFound' || to.name == 'Login'){
						this.transitionName = '';
						return false
					}
    			if(to.meta.index > from.meta.index){
    				this.transitionName = 'slide-left'
    			}else{
    				this.transitionName = 'slide-right'
    			}
    		},
    },
    computed:{
        ...mapState([
            'LOADING','abnorData'
        ])
    },
}
</script>

<style>
	#app{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		overflow: hidden;
	}
	.slide-right-enter-active,
	.slide-right-leave-active,
	.slide-left-enter-active,
	.slide-left-leave-active {
	  will-change: transform;
		opacity: 1;
	  transition: all 500ms;
	  position: absolute;
	}
	.slide-right-enter {
	  opacity: 0;
	  transform: translate(-80%, 0);
	}
	.slide-right-leave-active {
	  opacity: 0;
	  transform: translate(30%, 0);
	}
	.slide-left-enter {
	  opacity: 0;
	  transform: translate(80%, 0);
	}
	.slide-left-leave-active {
	  opacity: 0;
	  transform: translate(-30%, 0);
	}
</style>
