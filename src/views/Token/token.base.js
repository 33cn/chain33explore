import {
  getTokenMsgArr
} from '@/assets/js/api.js';
export default {
  data() {
    return {
      isShow: false,
      isLoading: false,
      tokenList: [],
      tableList: [],
      coinSelect: '',
      coinSelectIndex: '',
      coinName: [],
      total: 0,
      page: 1,
      pagesize: 10,
      hiddenIcon: false,
      hiddenDesc: false,
      coin: require('../../assets/images/img/coin.png')
    }
  },
  mounted: function () {
    this.SuccessToken();
  },
  methods: {
    //获取所有创建成功的token
    SuccessToken() {
      this.isLoading = true
      let tokenArr = []
      let hiddenArr = []
      this.$chain33Rpc.queryAllTokens().then((data) => {
        // 无token
        if (!data.result) {
          this.isShow = true
          this.isLoading = false
          return
        }
        this.tokenList = data.result.tokens
        // 隐藏无icon的token->请求全部token的icon，否则分页请求token
        if (this.hiddenIcon) {
          this.tableList = this.tokenList
        } else {
          this.tableList = this.tokenList.slice((this.page - 1) * this.pagesize, this.page * this.pagesize)
        }
        this.tableList.map((current, index) => {
          tokenArr.splice(index, 1, current.symbol)
        })
        getTokenMsgArr(tokenArr).then((data) => {
          if (data.code === 0) {
            data.data.map((current) => {
              for (var i = 0; i < tokenArr.length; i++) {
                if (current.name === tokenArr[i]) {
                  this.tableList[i].icon = current.icon
                  this.tableList[i].introduce = (current.introduce && JSON.parse(current.introduce)['zh-CN'] !== '') ? JSON.parse(current.introduce)['zh-CN'] : current.introduction
                  this.tableList[i].nickname = (current.nickname && JSON.parse(current.nickname)['zh-CN'] !== '') ? JSON.parse(current.nickname)['zh-CN'] : ''
                }
              }
            })
            this.total = this.tokenList.length
            if (this.hiddenIcon) {
              this.tableList.map((current) => {
                if (current.icon !== '' && current.icon !== undefined && current.icon !== null) {
                  hiddenArr.push(current)
                }
              })
              this.tableList = hiddenArr
              this.total = this.tableList.length
            }
          }
          this.isLoading = false
        }).then(() => {
          //检索tokenName过滤
          if (!this.hiddenIcon) {
            this.tokenList.map((current, index) => {
              this.coinName[index] = {
                'value': current.symbol,
                'index': index
              }
            })
          } else {
            this.tableList.map((current, index) => {
              this.coinName[index] = {
                'value': current.symbol,
                'index': index
              }
            })
          }
        })
      })
      // 指定添加的Token
      // this.total = 1
      // let TSC = {
      //   symbol: 'TSC',
      //   icon: require('../../assets/images/baseCoin/ts.png'),
      //   name: 'Travel Service Coin',
      //   introduce: '        TS社区通过微信小程序向消费者提供酒店、机票以及火车票预订服务，同时按交易金额送Token给消费者；TS社区正在由以太坊代币项目升级为独立的公链主网项目，公链白皮书、测试网、区块链浏览器以及钱包已经于2019年3月25日全部上线，钱包24H下载量超过8000，测试网交易转账正常，平均5秒内到账；TS公链准备构建出行Dapp生态，目前已经和69家国内互联网出行企业和开发团队达成了合作意向，第一批Dapp将于2019年5月31日之前上线，TS公链准备在2019年8月份做到中国Dapp生态活跃度前三。',
      //   createdTime: 1551369600
      // }
      // this.tableList.push(TSC)
    },
    //token搜索列表
    querySearch(queryString, cb) {
      var coinName = this.coinName;
      var results = queryString ? coinName.filter(this.createFilter(queryString)) : coinName;
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    //搜索token
    searchToken(token) {
      let tokenExsit = false
      this.coinName.findIndex((val) => {
        if (!tokenExsit) {
          if (val.value === token) {
            tokenExsit = true
          } else {
            tokenExsit = false
          }
        }
      })
      if (tokenExsit) {
        this.$router.push({
          path: '/tokenDetail',
          query: {
            TokenName: token
          }
        })
      } else {
        this.$notify({
          title: '提示',
          message: '没有此Token',
          type: 'warning'
        })
      }
    },
    //分页
    handleCurrentChange(val) {
      this.page = val
      if (this.hiddenIcon) {
        return
      } else {
        this.isLoading = true
        this.tableList = []
        let symbolArr = []
        this.tableList = this.tokenList.slice((this.page - 1) * this.pagesize, this.page * this.pagesize)
        this.tableList.map((current, index) => {
          symbolArr.splice(index, 1, current.symbol)
        })
        getTokenMsgArr(symbolArr).then((data) => {
          if (data.code === 0) {
            data.data.map((current) => {
              for (var i = 0; i < symbolArr.length; i++) {
                if (current.name === symbolArr[i]) {
                  this.tableList[i].icon = current.icon
                  this.tableList[i].introduce = (current.introduce && JSON.parse(current.introduce)['zh-CN'] !== '') ? JSON.parse(current.introduce)['zh-CN'] : current.introduction
                  this.tableList[i].nickname = (current.nickname && JSON.parse(current.nickname)['zh-CN'] !== '') ? JSON.parse(current.nickname)['zh-CN'] : ''
                }
              }
            })
          }
          this.isLoading = false
        })
      }
    }
  },
}