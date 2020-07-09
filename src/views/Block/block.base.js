import display from '@/mixins/display.js'
export default {
  mixins: [display],
  data() {
    return {
      newheigh: 0, //请求起始条数
      endHeight: 0, //请求结束条数
      BlockInfo: [],
      isLoading: false,
      getLastHeightTime: 0,
      ParallelChain: false,
      isUpdate: true,
      page: 1,
      pagesize: 20,
      total: 0,
    }
  },
  mounted() {
    this.ParallelChain = this.$store.getters.isParallelChain
    this.getLastBlock()
  },
  computed: {
    maxHeight() {
      return this.$store.state.maxHeight
    }
  },
  watch: {
    isLoading: function (val) {
      if (val === false && this.page === 1) {
        this.getLastHeightTime = setTimeout(() => {
          this.getLastBlock();
        }, 5000);
      }
    },
  },
  methods: {
    // 换页
    pagechange() {
      // 换页后清除定时器
      clearTimeout(this.getLastHeightTime)
      let newHeight = this.maxHeight - (this.page - 1) * this.pagesize
      this.isUpdate = false
      this.endHeight = 0
      this.BlockInfo = []
      this.getBlockInfo(newHeight)
    },
    //获取最新区块
    getLastBlock() {
      if (this.isLoading) return;
      this.isLoading = true;
      this.$chain33Rpc.getLastHeader().then((data) => {
        if (data.error === null) {
          if (data.result.height !== this.endHeight) {
            this.$store.commit('updateMaxHeight', data.result.height)
            this.total = this.maxHeight
            this.getBlockInfo(this.maxHeight)
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
      }).catch(() => {
        this.isLoading = false
      })
    },
    //更新区块
    getBlockInfo(endHeight) {
      this.isLoading = true;
      //首页更新
      if (this.endHeight === 0) {
        //首次,分页请求获取20个区块
        this.endHeight = endHeight
        this.startHeight = (this.endHeight - 19) >= 0 ? (this.endHeight - 19) : 0 //尾页判断
      } else {
        //非首次请求获取更新的区块
        this.startHeight = this.endHeight + 1
        this.endHeight = this.maxHeight
      }
      this.$chain33Rpc.getHeaders(this.startHeight, this.endHeight).then((data) => {
        if (data.error === null) {
          let info = data.result.items.reverse()
          if (this.isUpdate) {
            this.BlockInfo = info.concat(this.BlockInfo)
            if (this.BlockInfo.length > 20) this.BlockInfo.length = 20
          } else {
            this.BlockInfo = this.BlockInfo.concat(info)
          }
          this.isLoading = false
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
    //跳转非自增高度地址
    // goAddressDetail(height){
    //   if(height!==''){
    //     this.$router.push({"path":"/blockDetail", query:{'height':height}})
    //   }
    // },
  },
  beforeDestroy() {
    //清除定时器
    clearTimeout(this.getLastHeightTime);
  }
}