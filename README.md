# aliddns

aliddns by nodejs

## 使用方式

### 下载代码

```sh
git clone https://github.com/yu122/aliddns.git

cd aliddns
```

### 修改配置文件config.js

```js
module.exports = {
        "accessKeyId":"ABCDABCDABCDABCDABCDABCD",//阿里云网站-访问控制-创建用户，添加权限：管理云解析（DNS）的权限-创建AccessKey，得到accessKeyId和accessKeySecret
        "accessKeySecret":"ABCDEABCDEABCDEABCDEABCDEABCDE",
        "intervalTime":60000,//dns更新频率，毫秒为单位60000就是1分钟更新一次
        "params":{
                "DomainName": "example.com"//为购买的域名
        },
        "sonDomainName":"sub"//需要更新的子域名前缀，比如你的域名是wenku.baidu.com那么这里就是wenku
}
```

### 安装依赖，运行

```sh
npm run install
```

#### 直接运行

```sh
node ./app.js
```

#### docker运行

```sh
# 构建docker镜像
docker build -t imagename .
# 启动运行 设置自动重启，断电开机后自动运行
docker run -d --name aliddns --restart=always imagename
```