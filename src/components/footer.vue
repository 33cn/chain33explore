<template>
  <div class="footer flex-center">
      <!-- <p class="contact">联系我们</p> -->
      <ul>
        <li>
          <div class="ibox" @mouseover='isShowWX = true' @mouseout='isShowWX = false'><i class="iconfont icon-weixin"></i></div>
          <p class="name">微信</p>
          <div class="qrCode" v-if='isShowWX'>
            <img src="../assets/images/yfx.png"/>
            <p>yfx0323</p>
            <div class="triangle"></div>
          </div>
        </li>
        <li>
          <div class="ibox" @mouseover='isShowWXGZH = true' @mouseout='isShowWXGZH = false'>
            <i class="iconfont icon-weixingongzhonghao"></i>
          </div>
          <p class="name">微信公众号</p>
          <div class="qrCode" v-if="isShowWXGZH">
            <img src="../assets/images/bty.png"/>
            <p>比特元Bityuan</p>
            <div class="triangle"></div>
          </div>
        </li>
        <li>
          <div class="ibox" @mouseover='isShowQQ = true' @mouseout='isShowQQ = false'><i class="iconfont icon-QQ"></i></div>
          <p class="name">QQ</p>
          <div class="qrCode" v-if="isShowQQ">
            <img src="../assets/images/QQ.png"/>
            <p>238866636</p>
            <div class="triangle"></div>
          </div>
        </li>
        <li>
          <div class="ibox" @mouseover='isShowTwitter = true' @mouseout='isShowTwitter = false'><i class="iconfont icon-twitter"></i></div>
          <p class="name">Twitter</p>
          <div class="qrCode" v-if="isShowTwitter">
            <img src="../assets/images/Twitter.png"/>
            <p>Twitter</p>
            <div class="triangle"></div>
          </div>
        </li>
        <li>
          <div class="ibox" @mouseover='isShowBitciontalk = true' @mouseout='isShowBitciontalk = false'><i class="iconfont icon-kefu"></i></div>
          <p class="name">Bitciontalk</p>
          <div class="qrCode" v-if="isShowBitciontalk">
            <img src="../assets/images/Bitciontalk.png"/>
            <p>Bitciontalk</p>
            <div class="triangle"></div>
          </div>
        </li>
        <li>
          <div class="ibox" @mouseover='isShowTelegraph = true' @mouseout='isShowTelegraph = false'><i class="iconfont icon-qun"></i></div>
          <p class="name">电报群</p>
          <div class="qrCode" v-if="isShowTelegraph">
            <img src="../assets/images/telegraph.png"/>
            <p>电报群</p>
            <div class="triangle"></div>
          </div>
        </li>
      </ul>
    </div>
</template>
<script>
  export default {
  props:['black'],  
  data() {
    return {
      isShowWX:false,
      isShowWXGZH:false,
      isShowQQ:false,
      isShowTwitter:false,
      isShowBitciontalk:false,
      isShowTelegraph:false,
    }
  }
}
</script>
<style lang="scss" scoped>
   .footer{
    width: 100%;
    min-width:1300px;
    position:relative;
    bottom:0;
    height: 183px;
    >ul{
      min-width:1200px;
      height: 90px;
      // margin:45px auto;
      padding-left: 180px;
      li{ 
        margin-right: 95px;
        float: left;
        position: relative;
        font-size:14px;
        >div.ibox{
          width:60px;
          height:60px;
          // background-color: #4f4f4f;
          border-radius: 50%;
          text-align: center;
          line-height: 60px;
          cursor: pointer;
          i{
            font-size: 40px;
          }
        }
        >p.name{
          width:100%;
          margin-top: 11px;
          height: 14px;
          line-height: 14px;
          text-align: center;
        }
        >div.qrCode{
          width: 131px;
          height: 150px;
          position: absolute;
          top:-168px;
          background-color: #eeeeee;
          left: 0;
          margin-left: -35.5px;
          padding-top:9px;
          border-radius: 4px;
          padding-left: 6.5px;
          >p{
            width: 100%;
            font-size: 14px;
            color: #333;
            line-height: 14px;
            text-align: center;
            position: absolute;
            bottom: 5px;
            padding-right: 13px;
          }
          >div.triangle{
            width:0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-top: 10px solid #eeeeee;
            position: absolute;
            left: 50%;
            margin-left: -10px;
            bottom:-10px;
          }
        }
      }
    }
  }
</style>

<style lang="scss">
  .footer{
    background-color: #1A191D;
    div.ibox i,p.name{
      color:#5D5D5D;
    }
  }
</style>