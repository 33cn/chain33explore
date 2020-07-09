import Vue from 'vue'
import Router from 'vue-router'

// 页面资源
// TODO 做成响应式 合并pc与mobile组件之间重复的代码
import mHome from '@/views/Home/Home.m.vue'
import pcHome from '@/views/Home/Home.pc.vue'

import Block from '@/views/Block/Block.vue'

import TradeList from '@/views/TradeList/TradeList.vue'

import mTradeHash from '@/views/TradeHash/TradeHash.m.vue'
import pcTradeHash from '@/views/TradeHash/TradeHash.pc.vue'

import mBlockDetail from '@/views/BlockDetail/BlockDetail.m.vue'
import pcBlockDetail from '@/views/BlockDetail/BlockDetail.pc.vue'

import mAddress from '@/views/Address/Address.m.vue'
import pcAddress from '@/views/Address/Address.pc.vue'

import Pushtx from '@/views/Pushtx.vue'

import DecodeTx from '@/views/DecodeTx.vue'

import mToken from '@/views/Token/Token.m.vue'
import pcToken from '@/views/Token/Token.pc.vue'

import mTokenDetail from '@/views/TokenDetail/TokenDetail.m.vue'
import pcTokenDetail from '@/views/TokenDetail/TokenDetail.pc.vue'

import Contact from '@/views/Contact.vue'

// 判断是pc还是mobile
import {
  checkIsMobile
} from '@/assets/js/common.js'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: checkIsMobile() ? mHome : pcHome
    },
    {
      path: '/block',
      name: 'indexPage',
      component: Block
    },
    {
      path: '/tradeList',
      name: 'tradeList',
      component: TradeList
    },
    {
      path: '/tradeHash',
      name: 'trade',
      component: checkIsMobile() ? mTradeHash : pcTradeHash
    },
    {
      path: '/blockDetail',
      name: 'block',
      component: checkIsMobile() ? mBlockDetail : pcBlockDetail
    },
    {
      path: '/addressDetail',
      name: 'address',
      component: checkIsMobile() ? mAddress : pcAddress
    },
    {
      path: '/pushtx',
      name: 'pushtx',
      component: Pushtx
    },
    {
      path: '/decode-tx',
      name: 'decode-tx',
      component: DecodeTx
    },
    {
      path: '/token',
      name: 'token',
      component: checkIsMobile() ? mToken : pcToken
    },
    {
      path: '/tokenDetail',
      name: 'tokenDetail',
      component: checkIsMobile() ? mTokenDetail : pcTokenDetail
    },
    {
      path: '/contant',
      name: 'contant',
      component: Contact
    },
    {
      path: '*',
      redirect: '/index'
    },
  ]
})

router.afterEach(() => {
  window.scrollTo(0, 0)
})

export default router