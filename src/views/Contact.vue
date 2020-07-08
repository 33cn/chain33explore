<template>
	<div class="contant">
		<!-- 标题 -->
		<div class="title">
			联系我们
		</div>
		<!-- 滑动 -->
		<div class="slide">
      <ul>
        <li v-for='(item,index) in ulList' @click="getSrcimg(index)" :key="item.tit">
          <div :class='{active:index == nice}'>
            <i :class="'iconfont'+' '+item.icon"></i>
          </div>
          <span>
            {{item.name}}
          </span>
        </li>
      </ul>
		</div>
		<!-- 二维码 -->
		<div class="erweima flex-center">
			<img :src="this.imgSrc" height="384" width="369" alt="">
		</div>
    <p>{{srcName}}</p>
    <p class="sao">扫一扫 联系我们</p>
	</div>
</template>
<script>
export default {
  data() {
    return {
      ulList: [
        {
          icon: "icon-weixin",
          name: "微信",
          src: require("../assets/images/yfx.png"),
          tit: "yfx0323"
        },
        {
          icon: "icon-weixingongzhonghao",
          name: "微信公众号",
          src: require("../assets/images/bty.png"),
          tit: "比特元Bityuan"
        },
        {
          icon: "icon-QQ",
          name: "QQ",
          src: require("../assets/images/QQ.png"),
          tit: "238866636"
        },
        {
          icon: "icon-twitter",
          name: "Twitter",
          src: require("../assets/images/Twitter.png"),
          tit: "Twitter"
        },
        {
          icon: "icon-kefu",
          name: "BItciontalk",
          src: require("../assets/images/Bitciontalk.png"),
          tit: "BItciontalk"
        },
        {
          icon: "icon-qun",
          name: "电报群",
          src: require("../assets/images/telegraph.png"),
          tit: "电报群"
        }
      ],
      imgSrc: require("../assets/images/yfx.png"),
      srcName: "微信",
      nice: "0"
    };
  },
  methods: {
    getSrcimg(e) {
      this.nice = e;
      this.imgSrc = this.ulList[e].src;
      this.srcName = this.ulList[e].tit;
    }
  }
};
</script>
<style lang="scss">
.contant {
  position: absolute;
  width: 100vw;
  top: 12vw;
  bottom: 0;
  padding-top: 20px;
  padding-bottom: 20px;
  background: #fff;
  // color: #fff;
  .title {
    width: 145px;
    height: 38px;
    color: #838B9E;
    // border: 1px solid #3e3b4d;
    text-align: center;
    font-size: 19px;
    line-height: 39px;
    margin: 0 auto;
  }
  .slide::-webkit-scrollbar {
    display: none;
  }
  .slide {
    margin-top: 1vw;
    width: auto;
    // padding:0 5vw;
    // overflow-x: auto;
    ul {
      padding-bottom: 10vw;
      padding-left: 1vw;
      width: 95vw;
      margin: 0 auto;
      // overflow: auto;
      li {
        display: inline-block;
        // float: left;
        text-align: center;
        padding: 0 7.5vw;
        div {
          margin: 2vw auto;
          border-radius: 50%;
          // background: rgba(255, 255, 255, 0.1);
          width: 15vw;
          height: 15vw;
          i {
            color: #DAA837;
            font-size: 10vw;
            line-height: 15vw;
          }
        }
        .active {
          background: #DAA837;
          i {
            color: #fff;
          }
        }
      }
    }
  }
  .erweima {
    width: 54vw;
    height: 54vw;
    /*height: 331px;*/
    background: #fff;
    margin: 0 auto;
    text-align: center;
    box-shadow:0px 3px 9px 0px rgba(217,217,217,1);
    img {
      // margin: 2.5vw 0 0 0;
      width: 52vw;
      height: 52vw;
    }
  }
  p {
    text-align: center;
    color: #333;
    font-size: 20px;
    margin-top: 20px;
  }
  .sao {
    color: #999;
    font-size: 16px;
    margin-top: 10px;
    padding-bottom: 10px;
  }
}
</style>