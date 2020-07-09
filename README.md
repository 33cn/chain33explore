# Chain33 区块链浏览器
    此项目为配合Chain33底层区块链进行数据页面端查询展示。


## Project setup

### 安装
```
npm install
```

### 运行
默认会运行一个测试节点
```
npm run dev
```

### 打包
```
npm run build
```

## 配置相关

配置文件为根目录下.env文件，若对链上主coins样式名称无要求，仅修改节点地址VUE_APP_DEFAULT_PROVIDER即可快速打包部署。

```
# 节点地址
VUE_APP_DEFAULT_PROVIDER=http://47.75.33.69:8901

# 默认的执行器，主链是token，平行链是user.p.xxx.token
VUE_APP_DEFAULT_EXECER=token

# coins名称，为链上主coins，不写默认为Base
VUE_APP_DEFAULT_COIN=Base

# coins图标，对应coins的图标，路径在public/baseCoin下，不换默认为基础图标
VUE_APP_DEFAULT_ICON=baseCoin.png
```