<template>
	<div class="sparelist-box">
		<div class="sparelist-position" v-for="(list,i) in datalist" :key="i">
			<h4 class="title">{{list.title}}</h4>
			<ul>
				<li v-for="(li,i) in list.list" :key="'c'+i">
					<span>{{li.name}}</span>
					<span>{{li.value}}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				datalist:[
					{
						title:'部位详情-1',
						list:[
							{name:'图号',value:'41dde858484'},
							{name:'名称',value:'销'},
							{name:'版本',value:'A.3'},
							{name:'型号规格',value:''},
							{name:'项目代号',value:''},
							{name:'数量',value:'1'},
							{name:'单位',value:'个'},
						]
					},
					{
						title:'部位详情-2',
						list:[
							{name:'图号',value:'41dde858484'},
							{name:'名称',value:'销'},
							{name:'版本',value:'A.3'},
							{name:'型号规格',value:''},
							{name:'项目代号',value:''},
							{name:'数量',value:'1'},
							{name:'单位',value:'个'},
						]
					}
				]
			}
		},
		mounted(){
		}
	}
</script>

<style>
	.sparelist-box{
		width: 100%;
		height: 100%;
		overflow: auto;
	}
	.sparelist-position{
		width: 100%;
		background: #fff;
	}
	.sparelist-position .title{
		line-height: 0.6rem;
		height: 0.6rem;
		background: #f5f5f5;
		color: #666;
		padding: 0 0.4rem;
		font-size: 0.26rem;
	}
	.sparelist-position ul{
		padding: 0 0.2rem;
	}
	.sparelist-position li{
		width: 100%;
		line-height: 0.9rem;
		padding: 0 0.2rem;
		border-bottom: 0.01rem solid #dedede;
		font-size: 0.3rem;
	}
	.sparelist-position li span:last-child{
		float: right;
		text-align: right;
		color: #999;
	}
</style>