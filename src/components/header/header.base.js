
export default {
  data () {
    return {
      maxHeight:sessionStorage.getItem('maxHeight'),
      devType: (process.env.API_TYPE === "dev"),
      version:'',
      showTip:false
    }
  },
  mounted: function() {
    //处理正则判断的时候可能获取不到maxHeight的因素;
    if(this.$store.state.maxHeight==null||this.$store.state.maxHeight==undefined){
      this.getLastHeigh();
    }else{
      this.maxHeight=this.$store.state.maxHeight;
    }
  },
  methods: {
    getLastHeigh: function() {
      this.$chain33Rpc.getLastHeader().then((data) => {
        this.$store.commit('updateMaxHeight',Number(data.result.height))
        this.maxHeight=sessionStorage.getItem('maxHeight');
      });
    },
  }
}