<template>
  <div class="header-m" ref="headerDom">
    <div class="top">
      <img src="../../assets/images/logo-white.png">
      <p v-if="showTip===true" class="tip">当前节点版本过低</p>
      <i @click="show = !show;" class="iconfont icon-caidan"></i>
    </div>
    <search/>
    <div class="ulcont" v-show="show">
      <ul>
        <li
          :class="{active:$route.path == item.src}"
          v-for="(item) in ulList"
          :key="item.src"
          @click="goLink(item.src)"
        >{{item.name}}</li>
      </ul>
    </div>
    <div class="bg" v-show="show" @click="show = false"></div>
  </div>
</template>
<script>
import Search from "../search.vue";
import headerBase from "./header.base.js";
export default {
  mixins: [headerBase],
  components: {
    search: Search
  },
  data() {
    return {
      ulList: [
        {
          name: "首页",
          src: "/index"
        },
        {
          name: "区块",
          src: "/block"
        },
        {
          name: "Token",
          src: "/token"
        },
        {
          name: "广播交易",
          src: "/pushtx"
        }
      ],
      show: false
    };
  },
  watch: {
    $route() {
      this.show = false;
      this.getLastHeigh();
    }
  },
  mounted() {
    window.addEventListener("scroll", () => (this.show = false));
    document.addEventListener("click", this.onDocumentClick);
  },
  destroyed: function() {
    document.removeEventListener("click", this.onDocumentClick);
  },
  methods: {
    goLink(url) {
      sessionStorage.removeItem("detailHeight");
      this.$router.push({ path: url });
      this.show = false;
    },
    onDocumentClick(e) {
      let el = this.$refs.headerDom;
      let target = e.target;
      if (el !== target && !el.contains(target)) {
        this.show = false;
      }
    }
  }
};
</script>
<style lang="scss">
.header-m {
  width: 100%;
  height: 24vw;
  z-index: 500;
  background: #fff;
  .top {
    height: 11vw;
    overflow: hidden;
    img {
      float: left;
      height: 7vw;
      margin: 2.5vw 0 0 13px;
    }
    > p {
      height: 12vw;
      line-height: 12vw;
      margin-left: 8px;
      float: left;
      color: #b7b7ad;
      font-size: 5vw;
    }
    .tip {
      line-height: 13vw;
      font-size: 3.5vw;
      color: #d71345;
    }
    i.icon-caidan {
      color: #686c92;
      float: right;
      font-size: 9vw;
      margin: 1.5vw 2vw 0 0;
    }
  }
  .ulcont {
    position: fixed;
    top: 0;
    width: 55%;
    height: 100%;
    z-index: 500;
    background: #fff;
    animation: sport 0.2s;
    -webkit-animation: sport 0.2s;
    animation-fill-mode: forwards;
    ul {
      li {
        padding-left: 13px;
        height: 60px;
        line-height: 60px;
        font-size: 14px;
        color: #000;
        text-align: center;
      }
      .active {
        color: #0a76a7;
        background: $mobile_light;
        color: #fff;
      }
    }
    .langBtn {
      width: 100%;
      margin-top: 40vw;
      text-align: center;
      .lang-zh,
      .lang-en {
        margin: 0 auto;
        width: 25.7vw;
        height: 8vw;
        line-height: 8vw;
        color: #000;
        border: 1px solid #a9acb1;
        border-radius: 20px;
      }
      .lang-en {
        margin-top: 10vw;
      }
      .lang-bg {
        background: $mobile_light;
        border: none;
        color: #fff;
      }
    }
  }
  .bg {
    position: fixed;
    top: 12vw;
    width: 100%;
    height: 100%;
    z-index: 12;
    background: rgba(0, 0, 0, 0.3);
  }
  .top > span {
    float: left;
    > i {
      font-size: 5vw;
      margin: 4vw 2vw 0 5vw;
    }
  }
  .setting-in-m {
    height: 100%;
    line-height: 45px;
    margin-left: 12px;
  }
  @keyframes sport {
    0% {
      transform: translateX(-40vw);
      opacity: 1;
    }
    25% {
      transform: translateX(-30vw);
      opacity: 1;
    }
    50% {
      transform: translateX(-15vw);
      opacity: 1;
    }
    75% {
      transform: translateX(-5vw);
      opacity: 1;
    }
    100% {
      transform: translateX(0vw);
      opacity: 1;
    }
  }
  //搜索框样式
  .search-component {
    width: 100vw;
    background: #fff;
    padding: 1vw 0;
    height: 12vw;
    text-align: center;
    input {
      // float: left;
      -webkit-appearance: none;
      width: 90vw;
      height: 10vw;
      color: #999;
      font-size: 3.5vw;
      border-radius: 3px;
      border: 1px solid #dcdcdc;
      border-radius: 20vw;
      padding: 0 10vw;
    }
    input::-webkit-input-placeholder {
      font-size: 3.5vw;
    }
    i {
      position: absolute;
      left: 7vw;
      line-height: 10vw;
      color: #838b9e;
      font-size: 7vw;
    }
  }
}
</style>