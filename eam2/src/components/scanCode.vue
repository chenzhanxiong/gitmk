<template>
  <div class="scan">
  	<div class="row-box">
  		<div id="bcid">
      		<div style="height:40%"></div>
      		<p class="tip">...载入中...</p>
    		</div>
  	</div>
    
  </div>
</template>

<script type='text/ecmascript-6'>
  let scan = null;
  export default {
    data() {
      return {
        codeUrl: '',
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
				html:'扫描二维码',
				event:() => {
					
				}
			},
		],
      }
    },
    methods: {
      //创建扫描控件
      startRecognize() {
        let that = this;
        let styles = {
			frameColor: "#00B294",
			scanbarColor: "#00B294",
			background: "#efefef"
		}
        if (!window.plus) return;
        scan = new plus.barcode.Barcode('bcid','',styles);
        scan.onmarked = onmarked;
        this.startScan();
        function onmarked(type, result, file) {
          switch (type) {
            case plus.barcode.QR:
              type = 'QR';
              break;
            case plus.barcode.EAN13:
              type = 'EAN13';
              break;
            case plus.barcode.EAN8:
              type = 'EAN8';
              break;
            default:
              type = '其它' + type;
              break;
          }
          result = result.replace(/\n/g, '');
          that.codeUrl = result;
          alert(result);
          that.closeScan();

        }
      },
      //开始扫描
      startScan() {
        if (!window.plus) return;
        scan.start();
      },
      //关闭扫描
      cancelScan() {
        if (!window.plus) return;
        scan.cancel();
      },
      //关闭条码识别控件
      closeScan() {
        if (!window.plus) return;
        scan.close();
      },
    },
    mounted(){
    		setTimeout(() => {
    			this.startRecognize();
    		},1000);
		this.$store.state.heads.show = true;
		this.$store.state.heads.headData = this.headData;
    }
  }
</script>
<style>
  .scan {
    		height: 100%;
    }
    .scan #bcid {
      width: 100%;
      height: 100%;
      text-align: center;
      color: #fff;
      background: #ccc;
    }
</style>