import { getBTYmsg, getBTYdetail } from "@/assets/js/api"
export default {
  filters:{
    officialWeb:function(web){
      if(web === ''){
        return '暂无'
      }else{
        return web
      }
    }
  },
  data(){
    return{
      coinSearchValue:'',
      token:'',
      total:0,
      price:'',
      official:'',
      currentPage:1,
      pageSize:8,
      createdTime:'',
      tradeHash:[],
      tradeInfo:[],
      tradeList:[],
      icon:'',
      showIcon:false,
      bottomLoading:true,
      isSearch:false,
      tokenArrParams : {
        addr : '',
        // 指定token
        symbol : '',                
        // 分页等相关， 同 GetTxByAddr 请求参数
        direction : 0,
        height : -1,
        flag : 0,
        index : 0,
        count : 8
      },
      isLast:1,
      forward:false,
      firstHeight:''
    }
  },
  mounted(){
    this.token = this.$route.query.TokenName
    this.coinSearchValue = this.$route.query.address || ''
    this.getTxByToken(this.token,this.coinSearchValue)
    this.getToken(this.token)
    this.getBTY(this.token)
  },
  methods:{
    //分页
    PageChange(val){
        switch (val){
          case 'first':
              this.isLast = 1
              this.forward = false
              this.tokenArrParams.direction = 0
              this.tokenArrParams.height = -1
              this.getTxByToken(this.token,this.coinSearchValue)              
            break;
          case 'last':
              this.isLast = 3
              this.forward = true
              this.tokenArrParams.direction = 1
              this.tokenArrParams.height = -1
              this.getTxByToken(this.token,this.coinSearchValue)
            break;
          case 'pre':
            if(this.isLast!==1&&this.isLast!==5&&this.isLast!==4){
              this.isLast = 2
              this.forward = true
              this.tokenArrParams.direction = 1
              this.tokenArrParams.height = this.tradeInfo[0].height
              this.tokenArrParams.index = this.tradeInfo[0].index
              this.getTxByToken(this.token,this.coinSearchValue)             
            }
            break;
          case 'next':
            if(this.isLast!==3&&this.isLast!==5&&this.isLast!==4){
              this.isLast = 2
              this.forward = false
              this.tokenArrParams.direction = 0
              this.tokenArrParams.height = this.tradeInfo[this.tradeInfo.length-1].height
              this.tokenArrParams.index = this.tradeInfo[this.tradeInfo.length-1].index
              this.getTxByToken(this.token,this.coinSearchValue)              
            }
            break;
          default:
            break
        }
    },
    //跳转官网
    toOfficial(web){
      if(web!==''){
        window.open(web,"_blank")
      }
    },
    //获取token信息
    getBTY(symbol){
      getBTYmsg(symbol).then((data)=>{
        if(data.code===0){
          this.icon = data.data[0].icon
          if(this.icon!==''){
            this.showIcon = true
          }
          this.price = data.data[0].rmb
          this.getBTYdetailmsg(data.data[0].id)          
        }else{
          this.showIcon = false
          this.price = 0
        }
      })
    },
    //获取token官网
    getBTYdetailmsg(id){
      getBTYdetail(id).then((data)=>{
        this.official = data.data.official
      })
    },
    //获取token详情
    getToken(token){
      this.$chain33Rpc.getTokenInfo(token).then((data) => {
        if(data.error===null){
          this.total = data.result.total
          this.createdTime = data.result.createdTime          
        }else{
          this.total = 0
          this.createdTime = ''
        }
      })
    },
    //获取token相关交易信息
    getTxByToken(token,address){
      this.tradeHash = []
      this.tradeInfo = []
      this.tradeList = []
      this.tokenArrParams.symbol = token
      this.tokenArrParams.addr = address
      if(address!==''&&address) this.$router.push(`/tokenDetail?TokenName=${token}&&address=${address}`)
      else this.$router.push(`/tokenDetail?TokenName=${token}`)
      //未替换，参数待定
      this.$chain33Rpc.getTxByToken(this.tokenArrParams).then((data) => {
        if(data.error === null){
          let sum = data.result.txInfos.length
          if(this.isLast===1){
            this.firstHeight = data.result.txInfos[0].hash
          }          
          data.result.txInfos.map((current) =>{
            this.tradeHash.push(current.hash)
            this.tradeInfo.push(current)
          })
          if(this.firstHeight === this.tradeHash[sum-1]){
            this.isLast = 1
          }
          if(sum<8&&this.isLast===2){
            this.isLast = this.forward === true? 1 : 3
          }else if(sum<8&&this.isLast===1){
            this.isLast = 4
          }
          this.getTradeMsg()          
        }else{
          this.isLast = 5
          this.bottomLoading = false
        }
      }).catch(()=>{
        this.$notify({
          title: '提示',
          message: "正在升级节点版本，请稍后查询",
          type: 'warning'
        })
      })
    },
    //获取交易详情列表
    getTradeMsg() {
      if(this.forward === true){
        this.tradeHash = this.tradeHash.reverse()
        this.tradeInfo = this.tradeInfo.reverse()
      }
      let hashArr = this.tradeHash
      this.$chain33Rpc.getTxByHashes(hashArr).then((data) => {
        this.tradeList = data.result.txs
      }).catch(() => {
        this.bottomLoading = false;
      })
    },
    handleCurrentChange(val){
      this.currentPage = val
    },
    //搜索个人地址
    searchHash(token,address){
      this.tradeList = []
      if(address!=''){
        this.isSearch = true
      }else{
        this.isSearch = false
      }
      this.getTxByToken(token,address)
    },
  },
}