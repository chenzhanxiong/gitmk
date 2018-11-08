<template>
	<div class="user-info">
		<ul class="info-left">
			<li>
				<span>用户：</span>
				<span>{{user.name}}</span>
			</li>
			
			<li>
				<span>工号：</span>
				<span>{{user.loginName}}</span>
			</li>
		</ul>
		<ul class="info-right">
			<li>
				<span>机台编号：</span>
				<span @click="tabEqu(list)" v-for="(list,i) in userList" :key="i" :class="{'mr-10':i < userList.length-1,active:$store.state.activeEquId == list.id}">{{list.equName}}</span>
			</li>
		</ul>
	</div>
</template>

<script>
	export default{
		props:['userList'],
		data(){
			return{
				user:'',
				listdata:[]
			}
		},
		methods:{
			getUser(){
				this.$axios.get(this.$store.state.devHost+':'+this.$store.state.serPort+'/skydev/api/user/entry').then((res) => {
					let d = res.data;
					if(!d.result){
						this.user = d.obj
					}else{
						
					}
				})
			},
			tabEqu(list){
				let state = this.$store.state
				state.activeEquId = list.id;
				state.activeEquName = list.equName;
				state.activeAssetNumber = list.activeAssetNumber;
			}
		},
		mounted(){
			this.getUser();
			this.$emit('getjsobj');
		}
	}
</script>

<style>
	.user-info{
		width: 100%;
		height: 0.64rem;
		background:#fff;
		padding: 0 0.5rem;
		line-height: 0.64rem;
	}
	.user-info ul.info-left{
		float: left;
	}
	.user-info ul.info-right{
		float: right;
	}
	.user-info li{
		float: left;
		
	}	
	.user-info ul.info-left li{
		margin-right: 0.2rem;
	}
	.user-info ul.info-right li{
		margin-left: 0.2rem;
	}
	.user-info li span{
		float: left;
	}
	.user-info li span:first-child{
		color: #999;
		font-size: 0.2rem;
	}
	.user-info li span{
		font-size: 0.25rem;
		max-width: 2.3rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		cursor: pointer;
	}
	.user-info li span.active{
		color: #00B393;
	}
</style>