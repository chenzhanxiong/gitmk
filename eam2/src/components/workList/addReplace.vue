<template>
	<div class="add-replace-box row-box">
		<ul class="add-replace-ul">
			<li v-for="(list,i) in listdata" :key="i" @click="$router.push('/addSparepart')">
				<span>{{list.name}}</span>
				<div class="add-replace-page">
					<span v-if="!list.listshow">{{list.value}}</span>
					<ul class="replace-page-child" v-if="list.listshow" @click.stop>
						<li v-for="(li,i) in list.list" :key="i">
							<span>{{li.name}}</span>
							<span>
								<i :class="{active:li.num > 0}" @click="li.num > 0 && li.num--">-</i>
								<input type="number" v-model="li.num" disabled/>
								<i class="active" @click="li.num++">+</i>
							</span>
						</li>
					</ul>
				</div>
				<i class="iconfont icon-arr"></i>
			</li>
		</ul>
		
	</div>
</template>

<script>
	export default{
		data(){
			return{
				visitible:'',
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
						html:'添加换件信息'
					},
					{
						show:true,
						html:'保存'
					}
				],
				listdata:[
					{
						listshow:false,
						name:'添加部位',
						value:'部位1',
						list:[
							{name:'部位名称1',num:0},
							{name:'部位名称1',num:0},
							{name:'部位名称1',num:0},
							{name:'部位名称1',num:0},
						]
					},
					{
						listshow:false,
						name:'添加备件',
						value:'备件1',
						list:[
							{name:'备件名称1',num:0},
							{name:'备件名称1',num:0},
							{name:'备件名称1',num:0},
							{name:'备件名称1',num:0},
						]
					}
				]
				
			}
		},
		mounted(){
			this.$store.state.heads.show = true;
			this.$store.state.heads.headData = this.headData;
		}
	}
</script>

<style>
	.add-replace-ul{
		width: 100%;
		padding: 0 0.2rem;
	}
	.add-replace-ul>li{
		padding: 0.2rem;
		overflow: hidden;
		border-bottom: 0.01rem solid #dedede;
	}
	.add-replace-ul>li>span,.add-replace-page{
		float: left;
		line-height: 0.74rem;
		/*height: 0.74rem;*/
		font-size: 0.3rem;
	}
	.add-replace-ul>li>span{
		width: 1.5rem;
	}
	.add-replace-ul>li>.add-replace-page{
		width: 4.5rem;
		color: #666;
	}
	.add-replace-page>span{
		float: right;
	}
	.add-replace-ul>li>i{
		float: right;
		margin-top: 0.2rem;
	}
	.replace-page-child{
		margin-top: 0.74rem;
	}
	.replace-page-child>li>span:first-child{
		width: 3rem;
		float: left;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.replace-page-child>li>span:last-child{
		float: right;
	}
	.replace-page-child>li>span:last-child>input{
		width: 0.4rem;
		text-align: center;
		background: #fff;
		box-shadow: none;
		border: none;
	}
	.replace-page-child>li>span:last-child>input:disabled{
		background: #fff;
		box-shadow: none;
		opacity: 1;
    		-webkit-opacity: 1;
	}
	.replace-page-child>li>span:last-child>i{
		display: inline-block;
		width: 0.25rem;
		height: 0.25rem;
		line-height: 0.23rem;
		text-align: center;
		border: 0.01rem solid #00B393;
		border-radius: 50%;
		color: #00B393;
	}
	.replace-page-child>li>span:last-child>i.active{
		color: #fff;
		background: #00B393;
	}
</style>