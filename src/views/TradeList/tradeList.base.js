import {
  getBTYmsg, //获取token图标
} from '@/assets/js/api.js';
import {
  getTradeSymbol,
  addressCN
} from '@/assets/js/filters.js';
import display from '@/mixins/display.js'
import {
  Toast
} from "mint-ui"
export default {
  mixins: [display],
  data() {
    return {
      page: 1,
      startHeight: 0, //起始高度
      endHeight: 0, //结束高度
      txList: [], //交易列表数组
      isLoading: false,
      updateload: false,
      refreshTime: 0,
      loadTimes: 0,
      firstHeight: 0,
      SuccessToken: [],
      coin: require('../../assets/images/img/coin.png')
    }
  },
  computed: {
    maxHeight() {
      return this.$store.state.maxHeight
    }
  },
  watch: {
    isLoading(val) {
      if (val === false && this.page === 1) {
        this.refreshTime = setTimeout(() => {
          this.getLastBlock()
        }, 10000)
      }
    }
  },
  mounted: function () {
    this.getSuccessToken()
    this.getLastBlock()
  },
  methods: {
    // 校验地址合法性
    goAddress(adr) {
      if (!addressCN(adr)) {
        this.$router.push(`/addressDetail?address=${adr}`)
      } else {
        Toast('地址不合法')
      }
    },
    //下拉加载
    loadMore() {
      if (this.loadTimes >= 1) {
        clearTimeout(this.refreshTime)
        if (this.updateload === false) {
          this.updateload = true
          this.page = 2
          this.getBlocksHash()
        }
      }
    },
    //获取最新区块
    getLastBlock() {
      if (this.isLoading) return;
      this.isLoading = true;
      this.$chain33Rpc.getLastHeader().then((data) => {
        if (data.error === null) {
          if (data.result.height !== this.endHeight) {
            this.$store.commit('updateMaxHeight', data.result.height)
            this.getBlocksHash()
          } else {
            this.isLoading = false
          }
        } else {
          this.isLoading = false
          this.$notify({
            title: '提示',
            message: data.error,
            type: 'warning'
          })
        }
      })
    },
    //根据最新区块获取之后的10个区块的hash
    getBlocksHash() {
      let BlockHashArr = []
      if (this.endHeight === 0) {
        //首次请求获取10个区块
        this.endHeight = this.maxHeight
        this.startHeight = (this.endHeight - 9) < 0 ? 0 : (this.endHeight - 9)
        this.firstHeight = this.startHeight
      } else {
        //非首次请求获取更新的区块
        if (this.page === 1) {
          this.startHeight = this.endHeight
          this.endHeight = this.maxHeight
        } else {
          //下拉加载
          this.endHeight = this.firstHeight !== 0 ? this.firstHeight - 1 : this.startHeight - 1
          this.startHeight = (this.endHeight - 9) < 0 ? 0 : (this.endHeight - 9)
          this.firstHeight = 0
        }
      }
      if (this.endHeight <= 0) {
        this.isLoading = false
        this.updateload = false
        return
      }
      this.$chain33Rpc.getHeaders(this.startHeight, this.endHeight).then((data) => {
        if (data.error === null) {
          data.result.items.map((current) => {
            BlockHashArr.push(current.hash)
          })
          //获取区块下交易详情
          let txInfo = Promise.resolve(this.getTradeHashes(BlockHashArr))
          txInfo.then((res) => {
            let tx = res.reverse()
            if (this.page === 1) {
              tx = this.checkGroup(tx)
              this.txList = tx.concat(this.txList)
            } else {
              tx = this.checkGroup(tx)
              this.txList = this.txList.concat(tx)
            }
            if (this.txList.length < 15) {
              this.loadMore()
            }
            this.isLoading = false
            this.updateload = false
          })
        } else {
          this.isLoading = false
          this.updateload = false
          this.$notify({
            title: '提示',
            message: data.error,
            type: 'warning'
          })
        }
      }).then(() => {
        if (this.loadTimes <= 1) {
          this.loadTimes += 1
        }
      }).catch(() => {
        this.updateload = false
        this.isLoading = false
      })
    },
    //区分交易组
    checkGroup(arr) {
      arr.map((current, index) => {
        if (current.tx.groupCount > 1) {
          current.tradeG = 1 //0-非交易组，1-交易组，2-交易组末条, 3-交易组首条
          if (current.tx.fee !== 0) {
            current.tradeG = 3
          } else {
            if (index === 0) {
              current.tradeG = 2
            } else {
              current.tradeG = arr[index - 1].tx.fee !== 0 ? 2 : 1
            }
          }
        } else {
          current.tradeG = 0
        }
      })
      return arr
    },
    //功能函数=>根据传入的10个区块哈希返回交易详情数组
    getTradeHashes(hashArr) {
      let _this = this
      let tradeHashArr = []
      let promises = hashArr.map((current) => {
        return _this.$chain33Rpc.getBlockOverview(current).then((data) => {
          if (data.error === null) {
            return data.result.txHashes
          } else {
            _this.$notify({
              title: '提示',
              message: data.error,
              type: 'warning'
            })
          }
        })
      })
      //Promise.all方法获取序列hashes
      let tradeDetail = Promise.all(promises).then((res) => {
        res.map((current) => {
          tradeHashArr = tradeHashArr.concat(current)
        })
        let tradeInfo = []
        //根据hashes数组获取交易详情
        let e = this.$chain33Rpc.getTxByHashes(tradeHashArr).then((data) => {
          if (data.error === null) {
            tradeInfo = data.result.txs
            tradeInfo = tradeInfo.filter(item => item !== null)
            let b = this.filterToken(tradeInfo)
            return b
          } else {
            this.$notify({
              title: '提示',
              message: data.error,
              type: 'warning'
            })
          }
        })
        return e
      })
      return tradeDetail
    },
    //功能函数=>根据传入交易数组txs获取token图标
    filterToken(list) {
      //获取token名称
      let self = this
      let promises = list.map((current, index) => {
        let token = getTradeSymbol(current)
        return new Promise(function (resolve) {
          if (token !== self.$store.getters.baseCoin) {
            getBTYmsg(token).then((data) => {
              list[index].tokenName = token
              if (data.code === 0) {
                resolve(data.data[0].icon)
              } else {
                resolve('')
              }
            })
          } else {
            list[index].tokenName = ''
            current.tokenName = '--'
            resolve('')
          }
        })
      })
      let tradeDetail = Promise.all(promises).then((res) => {
        list.map((item, i) => {
          item.tokenSymbol = res[i]
        })
        return list
      })
      return tradeDetail
    },
    // 获取链上全部成功的token
    getSuccessToken() {
      this.$chain33Rpc.queryAllTokens().then(data => {
        if (data.error === null) {
          data.result.tokens.map(current => {
            this.SuccessToken.push(current.symbol)
          })
        }
      })
    },
    //查看token详情
    viewToken(token, to) {
      if (this.SuccessToken.indexOf(token) > -1) {
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
      // this.$router.push({ path: "/tokenDetail", query: { TokenName: token } });
    },
  },
  beforeDestroy() {
    clearTimeout(this.refreshTime);
  }
}