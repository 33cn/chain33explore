
import { tradeAccuracy } from "@/assets/js/common";
import { getTradeSymbol,addressCN } from "@/assets/js/filters";
import { getBTYmsg } from "@/assets/js/api";
import { Toast } from "mint-ui";

export default {
  data () {
    return {
      isloading:false,
      data: {
        Height: 0,
        Hash: ""
      },
      blockInfo: {},
      Txcount: "",
      blockTable: [],
      isShow: false,
      hashlist: [],
      pagesize: 10,
      pageIndex: 1,
      total: 0,
      maxHeight: 0,
      SuccessToken:[],
      tokenSymbol:[],
      symbol:[],
      ParallelChain:false,
      coin:require('../../assets/images/img/coin.png')
    }
  },
  watch: {
    $route() {
      this.reload();
    }
  },
  mounted: function() {
    this.reload();
    this.getSuccessToken();
    this.ParallelChain = this.$store.getters.isParallelChain
  },
  methods: {
    //地址添加中文校验
    goAddress(adr){
      if(!addressCN(adr)){
        this.$router.push(`/addressDetail?address=${adr}`)
      }else{
        Toast('地址不合法')
      }
    },
    symbolLink(){
      this.tokenSymbol = []
      this.blockTable.map((current,index)=>{
        let token = getTradeSymbol(current)
        if(token !==this.$store.getters.baseCoin){
          this.symbol[index] = token
          this.getSymbol(token,index)
        }else{
          this.symbol[index] = this.$store.getters.baseCoin
          this.tokenSymbol[index] = ''
        }
      })
    },
    //获取token图标
    getSymbol(token,index){
      getBTYmsg(token).then(data =>{
        if (data.code === 0) this.tokenSymbol.splice(index,1,data.data[0].icon)
        else this.tokenSymbol.splice(index,1,null)
      })
    },
    //初始化
    reload() {
      this.isloading = true
      this.maxHeight = sessionStorage.getItem("maxHeight");
      sessionStorage.setItem("detailHeight", Number(this.$route.query.height));
      if (this.$route.query.height >= 0) {
        this.data.Height = this.$route.query.height; //区块高度
        this.getblockDetail();
      } else {
        this.$notify({
          title: "提示",
          message: "传入参数有误!",
          type: "warning",
          duration: 1000
        });
        this.$router.push({ path: "/index" });
      }
    },
    /**
     * 判断交易的准确性
     * @param Actuator
     * @param ty
     */
    isTradeError(Actuator, ty) {
      tradeAccuracy(Actuator, ty,this.$store.getters.isParallelChain).then(res => {
        Actuator.isError = res
      })
    },
    goTradeHash: function(hash) {
      sessionStorage.setItem("pageIndex", this.pageIndex);
      this.$router.push({ path: "/tradeHash", query: { hash: hash } });
    },
    //查询高度
    selectblockdetail(height) {
      this.isShow = false
      this.blockTable = []
      this.$chain33Rpc.getLastHeader().then(data => {
        sessionStorage.setItem("maxHeight", Number(data.result.height));
        this.maxHeight = Number(data.result.height);
        this.$router.push({ path: "/blockDetail", query: { height: height } });
      });
    },
    getblockDetail: function() {
      this.$chain33Rpc.getBlockHash(Number(this.data.Height)).then(data => {
        if (data.error == null) {
          this.data.Hash = data.result.hash;
          this.getBlockInfo(data.result.hash);
        } else {
          this.$notify({
            title: "提示",
            message: data.error,
            type: "warning"
          });
        }
      });
    },
    getBlockInfo: function(hash) {
      //获取概况
      this.$chain33Rpc.getBlockOverview(hash).then(data => {
        if (data.error == null) {
          this.Txcount = data.result.txCount;
          this.blockInfo = data.result.head;
          this.hashlist = data.result.txHashes;
          if(this.hashlist === null){
            this.isShow = true
            this.isloading = false
            return
          }else{
            this.total = this.hashlist.length;
            if (this.total == 0) {
              this.isShow = true
              this.isloading = false
              return;
            }
            this.getBlockTable();            
          }
        } else {
          this.$notify({
            title: "提示",
            type: "warning",
            message: data.error
          });
        }
      });
    },
    //获取区块下的交易列表
    getBlockTable: function() {
      let hasharrlist = [];
      let array = [];
      this.blockTable = [];
      if (sessionStorage.getItem("pageIndex")) {
        this.pageIndex = Number(sessionStorage.getItem("pageIndex"));
      }
      if (this.hashlist.length <= this.pagesize) {
        for (let i = 0; i < this.hashlist.length; i++) {
          hasharrlist.push(this.hashlist[i]);
        }
      } else {
        if (
          this.hashlist.length < this.pageIndex * this.pagesize &&
          this.hashlist.length > (this.pageIndex - 1) * this.pagesize
        ) {
          for (
            let i = (this.pageIndex - 1) * this.pagesize;
            i < this.hashlist.length;
            i++
          ) {
            hasharrlist.push(this.hashlist[i]);
          }
        }
        if (this.hashlist.length >= this.pageIndex * this.pagesize) {
          for (
            let i = (this.pageIndex - 1) * this.pagesize;
            i < this.pageIndex * this.pagesize;
            i++
          ) {
            hasharrlist.push(this.hashlist[i]);
          }
        }
      }
      if (hasharrlist.length == 0) {
        return;
      }
      // let params = [{ hashes: hasharrlist, disableDetail: true }];
      this.$chain33Rpc.getTxByHashes(hasharrlist).then(data => {
        if (data.error == null) {
          array = data.result.txs;
          for (let i = 0; i < hasharrlist.length; i++) {
            array[i].hash = hasharrlist[i];
          }
          array = this.checkGroup(array)
          this.blockTable = array;
          this.isloading = false
          this.symbolLink()
          sessionStorage.removeItem("pageIndex");
        } else {
          this.$notify({
            title: "提示",
            type: "warning",
            message: data.error
          });
        }
      });
    },
    //区分交易组
    checkGroup(arr) {
      arr.map((current,index) => {
        if(current.tx.groupCount > 1){
          current.tradeG = 1    //0-非交易组，1-交易组，2-交易组末条, 3-交易组首条
          // current.tradeG = (current.tx.fee === 0 && arr[index-1].tx.fee!==0)? 2 : 1
          if(current.tx.fee!==0){
            current.tradeG = 2
          }else{
            if(index<arr.length-1){
              current.tradeG = arr[index+1].tx.fee!==0 ? 3 : 1
            }else{
              current.tradeG = 3
            }
          }
        }else{
          current.tradeG = 0
        }
      })
      return arr
    },
    // 获取创建成功的Token
    getSuccessToken(){
      this.$chain33Rpc.queryAllTokens().then( data => {
        if (data.error === null) {
          data.result.tokens.map(current => {
            this.SuccessToken.push(current.symbol)
          })
        }
      })
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getBlockTable();
    },
    success(){
      this.$message.success('复制成功')
    },
    error(){
      this.$message.error('复制失败') 
    },
    viewToken(token,to){
      if(this.SuccessToken.indexOf(token)>-1){
        if(to){
          this.$router.push({ path: "/tokenDetail", query: { TokenName: token } });
        }else{
          return true
        }
      }else return false
    },
  }
}