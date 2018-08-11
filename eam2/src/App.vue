<template>
  <div id="app">
  	<eam-head v-if="$store.state.heads.show" :mes="$store.state.heads.headData"></eam-head>
	<transition :name="transitionName">
    		<router-view ref="editUser" v-cloak></router-view> 
    </transition>
    <loading v-if="LOADING"></loading>
  </div>
</template>

<script>
import EamHead from '@/components/assembly/header'
import loading from '@/components/assembly/loading'
import {mapState} from 'vuex'
export default {
  name: 'App',
  components:{ EamHead,loading },
  data () {
      return {
        transitionName: 'slide-left'
      }
    },
    watch:{
    		$route(to,from){
    			if(from.name == 'ScanCode'){
    				this.$refs.editUser.closeScan();
    			}
    			if(to.meta.index > from.meta.index){
    				this.transitionName = 'slide-left'
    			}else{
    				this.transitionName = 'slide-right'
    			}
    		}
    },
    computed:{
        ...mapState([
            'LOADING'
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
	}
	.slide-right-enter-active,
	.slide-right-leave-active,
	.slide-left-enter-active,
	.slide-left-leave-active {
	  will-change: transform;
	  transition: all 200ms;
	  position: absolute;
	}
	.slide-right-enter {
	  opacity: 0;
	  transform: translate3d(-100%, 0, 0);
	}
	.slide-right-leave-active {
	  opacity: 0;
	  transform: translate3d(100%, 0, 0);
	}
	.slide-left-enter {
	  opacity: 0;
	  transform: translate3d(100%, 0, 0);
	}
	.slide-left-leave-active {
	  opacity: 0;
	  transform: translate3d(-100%, 0, 0);
	}
	[v-cloak]{
		display: none;
	}
</style>
