import {
  addressCN
} from '@/assets/js/filters';
import {
  tradeAccuracy
} from '@/assets/js/common';
import {
  Toast
} from "mint-ui";
export default {
  data() {
    return {
      hash: '',
      txNotFound: false,
      tradehInfo: {},
      tradehInfoState: "",
      tradehInfoTx: {},
      markdownContent: {
        value: ''
      },
      parallelData: ''
    }
  },
  watch: {
    '$route'() {
      this.parallelData = '';
      this.hash = this.$route.query.hash;
      this.getTradeDetail(this.hash);
    }
  },
  mounted: function () {
    this.hash = this.$route.query.hash;
    this.getTradeDetail(this.hash);
  },
  methods: {
    goAddress(adr) {
      if (!addressCN(adr)) {
        this.$router.push(`/addressDetail?address=${adr}`)
      } else {
        Toast('地址不合法')
      }
    },
    //获取交易详情
    getTradeDetail: function (hash) {
      this.$chain33Rpc.queryTransaction(hash).then((data) => {
        if (!data.result) {
          // 未查询到交易信息
          this.txNotFound = true
          return
        }
        this.tradehInfo = data.result;
        tradeAccuracy(data.result, data.result.receipt.ty, this.$store.getters.isParallelChain).then(res => {
          if (res) {
            this.tradehInfoState = this.$store.getters.isParallelChain ? "写入成功，执行失败" : '失败'
          } else {
            this.tradehInfoState = this.$store.getters.isParallelChain ? "写入成功，执行成功" : "成功";
          }
        })
        data.result.tx.nonce = data.result.tx.nonce.toString();
        this.tradehInfoTx = data.result.tx;
        if (this.tradehInfoTx.execer == 'user.write') {
          this.markdownContent.value = this.tradehInfoTx.payload.content;
        }
      });
    },
  }
}