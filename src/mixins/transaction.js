// import { errorMsg } from '@/assets/js/errorMsg.js'
import errorMsg from 'chain33errori18n'
export default {
  data() {
    return {
      param: "",
      result: "",
      isMobile: false
    }
  },
  methods: {
    dealMsg(data) {
      if (data.error == null) {
        this.result = data.result;
        this.$notify({
          title: "提示",
          message: "成功",
          type: "success"
        });
      } else {
        this.$notify({
          title: "提示",
          message: errorMsg(data.error),
          type: "warning"
        });
      }
    },
    getTransaction(type) {
      // 去掉首尾空格
      this.param = this.param.trim()

      if (!this.param) {
        this.$notify({
          title: '提示',
          message: "交易文本不能为空",
          type: 'warning'
        })
        return false;
      }
      if (this.param.slice(0, 2) === '0x') this.param = this.param.slice(2, this.param.length)
      if (!/^[0-9a-fA-F]+$/.test(this.param)) {
        this.$notify({
          title: '提示',
          message: "格式错误，请填写交易的十六进制格式文本",
          type: 'warning'
        })
        return false;
      }

      if (type === 'Ptx') {
        this.$chain33Rpc.sendTransaction(this.param).then(data => {
          this.dealMsg(data)
        });
      } else {
        this.$chain33Rpc.decodeRawTransaction(this.param).then((data) => {
          this.dealMsg(data)
        });
      }
    }
  },
  mounted() {
    this.isMobile = this.$store.state.isMobile
  }
}