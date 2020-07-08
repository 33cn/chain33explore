<template>
	<div class="trade">
	<div class="content">
		<!-- 标题 -->
    <comtitle title="交易详情" firstUrl="/index" firstUrlTitle="首页" secondUrl="/tradeList" secondUrlTitle="全部交易信息"></comtitle>
    <div class="h-title">
      <span></span><p>交易哈希</p>
    </div>
		<!-- 区块哈希 -->
		<div class="hash">
			<p>{{hash}}</p>
		</div>
		<!-- 标题 -->
    <div class="h-title">
      <span></span><p>交易详情</p>
    </div>
		<div class="allcention" v-if="txNotFound">
			<p class="placeholder-result tc">
				未查询到交易信息，<span class="c-link" @click="txNotFound=false;getTradeDetail(hash)">重试</span>
			</p>
		</div>
		<!-- 概况 -->
		<div class="allcention" v-else>
			<ul class="cention">
				<li class="cli">
					<span>接收状态</span>
					<span>{{tradehInfoState}}</span>	
				</li>
				<li class="cli">
					<span>区块高度</span>
					<router-link class="link" :to="{path:'/blockDetail', query:{'height':tradehInfo.height}}">{{tradehInfo.height}}</router-link>	
				</li>
				<li class="cli">
					<span>时间(GMT+8)</span>
					<p class="right-info">{{tradehInfo.blockTime | fulltime}}</p>	
				</li>
				<li class="cli">
					<span>来自</span>
					<div class="link auto right-info">
						<p class="link" @click="goAddress(tradehInfo.fromAddr)">{{tradehInfo.fromAddr}}</p>
					</div>
				</li>
				<li class="cli">
					<span>去向</span>
					<div class="link auto right-info">
						<p class="link" @click="goAddress(tradehInfoTx.to)">{{tradehInfoTx.to}}</p>
					</div>
				</li>
				<li class="cli">
					<span>价值</span>
					<p class="right-info">{{tradehInfo | getTradeValue}}</p>	
				</li>
				<li class="cli">
					<span>手续费</span>
					<span>{{tradehInfoTx.fee|filterFee}}</span>	
				</li>
				<li class="cli">
					<span>随机数</span>
					<p class="right-info">{{tradehInfoTx.nonce}}</p>	
				</li>
				<li class="cli">
					<span>执行器</span>
					<p class="right-info">{{tradehInfoTx.execer}}</p>	
				</li>
				<li class="cli">
					<span>调用函数</span>
					<span>{{tradehInfo.actionName === 'unknown'? 'none':tradehInfo.actionName}}</span>	
				</li>
				<li class="mian cli" v-if="tradehInfoTx.execer != 'user.write'">
					<span class="hundred">输入数据</span><br>
					<div class="kuai">
						<p><pre>{{tradehInfoTx | decodeTransferNote}}</pre></p>
					</div>
				</li>
				<li class="mian cli" v-if="tradehInfoTx.execer != 'user.write'">
					<span class="hundred">输出数据</span><br>
					<div class="kuai">
						<p><pre>{{tradehInfo.receipt}}</pre></p>
					</div>
				</li>
				<li class="mian cli" v-if="tradehInfoTx.execer != 'user.write'&&parallelData!==''">
					<span class="hundred">输出数据</span><br>
					<div class="kuai">
						<p><pre>{{parallelData.receipt}}</pre></p>
					</div>
				</li>
			</ul>
			<div class="writesdata" id="writesdata" v-if="tradehInfoTx.execer == 'user.write'">
				<markdown :content="markdownContent"></markdown>
			</div>
		</div>
	</div>
	</div>
</template>
<script>
import comtitle from "@/components/comtitle.vue"
import tradeHashBase from './tradeHash.base.js'
export default {
	components:{
		comtitle,
		markdown: () => import('@/components/markdown'),
	},
	mixins: [tradeHashBase]
}
</script>
<style lang="scss">
.trade{
  .content{
    padding: 0 3vw 5vw;
    .h-title{
      height: 10vw;
      line-height: 10vw;
      // background: #ccc;
      span{
        // float: left;
        border-left:.5vw solid #838B9E;
      }
      p{
        // float: left;
        font-size: 4.5vw;
        display: inline-block;
        margin-left: 3vw;
      }
    }
  }
	.hash{
		/*width: 100%;*/
		height: 10vw;
		background: #fff;
		padding: 0 2vw;
		overflow-x: auto;
		p{
			white-space: nowrap;  /*强制span不换行*/
			overflow-x: scroll;
			line-height: 10vw;
			color: #5D6187;
			font-size: 3.5vw;
		}
	}
	.hash::-webkit-scrollbar {
		display: none;
	}
	.allcention{
		background: #fff;
		// border:1px solid #eee;
		box-shadow:rgba(229,235,243,1) 0 0 3vw;
		.cli{
			height: 44px;
			line-height: 44px;
			border-bottom:1px solid #eee;
			span:nth-of-type(1){
				float: left;
				display: block;
				height: 44px;
				overflow-x: auto;
				max-width: 200px;
				width: 30%;
			}
			span {
				padding-left: 13px
			}
			.right-info{
				float: left;
				margin-left: 13px;
			}
			.auto{
				white-space: nowrap;
				float: left;
				display: block;
				height: 44px;
				overflow-y: auto;
				max-width: 200px;
				width: 60%;
				// margin-left: 13px;
			}
			.auto::-webkit-scrollbar {
				display: none;
			}
			.link{
				color: #0975a7;
			}
			span:nth-of-type(1){
				color: #838B9E;
			}
			a{
				width: 60%;
				padding-left: 13px;
			}
			
		}
		
		.mian{
			height: auto;
			padding-bottom: 10px;
			.kuai{
				/*width: 100%;*/
				height: 230px;
				padding-left: 13px;
				margin: 0 13px;
				background: #f9f9f9;
				border:1px solid #eee;
				color: #6e6e6e;
				word-wrap:break-word;
				overflow-y: auto;
				/*overflow: auto;*/
				p{
					width: 100%;
					pre{
						width: 100%;
						white-space: pre-wrap;
						word-wrap: break-word;
					}
				}
			}
		}
	}
	#writesdata{
		width: auto;
		overflow: hidden;
		padding: 10px;
		h1{
			font-weight:700;
		}
		h1,h2,h3,h4,h5,h6{
			span{
				width: 0;
			}
      a{
        display: block;
        text-align: left;
        width: 100%;
      }
    }
		li{
			border:0;
			overflow: hidden;
			height: auto;
			line-height: 30px;
		}
		img{
			max-width: 100%;
		}
	}
}
</style>