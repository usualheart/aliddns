const Core = require('@alicloud/pop-core');
const axios = require('axios');
const config=require('./config.js')
var client = new Core({
  accessKeyId: config.accessKeyId,
  accessKeySecret: config.accessKeySecret,
  endpoint: 'https://alidns.aliyuncs.com',
  apiVersion: '2015-01-09'
});
//定时检查更新记录值
//首次启动
console.log(new Date())
ddns();
//间隔一定时间自动刷新
setInterval(function () {
    console.log(new Date())
    ddns();
}, config.intervalTime);
function ddns(){
    var params = config.params;
    var requestOption = {
    method: 'POST'
    };
    client.request('DescribeDomainRecords', params, requestOption).then((result) => {
    //获取阿里云记录的ip地址
    targetDomainInfo=result.DomainRecords.Record.find(function (x) {
        return x.RR === config.sonDomainName
    });
    console.log("阿里记录：",targetDomainInfo.Value);

    // 这里使用jsonip.com第三方接口获取本地IP
    var jsonip = "https://jsonip.com/";
    // 接口返回结果
    var ip = "";
    axios.get(jsonip)
    .then(function (response) {
       // console.log(response.data);
        ip=response.data.ip;
        console.log("本地ip：",ip);
        if(ip!=targetDomainInfo.Value){
            var newParams=params;
            newParams.RR=targetDomainInfo.RR;
            newParams.RecordId=targetDomainInfo.RecordId;
            newParams.Type=targetDomainInfo.Type;
            newParams.Value=ip;
            client.request('UpdateDomainRecord', newParams, requestOption).then((result) => {
                console.log("更新成功：",JSON.stringify(result));
            }, (ex) => {
                console.log(ex);
            })
            
        }
    })
    .catch(function (error) {
        console.log(error);
    })
    }, (ex) => {
    console.log(ex);
    })
}
