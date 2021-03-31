const Core = require('@alicloud/pop-core');
const axios = require('axios');
const config = require('./config.js');
const publicIp = require('public-ip');
var client = new Core({
  accessKeyId: config.accessKeyId,
  accessKeySecret: config.accessKeySecret,
  endpoint: 'https://alidns.aliyuncs.com',
  apiVersion: '2015-01-09',
});
const serverKey = config.serverKey
//定时检查更新记录值
//首次启动
console.log(new Date());
//间隔一定时间自动刷新 
setInterval(function () {
    console.log(new Date())
    ddns();
}, config.intervalTime);

//微信方糖通知
async function sendNotify (text) {
    if(!serverKey) return;
    var params = new URLSearchParams();
    params.append('text', text +"  " +new Date().toLocaleDateString());   
    params.append('desp', text);   
    const axiosConfig ={
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
    await axios.post(`https://sc.ftqq.com/${serverKey}.send`,params,axiosConfig)
    .then(res => {

        console.log(res)
    })
    .catch(err => {
        console.error(err); 
    })
}
// 取重复的ip
function refrain(arr){
    let map=new Map();
    let key=arr[0],
        value=1;
    arr.forEach((item)=>{
        if(map.get(item)!==undefined){
            let num=map.get(item);
            map.set(item,++num);
        }else{
            map.set(item,1);
        }
        if (map.get(item) > value) {
            key = item;
            value = map.get(item);
        }
    });
   return key
}

function ddns() {
  var params = config.params;
  var requestOption = {
    method: 'POST',
  };
  client.request('DescribeDomainRecords', params, requestOption).then(
    result => {
      //获取阿里云记录的ip地址
      targetDomainInfo = result.DomainRecords.Record.find(function (x) {
        return x.RR === config.sonDomainName;
      });
      console.log('阿里记录：', targetDomainInfo.Value);
      var regIp = /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/gi;
      // 获取本机ip
      // TODO url全部挂了 gg
      Promise.all([
        axios
          .get('https://ip.cn/api/index?ip=&type=0')
          .then(res => res.data.ip),
        axios.get('https://jsonip.com').then(res => res.data.ip),
        axios
          .get('http://pv.sohu.com/cityjson')
          .then(res => res.data.match(regIp)[0] || ''),
        axios
          .get('http://members.3322.org/dyndns/getip')
          .then(res => res.data.trim()),
        publicIp.v4(),
      ])
        .then(function (response) {
         let ip=refrain(response)
         console.log("本地ip：",ip);
         if(ip!=targetDomainInfo.Value){
              sendNotify(`最新ip：${ip}`)
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
        });
    },
    ex => {
      console.log(ex);
    }
  );
}
ddns();
