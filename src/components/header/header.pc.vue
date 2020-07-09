<template>
  <div class="head">
    <div class="head-content min-center">
      <img :src="logo">
      <ul id="selectUl">
        <li :class="{active: $route.path ==='/index'}" @click="indexState('index')">首页</li>
        <li
          :class="{active: $route.path ==='/block'||$route.path ==='/blockDetail'}"
          @click="indexState('block')"
        >区块</li>
        <li :class="{active: $route.path ==='/token'}" @click="indexState('token')">Token</li>
        <li :class="{active: $route.path ==='/pushtx'}" @click="indexState('pushtx')">广播交易</li>
      </ul>
      <div class="search-box">
        <search/>
      </div>
      <!-- <setting class="setting-in-pc" /> -->
    </div>
  </div>
</template>
<script >
import Search from "../search.vue";
import headerBase from "./header.base.js";
export default {
  mixins: [headerBase],
  components: {
    search: Search
  },
  data() {
    return {
      searchValue: "",
      searchFocus: false,
      lang: "",
      language: [
        {
          label: "中文",
          value: "cn"
        },
        {
          label: "英文",
          value: "en"
        }
      ]
    };
  },
  watch: {},
  computed: {
    provider() {
      return this.$store.state.apiSetting.provider;
    },
    logo(){
      return this.$store.getters.getStyle==='white'? require('../../assets/images/chain33.png'):require('../../assets/images/chain33-b.png')
    }
  },
  methods: {
    indexState: function(inner) {
      //标题栏的
      switch (inner) {
        case "index":
          this.$router.push({ path: "/index" });
          break;
        case "block":
          this.$router.push({ path: "/block" });
          break;
        case "nodes":
          this.$router.push({ path: "/nodes" });
          break;
        case "pushtx":
          this.$router.push({ path: "/pushtx" });
          break;
        case "token":
          this.$router.push({ path: "/token" });
          break;
        default:
          this.$router.push({ path: "/index" });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.head {
  height: 79px;
  line-height: 60px;
  position: relative;
  width: 100%;
  min-width: 1300px;
  .head-content {
    height: 100%;
    padding-left: 20px;
    position: relative;
    img {
      height: 24px;
      margin-top: 25px;
      float: left;
      cursor: pointer;
    }
    .brand-name {
      height: 79px;
      line-height: 79px;
      float: left;
      margin-left: 10px;
      font-size: 18px;
      font-weight: 550;
    }
    ul {
      height: 79px;
      line-height: 79px;
      float: left;
      margin-left: 63px;
      li {
        min-width: 80px;
        // max-width: 100px;
        display: inline-block;
        margin-left: 10px;
        font-size: 16px;
        height: 34px;
        line-height: 34px;
        border-radius: 2px;
        text-align: center;
        cursor: pointer;
        // background-color: rgb(17, 17, 17) !important;
        &.active {
          background-color: #d9a73a;
        }
      }
    }
  }
}
.setting-in-pc {
  height: 75px;
  line-height: 75px;
  margin-left: 12px;
}
</style>

<style lang="scss">
.head {
  background-color: $black_bg_deepblue;
  i.search {
    color: #fff;
  }
  .head-content li {
    color: #fff;
    &.active {
      color: #212633;
    }
  }
  .brand-name {
    color: #dadada;
  }
  input.search {
    color: #dadada;
    border: 1px solid #fff;
    background: #212633;
  }
  input::-webkit-input-placeholder {
    color: #dadada;
  }
  .search-box {
    display: inline-block;
    position: absolute;
    z-index: 201;
    right: 100px;
    width: 416px;
    .search-component {
      input.search {
        height: 40px;
        width: 416px;
        position: absolute;
        font-size: 14px;
        top: 47%;
        right: 15px;
        margin-top: -17.5px;
        border-radius: 30px;
        padding-left: 47px;
        padding-right: 25px;
      }
      i.search {
        height: 79px;
        line-height: 79px;
        font-size: 27px;
        position: relative;
        // left:250px;
        z-index: 2;
      }
    }
  }
}
</style>
