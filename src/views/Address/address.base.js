import {
  getTradeSymbol,
  addressCN
} from "@/assets/js/filters";
import {
  tradeAccuracy
} from "@/assets/js/common";
import {
  getTokenMsgArr
} from "@/assets/js/api";
import {
  Toast
} from "mint-ui"
export default {
  data() {
    return {
      nodeVersion: '', //节点版本兼容
      //address信息
      addressInfo: {
        adr: this.$route.query.address,
        balance: 0,
        reciver: 0,
        txCount: 0,
      },
      SuccessToken: [],
      TokenBalance: [],
      BalanceSelect: '',
      totalValue: 0,
      //交易列表
      isloading: false,
      chooseToken: '全部',
      selectTokenSymbol: [{
        'symbol': '全部',
        'icon': ''
      }],
      chooseSymbol: {
        'symbol': '全部'
      },
      coin: require('../../assets/images/img/coin.png'),
      coinIcons: [],
      pageType: 1,
      firstTrade: '',
      lastTrade: '',
      TableList: [],
      selectIcon: '',
      Params: {
        addr: this.$route.query.address,
        symbol: '',
        // 分页等相关， 同 GetTxByAddr 请求参数
        direction: 0,
        height: -1,
        flag: 0,
        index: 1,
        count: 8
      }
    }
  },
  watch: {
    $route() {
      //参数进行初始化
      this.TokenBalance = [];
      this.BalanceSelect = '',
        this.chooseToken = '全部';
      this.selectTokenSymbol = [{
        'symbol': '全部',
        'icon': ''
      }];
      this.chooseSymbol = {
        'symbol': '全部'
      };
      this.totalValue = 0;
      this.addressInfo = {
        adr: this.$route.query.address,
        balance: 0,
        reciver: 0,
        txCount: 0,
      };
      this.Params = {
        addr: this.$route.query.address,
        symbol: '',
        direction: 0,
        height: -1,
        flag: 0,
        index: 1,
        count: 8
      }
      this.reload()
    }
  },
  mounted() {
    this.reload()
  },
  computed: {
    provider() {
      return this.$store.state.apiSetting.provider
    },
    execer() {
      return this.$store.state.apiSetting.execer
    },
  },
  methods: {
    reload() {
      this.getTxList('first')
      this.getAdrInfo()
      this.getTokenAssets()
      this.getSuccessToken()
      this.getLastHash()
    },
    // 获取链上创建成功的Token
    getSuccessToken() {
      let symbolArr = []
      let tokenArr = []
      this.$chain33Rpc.queryAllTokens().then(data => {
        if (this.checkRequest(data)) {
          this.SuccessToken = data.result.tokens
          this.SuccessToken.map(current => {
            symbolArr.push(current.symbol)
            tokenArr.push({
              'symbol': current.symbol,
              'icon': ''
            })
          })
          getTokenMsgArr(symbolArr).then(data => {
            data.data.map(current => {
              for (var i = 0; i < tokenArr.length; i++) {
                if (current.name === tokenArr[i].symbol) {
                  tokenArr[i].icon = current.icon
                }
              }
            })
            this.selectTokenSymbol = this.selectTokenSymbol.concat(tokenArr)
          })
          // if(this.provider!=='https://testnode.bityuan.com:8801') this.getTokenBalance(symbolArr)//测试链暂时不查,币种过多
        }
      })
    },
    // 获取地址信息
    getAdrInfo() {
      this.$chain33Rpc.getAddrOverview(this.addressInfo.adr).then(data => {
        if (this.checkRequest(data)) {
          this.addressInfo.balance = data.result.balance ? data.result.balance / 100000000 : 0
          this.addressInfo.reciver = data.result.reciver ? data.result.reciver / 100000000 : 0
          this.addressInfo.txCount = data.result.txCount
        }
      })
    },
    // 获取地址下Token余额
    getTokenAssets() {
      let tokens = []
      let infos = []
      this.$chain33Rpc.getAddrTokenAssets(this.addressInfo.adr, 'token').then(data => {
        if (data.error === null) {
          data.result.tokenAssets.map(current => {
            tokens.push(current.symbol)
            infos.push({
              balance: current.account.balance / 100000000,
              symbol: current.symbol
            })
          })
          getTokenMsgArr(tokens).then(res => {
            res.data.map(current => {
              for (let i = 0; i < infos.length; i++) {
                if (current.name === infos[i].symbol) {
                  infos[i].icon = current.icon
                  infos[i].rmb = current.rmb
                  infos[i].nickname = JSON.parse(current.nickname)['zh-CN'] === '' ? '' : JSON.parse(current.nickname)['zh-CN']
                  // infos[i].name = current.sid
                }
              }
            })
            infos.map(item => {
              this.SuccessToken.map(current => {
                if (current.symbol === item.symbol) item.name = current.name
              })
              if (item.balance > 0) {
                this.totalValue += item.balance * (item.rmb || 0)
                this.TokenBalance.push(item)
              }
            })
          })
        } else return
      })
    },
    // 代币余额显示过滤
    openList(val) {
      if (val) {
        this.BalanceSelect = ''
      } else {
        let num = this.BalanceSelect
        this.BalanceSelect = this.BalanceSelect !== '' ? this.TokenBalance[num].name + ' （' + this.TokenBalance[num].balance + ' ' + this.TokenBalance[num].symbol + '）' : ''
      }
    },
    // 筛选token交易记录
    searchToken(index) {
      this.chooseSymbol = this.selectTokenSymbol[index]
      this.pageType = 1
      if (this.chooseSymbol.symbol !== '全部') {
        this.Params.symbol = this.chooseSymbol.symbol
        this.getLastHash()
        this.PageChange('first')
      } else {
        this.Params.symbol = ''
        this.getLastHash()
        this.PageChange('first')
      }
    },
    // 获取交易列表
    getTxList(page) {
      this.isloading = true
      this.TableList = []
      let TxHashes = []
      if (this.chooseSymbol.symbol === '全部') {
        //根据地址获取交易
        this.$chain33Rpc.getTxByAddr(this.Params).then(data => {
          if (this.checkRequest(data)) {
            if (page === 'first') this.firstTrade = String(data.result.txInfos[0].hash)
            data.result.txInfos.map(current => {
              TxHashes.push(current.hash)
            })
            this.$chain33Rpc.getTxByHashes(TxHashes).then(tx => {
              this.TableList = this.Params.direction === 0 ? tx.result.txs : tx.result.txs.reverse()
              Promise.resolve(this.getSymbolIcon(this.TableList)).then(res => {
                if (res.length > 0) {
                  res.map(current => {
                    this.TableList[current.index].icon = current.icon
                  })
                }
                this.$forceUpdate();
              })
              this.checkPage()
              this.isloading = false
            }).catch(() => this.isloading = false)
          } else {
            this.isloading = false
          }
        }).catch(() => {
          this.isloading = false
        })
      } else {
        //根据token获取交易
        this.$chain33Rpc.getTxByToken(this.Params).then(res => {
          if (this.checkRequest(res)) {
            if (page === 'first') this.firstTrade = String(res.result.txInfos[0].hash)
            res.result.txInfos.map(current => {
              TxHashes.push(current.hash)
            })
            this.$chain33Rpc.getTxByHashes(TxHashes).then(tx => {
              this.TableList = this.Params.direction === 0 ? tx.result.txs : tx.result.txs.reverse()
              this.TableList.map(current => {
                current.icon = this.chooseSymbol.icon
              })
              this.checkPage()
              this.isloading = false
            }).catch(() => this.isloading = false)
          } else {
            this.isloading = false
          }
        }).catch(() => {
          this.isloading = false
        })
      }
    },
    // 获取Token图标
    getSymbolIcon(txArr) {
      let ListToken = []
      let Icons = []
      txArr.map((current, index) => {
        let token = getTradeSymbol(current)
        if (token !== this.$store.getters.baseCoin) {
          Icons.push(token)
          ListToken.push({
            'symbol': token,
            'index': index
          })
        }
      })
      if (ListToken.length > 0) {
        return getTokenMsgArr(Icons).then(res => {
          if (res.data.length > 0) {
            ListToken.map(current => {
              for (var i = 0; i < res.data.length; i++) {
                if (current.symbol === res.data[i].name) {
                  current.icon = res.data[i].icon
                }
              }
            })
            return ListToken
          } else return []
        })
      } else {
        return []
      }
    },
    // 判断页数
    checkPage() {
      if (this.TableList[0].txHash === this.firstTrade && this.TableList[this.TableList.length - 1].txHash === this.lastTrade) {
        this.pageType = 5
      } else if (this.TableList[0].txHash === this.firstTrade) {
        this.pageType = 1
      } else if (this.TableList[this.TableList.length - 1].txHash === this.lastTrade) {
        this.pageType = 4
      }
    },
    // 获取尾页hash，用作分页判断
    getLastHash() {
      this.lastTrade = ''
      let Param = {
        addr: this.$route.query.address,
        symbol: this.chooseSymbol.symbol === '全部' ? '' : this.chooseSymbol.symbol,
        direction: 1,
        height: -1,
        flag: 0,
        index: 1,
        count: 8
      }
      if (Param.symbol === '') {
        this.$chain33Rpc.getTxByAddr(Param).then(data => {
          if (this.checkRequest(data)) {
            this.lastTrade = data.result.txInfos[0].hash
          }
        })
      } else {
        this.$chain33Rpc.getTxByToken(Param).then(data => {
          if (this.checkRequest(data)) {
            this.lastTrade = data.result.txInfos[0].hash
          }
        })
      }
    },
    // 翻页
    PageChange(dir) {
      switch (dir) {
        case 'first':
          this.Params.direction = 0
          this.Params.height = -1
          this.Params.index = 0
          this.pageType = 1
          this.getTxList('first')
          break;
        case 'last':
          this.Params.direction = 1
          this.Params.height = -1
          this.Params.index = 0
          this.pageType = 4
          this.getTxList()
          break;
        case 'pre':
          if (this.pageType !== 1 && this.pageType !== 5) {
            this.Params.direction = 1
            this.Params.height = this.TableList[0].height
            this.Params.index = this.TableList[0].index
            this.pageType = 2
            this.getTxList()
          }
          break;
        case 'next':
          if (this.pageType !== 5 && this.pageType !== 4) {
            this.Params.direction = 0
            this.Params.height = this.TableList[this.TableList.length - 1].height
            this.Params.index = this.TableList[this.TableList.length - 1].index
            this.pageType = 3
            this.getTxList()
          }
          break;
        default:
          break
      }
    },
    // 判断数据获取正确
    checkRequest(data) {
      if (data.error === null) return true
    },
    checkToken(val) {
      return getTradeSymbol(val)
    },
    // 跳转token详情
    viewToken(token, to) {
      let tokens = []
      this.SuccessToken.map(current => {
        tokens.push(current.symbol)
      })
      if (tokens.indexOf(token) > -1) {
        if (to) {
          this.$router.push({
            path: '/tokenDetail',
            query: {
              TokenName: token
            }
          })
        } else {
          return true
        }
      } else return false
    },
    // 跳转地址
    linkAddr(adr) {
      if (adr !== this.addressInfo.adr) {
        if (!addressCN(adr)) {
          this.$router.push(`/addressDetail?address=${adr}`)
        } else {
          Toast('地址不合法')
        }
      }
    },
    // 复制成功
    success() {
      this.$message.success('复制成功')
    },
    /**
     * 判断交易的准确性
     * @param Actuator
     * @param ty
     */
    isTradeError(Actuator, ty) {
      tradeAccuracy(Actuator, ty, this.$store.getters.isParallelChain).then(res => {
        Actuator.isError = res
      })
    },
    // 导出excel
    exportExcel() {
      //列标题，逗号隔开，每一个逗号就是隔开一个单元格
      let str = `姓名,电话,邮箱\n`;
      //增加\t为了不让表格显示科学计数法或者其他格式
      for (let i = 0; i < this.TableList.length; i++) {
        for (let item in this.TableList[i]) {
          str += `${this.TableList[i][item] + '\t'},`;
        }
        str += '\n';
      }
      //encodeURIComponent解决中文乱码
      let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
      //通过创建a标签实现
      let link = document.createElement("a");
      link.href = uri;
      //对下载的文件命名
      link.download = "json数据表.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}