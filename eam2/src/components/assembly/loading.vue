<template>
	<div class="loading-box">
		<div class="loading">
			<i></i>
			<p>{{mes}}</p>
		</div>
	</div>
</template>

<script>
	export default{
		name:'loading',
		props:['mes']
	}
</script>

<style>
	.loading-box{
		position: fixed;
		width: 100%;
		height: 100%;
		z-index: 9999;
		top: 0;
	}
	.loading{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		background:rgba(255,255,255,0.5);
		color: #fff;
		text-align: center;
		padding: 0.4rem 0.4rem;
		border-radius: 0.3rem;
		font-size: 0.26rem;
	}
	.loading i{
		display:block;
		color: #00B393;
		height: 1.2rem;
		/*animation:run 3s infinite linear;*/
	}
	/*.loading i:before,.loading i:after{
		content: '';
		display: inline-block;
		width: 0;
		height: 0;
		border-radius: 50%;
		background: #00B393;
		text-align: center;
	}*/
	.loading i:before{
		content: '';
		/*animation:be 3s infinite linear;*/
		display: block;
		border: 0.1rem solid rgba(0, 229, 183, 0.9);
	  opacity: .9;
	  border-right-color: transparent;
	  border-left-color: transparent;
	  width: 1rem;
	  height: 1rem;
	  margin: 0 auto;
	  border-radius: 50%;
	  -webkit-box-shadow: 0 0 0.7rem rgba(0, 76, 61, 0.9);
	  -moz-box-shadow: 0 0 0.7rem rgba(0, 76, 61, 0.9);
	  box-shadow: 0 0 0.7rem rgba(0, 76, 61, 0.9);
	  -webkit-animation: spin-pulse 1s linear infinite normal;
	  -moz-animation: spin-pulse 1s linear infinite normal;
	  -ms-animation: spin-pulse 1s linear infinite normal;
	  animation: spin-pulse 1s linear infinite normal;
	  -webkit-animation-delay: 0;
	  -moz-animation-delay: 0;
	  -o-animation-delay: 0;
	  animation-delay: 0;
	}
	.loading i:after{
		content: '';
		/*animation:af 3s infinite linear;*/
		display: block;
		border: 0.1rem solid rgba(0, 229, 183, 0.9);
	  opacity: .9;
	  border-left-color: transparent;
	  border-right-color: transparent;
	  border-radius: 50%;
	  -webkit-box-shadow: 0 0 0.3rem rgba(0, 76, 61, 0.9);
	  -moz-box-shadow: 0 0 0.3rem rgba(0, 76, 61, 0.9);
	  box-shadow: 0 0 0.3rem rgba(0, 76, 61, 0.9);
	  width: 0.6rem;
	  height: 0.6rem;
	  position: relative;
	  top: -1rem;
	  margin: 0 auto;
	  -webkit-animation: spin-right 1s linear infinite normal;
	  -moz-animation: spin-right 1s linear infinite normal;
	  -ms-animation: spin-right 1s linear infinite normal;
	  animation: spin-right 1s linear infinite normal;
	  -webkit-animation-delay: 0;
	  -moz-animation-delay: 0;
	  -o-animation-delay: 0;
	  animation-delay: 0;
	}
	@keyframes spin-pulse {
	  from {
	    transform: rotate(160deg);
	    opacity: 0;
	    box-shadow: 0 0 1px rgba(0, 61, 76, 0.9);
	  }
	  50% {
	    transform: rotate(145deg);
	    opacity: 1;
	  }
	  to {
	    transform: rotate(-320deg);
	    opacity: 0;
	  }
	}
	@keyframes spin-right {
	  from {
	    transform: rotate(0deg);
	    opacity: 0.2;
	  }
	  50% {
	    transform: rotate(180deg);
	    opacity: 1.0;
	  }
	  to {
	    transform: rotate(360deg);
	    opacity: 0.2;
	  }
	}
	@keyframes be{
	    0%{
	        width: 0.2rem;
	        height: 0.2rem;
	    }
	    50%{
	    		width: 0.6rem;
	    		height: 0.6rem;
	    }
	    100%{
	        width: 0.2rem;
	    		height: 0.2rem;
	    }
	}
	@keyframes af{
	    0%{
	        width: 0.6rem;
	        height: 0.6rem;
	    }
	    50%{
	    		width: 0.2rem;
	    		height: 0.2rem;
	    }
	    100%{
	        width: 0.6rem;
	    		height: 0.6rem;
	    }
	}
	@keyframes run{
	    from{
	        transform: rotate(0deg);
	    }
	    to{
	        transform: rotate(360deg);
	    }
	}
</style>