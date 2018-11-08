var wgtVer=null;
function plusReady(){
    // ......
    // 获取本地应用资源版本号
    plus.runtime.getProperty(plus.runtime.appid,function(inf){
        wgtVer=inf.version;
        console.log("当前应用版本："+wgtVer);
    });
}
if(window.plus){
    plusReady();
}else{
    document.addEventListener('plusready',plusReady,false);
}

// 检测更新
var checkUrl="http://demo.dcloud.net.cn/test/update/check.php";
function checkUpdate(){
    plus.nativeUI.showWaiting("检测更新...");
    var xhr=new XMLHttpRequest();
    xhr.onreadystatechange=function(){
        switch(xhr.readyState){
            case 4:
            plus.nativeUI.closeWaiting();
            if(xhr.status==200){
                console.log("检测更新成功："+xhr.responseText);
                var newVer=xhr.responseText;
                if(wgtVer&&newVer&&(wgtVer!=newVer)){
                    downWgt();  // 下载升级包
                }else{
                    plus.nativeUI.alert("无新版本可更新！");
                }
            }else{
                console.log("检测更新失败！");
                plus.nativeUI.alert("检测更新失败！");
            }
            break;
            default:
            break;
        }
    }
    xhr.open('GET',checkUrl);
    xhr.send();
}

// 下载wgt文件
var wgtUrl="http://demo.dcloud.net.cn/test/update/H56631822.wgt";
function downWgt(){
    plus.nativeUI.showWaiting("下载wgt文件...");
    plus.downloader.createDownload( wgtUrl, {filename:"_doc/update/"}, function(d,status){
        if ( status == 200 ) { 
            console.log("下载wgt成功："+d.filename);
            installWgt(d.filename); // 安装wgt包
        } else {
            console.log("下载wgt失败！");
            plus.nativeUI.alert("下载wgt失败！");
        }
        plus.nativeUI.closeWaiting();
    }).start();
}