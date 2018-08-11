<template>
	<div class="tables-box">
		<table>
			<tr class="table-head">
				<th v-for="(list,i) in datalist.ahead" :key="i">{{list}}</th>
			</tr>
			<tr class="table-body" v-for="(list,i) in datalist.abody" :key="i">
				<td>{{list.info1}}</td>
				<td>{{list.info2}}</td>
				<td>{{list.info3}}</td>
				<td><i class="iconfont icon-qushi"></i></td>
				<td><i class="iconfont icon-daochu"></i></td>
			</tr>
		</table>
	</div>
</template>

<script>
	export default{
		props:['datalist'],
	}
</script>

<style>
	.tables-box{
		width: 100%;
	}
	.tables-box table{
		width: 100%;
		border-collapse: collapse;
	}
	.tables-box tr{
		width: 100%;
		text-align: center;
	}
	.tables-box td,.tables-box th{
		height: 0.65rem;
		border: 0.01rem solid #dedede;
		border-left-width: 0;
		border-top-width: 0;
	}
	.tables-box td:last-child,.tables-box th:last-child{
		border-right-width: 0;
	}
	.tables-box td i{
		font-size: 0.44rem;
		color: #00B393;
	}
</style>