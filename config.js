module.exports = {
        "accessKeyId":"ABCDABCDABCDABCDABCDABCD",//阿里云网站-访问控制-创建用户，添加权限：管理云解析（DNS）的权限-创建AccessKey，得到accessKeyId和accessKeySecret
        "accessKeySecret":"ABCDEABCDEABCDEABCDEABCDEABCDE",
        "serverKey":"xxxxxxxxxxx",//http://sc.ftqq.com/ 微信推送 可选
        "intervalTime":60000,//dns更新频率，毫秒为单位60000就是1分钟更新一次
        "params":{
                "DomainName": "example.com"//为购买的域名
        },
        "sonDomainName":"sub"//需要更新的子域名前缀，比如你的域名是wenku.baidu.com那么这里就是wenku
}