<template>
<!-- 搜索  -->
	<div class="search-component">
    <i class="iconfont icon-sousuo search" @click="submit"></i>
		<input type="text" class="search" v-on:keyup.enter="submit" v-model="Value" placeholder="地址 / 交易哈希 / 区块高度">
	</div>
</template>
<script>
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      Value: "",
      height: 0,
      getLastHeighttime: 0
    };
  },
  mounted() {
    this.height = sessionStorage.getItem("maxHeight");
  },
  methods: {
    submit() {
      this.height = sessionStorage.getItem("maxHeight");
      var reg = /^[0-9]*[1-9][0-9]*$/;
      if (this.Value.trim() == "")
        return Toast("请输入交易哈希/区块哈希/地址/区块高度");
      if (reg.test(this.Value.trim()) || this.Value == 0) {
        if (Number(this.Value.trim()) <= Number(this.height)) {
          //判断两个高度差---int类型比较
          this.$chain33Rpc.getBlockHash(Number(this.Value)).then(data => {
            if (data.error == null) {
              this.$router.push({
                path: "/blockDetail",
                query: { height: this.Value.trim() }
              });
              this.Value = "";
            } else {
              Toast("输入信息有误，请重新输入");
              this.Value = "";
            }
          });
        } else {
          Toast("输入的高度不能超过最大高度!");
          this.Value = "";
        }
      } else {
        let e = this.Value.length;
        if (e === 66 || e === 64) {
          this.Value = e === 64? '0x' + this.Value : this.Value
          //交易的哈希值---地址64位字节加上16进制标示0x(共66位)
          this.$chain33Rpc.queryTransaction(this.Value).then(data => {
            if (data.error == null) {
              this.$router.push({
                path: "/tradeHash",
                query: { hash: this.Value }
              });
              this.Value = "";
            } else {
              //区块哈希
              this.$chain33Rpc.getBlockOverview(this.Value).then(data => {
                if (data.error == null) {
                  this.$router.push({
                    path: "/blockDetail",
                    query: { height: data.result.head.height }
                  });
                  this.Value = "";
                } else {
                  Toast("输入信息有误，请重新输入");
                  this.Value = "";
                }
              });
            }
          });
        } else {
          //地址
          this.$chain33Rpc.getAddrOverview(this.Value).then(data => {
            if (data.error == null) {
              this.$router.push({
                path: "/addressDetail",
                query: { address: this.Value, way: 0 }
              });
              this.Value = "";
            } else {
              Toast("输入信息有误，请重新输入");
              this.Value = "";
            }
          });
        }
      }
    }
  }
};
</script>