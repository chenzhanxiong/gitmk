<template>
	<div>
		<mt-popup v-model="popupEnd" popup-transition="popup-fade" v-if="datelist">
			<div class="report-pop-msg">
				<div class="work-pop-row">
					<ul class="work-pop-input">
						<li v-if="datelist.name.startDate">
							<span>{{datelist.name.startDate}}：</span>
							<input type="text" readonly v-model="datelist.value.startDate" @click="openPicker('startDate')"/>
						</li>
						<li v-if="datelist.name.startTime">
							<span>{{datelist.name.startTime}}：</span>
							<input type="text" readonly v-model="datelist.value.startTime" @click="openPicker('startTime')"/>
						</li>
						<li v-if="datelist.name.endDate">
							<span>{{datelist.name.endDate}}：</span>
							<input type="text" readonly v-model="datelist.value.endDate" @click="openPicker('endDate')"/>
						</li>
						<li v-if="datelist.name.endTime">
							<span>{{datelist.name.endTime}}：</span>
							<input type="text" readonly v-model="datelist.value.endTime" @click="openPicker('endTime')"/>
						</li>
					</ul>
				</div>
			</div>
			<div class="report-pop-btn" @click="sureSubmit">
				<span>提交</span>
			</div>
		</mt-popup>
		<mt-datetime-picker ref="pickerdate" v-model="curdate" title="请选择日期" type="date" @confirm="confirm">
		</mt-datetime-picker>
		<mt-datetime-picker ref="pickertime" v-model="curtime" title="请选择时间" type="time" @confirm="confirm">
		</mt-datetime-picker>
	</div>
</template>

<script>
	import {formatDate} from '@/static/date'
	export default{
		props:['datelist'],
		data(){
			return{
				popupEnd:false,
				curdate:'',
				curtime:'',
				typedate:'',
			}
		},
		methods:{
			slidpopupEnd(){
				this.popupEnd = !this.popupEnd;
			},
			openPicker(type){
				this.typedate = type;
				if(type == 'startDate'){
					this.curdate = this.datelist.value.startDate;
					this.$refs.pickerdate.open()
				}else if(type == 'startTime'){
					this.curtime = this.datelist.value.startTime;
					this.$refs.pickertime.open()
				}else if(type == 'endDate'){
					this.curdate = this.datelist.value.endDate;
					this.$refs.pickerdate.open()
				}else if(type == 'endTime'){
					this.curtime = this.datelist.value.endTime;
					this.$refs.pickertime.open()
				}
			},
			confirm(data){
				switch(this.typedate){
					case 'startDate': 
						this.datelist.value.startDate = formatDate(data,'yyyy-MM-dd');
						break;
					case 'startTime':
						this.datelist.value.startTime = data + ':00';
						break;
					case 'endDate':
						this.datelist.value.endDate = formatDate(data,'yyyy-MM-dd');
						break;
					case 'endTime':
						this.datelist.value.endTime = data + ':00';
				}
			},
			sureSubmit(){
				this.slidpopupEnd();
				this.$emit('sureSubmit');
			}
		},
	}
</script>
