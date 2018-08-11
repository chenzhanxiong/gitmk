<template>
	<wroklistc :listdata="listdata" :operationc="operation"></wroklistc>
</template>

<script>
	import wroklistc from '@/components/workList/worklistc'
	import {mapState} from 'vuex';
	export default{
		components:{wroklistc},
		computed:{
			...mapState(['worklistData'])
		},
		data(){
			return{
				listdata:{
					notfinish:[],
					finish:[]
				},
				operation:[
					{
						icon:'icon-kaishi',
						info:'开始',
						event:(list) => {
							console.log(list)
							this.$router.push('/workHandle2')
						}
					},
					{
						icon:'icon-yanqi',
						info:'延迟',
						event:() => {
							this.$children[0].openPicker();
							//this.$refs.$refs.$refs.openPicker();
						}
					},
					{
						icon:'icon-jieshu',
						info:'已完成',
					}
				]
			}
		},
		methods:{
			getwochecklistData(){//获取点检工单列表
				this.$axios.get('/static/data.json',{
					params:{
						query:{
							equipmentId:'',//设备id
							name:'',//设备名称
							date:'',//日期
							class:'',//班次
							type:'',//点检类型
							isDelay:'',//是否延期
							isFinish:'',//是否完成
						},
						pager:{
							pageIndex:1,
							pageSize:10,
						}
					}
				}).then((res) => {
					let data = res.data.list;
					if(data.result){
						data.item.forEach((e) => {
							this.listdata[this.$children[0].tabdata.isFinish.id] = this.listdata.notfinish.concat(this.handle(e))
						})
					}
				})
			},
			handle(d){
				return {
					id:d.woId,
					icon:d.icon,
					info1:d.name+'('+d.ratio+')',
					info2:'',
					info3:d.date+'/'+d.class,
					info4:'',
					info5:d.turn,
					operation:false
				}
			}
		},
		mounted(){
			this.getwochecklistData();
		}
	}
</script>

<style>
</style>