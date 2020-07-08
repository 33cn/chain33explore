# 比特元区块链浏览器

# 子页面 -- 比特大学证书查询浏览器

certificate.html

实现要点：  
  - 兼容pc
  - 查询证书实际上是根据一个交易的hash查询一笔交易，解析交易得到证书信息
  - 生成证书图片
    - title： 区块链一级咨询证书
    - name: 中文+拼音
    - content: 英文/中文
    - no: 数字
    - hash: txHash
    - qrcode: https://mainnet.bityuan.com/certificate.html?hash=xxxxxx
  - 仅可查询证书信息，若查不到显示证书不存在
  - 判断为证书的条件：from的地址固定为 addressA 交易解析出来的字段是齐全的

请求证书的照片：
post
参数certificateNo
http://192.168.33.213:8089/certificate/get-img
这是测试环境的接口地址
返回 res.data.img

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### 1. 项目介绍

比特元BTY - 区块链浏览器 - 合并版

原pc版仓库地址：git@gitlab.33.cn:aohuoyun/btyBlock.git  
原mobile版仓库地址：git@gitlab.33.cn:aohuoyun/yd_bty.git  

域名：
- mainnet.bityuan.com  主网浏览器 
    - 使用 npm run build 打包
- 33bty.app 主网浏览器 同上
- testnet.bityuan.com 测试网浏览器 
    - 使用 npm run build:dynamic 打包 
    - 使用 npm run deploy:testnet 打包并部署到测试服
- parallel.bityuan.com 通用版浏览器 
    - 使用 npm run build:parallel 
    - 使用 npm run deploy:parallel 打包并部署到测试服

关联项目(打包后交给对应的项目方)：
- 国盾豆子浏览器 使用 npm run build:douzi 打包
- sto 使用 npm run build:sto 打包
- 敢么 使用 npm run build:ganme 打包

### 2. 项目资源
- 文档
    - [产品文档](https://t7dffh.axshare.com) 密码33fuzamei 产品戴涛
    - [ui文档](https://lanhuapp.com/url/ntXvc) 设计师王珍
    - [jira地址](https://jira.33.cn/secure/RapidBoard.jspa?rapidView=35&projectKey=BIT&view=detail&selectedIssue=BIT-45)  BIT-71
    - confluence地址
    - [api文档地址](https://confluence.33.cn/pages/viewpage.action?pageId=3670318)
    - [币种信息api补充](https://doc.33.cn/project.do#/ffff-1528187631483-10163178175-0022/module/list)
- 接口
    - php币种测试接口 http://47.100.222.198:8983 朱春阳
    - php币种线上接口 http://47.100.222.198:8082

### 3. 项目地址

- 线上地址
	- 网站入口1 https://mainnet.bityuan.com 对应build之后的dist目录
	- 网站入口2 https://33bty.app 对应build之后的dist目录
    - api地址 https://mainnet.bityuan.com/api -> 120.79.156.149:8801
    - api地址 https://mainnet.bityuan.com/map -> 120.79.156.149:8333
    - 主链节点2 http://39.98.51.242:8901/

- 测试环境 47.74.190.154
    - https://testnet.bityuan.com
    - api地址 https://testnet.bityuan.com/api -> 114.55.101.159:8801
    - api地址 https://testnet.bityuan.com/map -> 114.55.101.159:8333
    - api 现已支持https https://114.55.101.159:8801 或者 https://testnode.bityuan.com:8801

# 插件相关文档
    * [vue](https://vuefe.cn/v2/guide/)
    * [vue-router](https://router.vuejs.org/zh-cn/)
    * [markdown插件](https://pandao.github.io/editor.md/)  
    * [中英切换插件](https://www.npmjs.com/package/vue-i18n)

# 功能测试

- 获取最新区块 & 交易详情

- 搜索(主网节点)
    - 0xb54f6fe9c577dbec9a774a747e4d251a7596afd04fd0c10ca7dc828285042929
    - b54f6fe9c577dbec9a774a747e4d251a7596afd04fd0c10ca7dc828285042929 

- markdown(主网节点)
    - 0x3fe62c498826dc5333079623cb89717fdc7d2e2cb574823f3b320b8ecb79e20e

- 比特大学证书哈希（主网节点）
    - "王海平-010120181124008": "0xa68e3c9f2b339ca878efc2908bd1703eced9ade6d2d5bb6e65c7f546eba58e11"
    - "崔义华-010120181124001": "0xc35d002a6b328e709214e6eb669fca16e9ce2b0366e120f7c3d25df0e3b364d0"

- 手机编号哈希（主网节点）
    - 0x267902f5454dc3c76dc0f0410ab3bf5b10dc21287d60798c7e59f1fc76bb09c0

- 敢吗哈希（主网节点）
    - 宣言哈希 0xae0521e9ccf7cae960bbc2b9c0d60df3dc87d27c48ab69dabff380852850379b
    - 协议哈希 0x3bce7ea6a2eda52dc9ed296a8d006d77cbdfa663e4618efc36e26460ae40ef48

- 含note备注哈希 （主网节点）
    - 0x25fc781d14b3f8ef899f7881ae73fd4e56ef54556e65eb6ee556ad00f60e0af5

- 多交易组区块哈希（主网节点）
    - 0x235ce8415e5010f3cd1a69d26e8f4be2aa4962ba54fc0362136f602818399881

- 交易解析
    - 0a05636f696e731246180a2a420a0342545910a08d061a0c74686973206973206e6f74652205746f6b656e2a2231396f7a796f55475041513973707346697a39434a666e55434665737a706146754620a08d063090abd1abf2f197af3e3a2231396f7a796f55475041513973707346697a39434a666e55434665737a7061467546   

```json
{
    "jsonrpc": "2.0",
    "id": 123123123121,
    "method": "Chain33.CreateRawTransaction",
    "params": [
        {
            "to": "19ozyoUGPAQ9spsFiz9CJfnUCFeszpaFuF",
            "amount": 100000,
            "fee": 100000,
            "note": "this is note",
            "isToken": false,
            "isWithdraw": false,
            "tokenSymbol": "BTY",
            "execName": "token"
        }
    ]
}
```

- 修改provider & execer

- 多重签名地址， 以3开头，版本大于6.0.2的节点才支持查询
    - https://chain.33.cn/document/115
    - testnet的地址 35bZddFf69H8h4Ww7BnZWsPtWETu5MHyBQ


### token增强版 改造

## 接口梳理

### 首页部分
- 区块信息列表
  - 接口：5.4 Chain33.GetHeaders ，5.3 Chain33.GetLastHeader
    - 增加出参字段：矿工地址 ，挖矿收益

- Token信息
  - 接口： 待定接口1
    - 入参：token名
      出参：该token的当前总量
            当前总市值
            当前总交易笔数
            单位价值（1Token=？CNY）
            该Token官网地址
            发行时间
            小数点

### 币种信息查询

- 入参

| name | type | required |
| -- | -- | -- |
| coinSymbols | Array | true |

example:
```json
{
    "coinSymbols": [
        "BTY",
        "BTC",
        "ETH",
    ]
}
```

- 返回

example：
```json
{
    "code":0,
    "count":1,
    "data":[
        {
            "id":"118",
            "sid":"Decred",
            "icon":"https://i-invdn-com.akamaized.net/ico_flags/80x80/decred.png",
            "name":"DCR",
            "nickname":"",
            "chain":"DCR",
            "low":58.812,
            "high":68.7615705,
            "last":61.21418919,
            "rmb":404.01364865399995
        }
    ],
    "time":0.03082108497619629
}
```

## 多重账户地址现有接口支持参数
  + 测试地址 35bZddFf69H8h4Ww7BnZWsPtWETu5MHyBQ
  + 测试交易哈希 1e306aa0a2cf0467a8beea3d7b24efba11261e8dfa6be5c998bb740142d0cbde

### 6
  + createAddr - 创建本多重签名账户的创建者地址
  + owners[] - 包含地址创建时的owner地址、相应权重weight
  + dailyLimits -  本多重签名账户的所有资产每日限额信息{symbol、execer、dailyLimit: 本资产的每日限额值，spentToday: 当天已经花费的资产值}
  + txCount - 本多重签名账户上的交易数量
  + requiredWeight - 本多重签名账户执行交易需要的权重
  
### 7
  + amount - 本多重签名账户当日各资产免密余额

### 8 
  + assets - 本多重账户地址下的所有资产信息

### tx.6 
  + 该多重签名地址下交易信息
    - txHash 交易哈希
    - executed 执行状态
    - txType 交易类型： 1：owner属性相关的交易 2:account属性相关的交易 3：转账相关的交易
    - confirmedOwner 确认此多重签名账户交易的owner列表{ ownerAddr: owner地址, weight: 权重 }

### tx.7 
  + weight -当前交易的权重值