import {
  parseTransferNote
} from '@33cn/chain33-transaction-parser'

/**
 * 格式化时间
 *
 * @param {date} date
 * @param {string} format
 * @returns
 */
export function formatTime(date, format = 'yyyy-MM-dd hh:mm:ss') {
  if (!date) return ''
  if (typeof date === 'number') {
    if (Math.floor(date / 1e9) > 0 && Math.floor(date / 1e9) < 10) {
      date = date * 1000
    }
    date = new Date(date)
  } else if (typeof date === 'string') {
    // timestamp in secounds
    if (/^\d{10}$/.test(date)) {
      date = new Date(date * 1000)
    } else {
      // ios 中使用 new Date( yyyy-MM-dd hh:mm:ss:SS ) 时间格式字符串不能精确到 小时以后
      var dateArr = date.split(/[- :]/)
      var now = new Date()
      date = new Date(dateArr[0] || now.getFullYear(), dateArr[1] && parseInt(dateArr[1]) ? parseInt(dateArr[1]) - 1 : (now.getMonth() - 1), dateArr[2] || 1, dateArr[3] || 0, dateArr[4] || 0, dateArr[5] || 0)
    }
  } else {
    /* eslint-disable-next-line */
    console.error('wrong format', date)
    return ''
  }

  if (format === 'timestamp') return +date

  var map = {
    'M': date.getMonth() + 1, // 月份
    'd': date.getDate(), // 日
    'h': date.getHours(), // 小时
    'm': date.getMinutes(), // 分
    's': date.getSeconds(), // 秒
    'q': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds(), // 毫秒
    'W': '星期' + ['日', '一', '二', '三', '四', '五', '六'][date.getDay()] // 星期
  }
  format = format.replace(/([yMdhmsqSW])+/g, function (all, t) {
    var v = map[t]
    if (v !== undefined) {
      if (all.length > 1) {
        v = '0' + v
        v = v.substr(v.length - 2)
      }
      return v
    } else if (t === 'y') {
      return (date.getFullYear() + '').substr(4 - all.length)
    }
    return all
  })
  return format
}

/**
 * "yyyy-MM-dd hh:mm:ss"
 */
export let fulltime = (timestamp) => {
  return formatTime(timestamp, "yyyy-MM-dd hh:mm:ss")
}

/*
 * 截断hash
 */
export let filterHash = str => String(str).substr(0, 16) + '...' + String(str).substr(-4);


/**
 * 获取交易中的价值
 * 强制非科学计数法
 * @param {object} tradeInfo
 */
export let getTradeValue = (tradeInfo) => {
  let unit = process.env.VUE_APP_DEFAULT_COIN ? process.env.VUE_APP_DEFAULT_COIN : 'BTY'
  // 燃烧或增发交易
  if (tradeInfo.actionName === 'tokenBurn' || tradeInfo.actionName === 'tokenMint') return `0 ${unit}`
  var res = `${tradeInfo.amount / 100000000} ${unit}`
  if (tradeInfo.assets && tradeInfo.assets[0].symbol) {
    // console.log(res)
    var amount = (tradeInfo.assets[0].amount || 0) / 100000000
    var cointoken = tradeInfo.assets[0].symbol
    // var m = amount.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
    // amount = amount.toFixed(Math.max(0, (m[1] || '').length - m[2]))
    res = `${amount} ${cointoken}`
  }
  // if (tradeInfo.tx && /^user\.p\.\w+\.coins$/.test(tradeInfo.tx.execer)) {
  //   let symbol = tradeInfo.tx.execer
  //   let sLen = symbol.length - 13
  //   symbol = symbol.substr(7,sLen)
  //   res = res + ` (${symbol})`
  //   // res = res
  // }
  return res
};

/**
 * 获取交易中的token
 * @param {object} tradeInfo  
 */
export let getTradeSymbol = (tradeInfo) => {
  var res = process.env.VUE_APP_DEFAULT_COIN ? process.env.VUE_APP_DEFAULT_COIN : `BTY`
  if (tradeInfo.assets && tradeInfo.assets[0].symbol && tradeInfo.assets[0].symbol !== 'BTY') {
    var cointoken = tradeInfo.assets[0].symbol
    res = `${cointoken}`
  }
  return res
};

export let blockDetail = (height) => {
  return `/blockDetail?height=${height}`
}

export let addressDetail = (address) => {
  return `/addressDetail?address=${address}`
}

export let tradeHash = (hash) => {
  return `/tradeHash?hash=${hash}`
}
// 省略中间 x 位 为了方便记忆 展示后4位
export let addressEll = (str) => {
  if (!str) return ''
  return str.replace(/^(\w{10})(\w+)(\w{4})$/, '$1...$3')
}
// 过滤交易组
export let tradeGroup = (trade) => {
  if (trade.tx && trade.tx.groupCount > 1) return '交易组'
  else return '普通交易'
}

// 校验地址是否包含中文
export let addressCN = (str) => {
  let valid = /.*[\u4e00-\u9fa5]+.*$/.test(str)
  return valid
}

// 解码转账交易中的note字段
export let decodeTransferNote = (tx) => {
  let payload = ''
  if (!tx.payload) return tx.rawPayload
  else {
    payload = tx.payload
  }
  const keys = ['transfer', 'withdraw', 'transferToExec']
  const key = keys.find(item => payload[item])
  if (key && payload[key].note) {
    payload[key].note = parseTransferNote(payload[key].note)
  }
  return payload
}

// 校验url合法性
export let checkURL = (str) => {
  /* eslint-disable */
  let urlRule = "^((https|http|ftp|rtsp|mms)?://)" +
    "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
    +
    "|" // 允许IP和DOMAIN（域名）
    +
    "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
    +
    "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
    +
    "[a-z]{2,6})" // first level domain- .com or .museum
    +
    "(:[0-9]{1,4})?" // 端口- :80
    +
    "((/?)|" // a slash isn't required if there is no file name
    +
    "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$"
  /* eslint-enable */
  let valid = new RegExp(urlRule)
  return valid.test(str)
}
// 手续费过滤
export let filterFee = (str) => {
  let token = process.env.VUE_APP_DEFAULT_COIN
  return `${str/100000000} ${token}`
}

export default {
  formatTime,
  fulltime,
  filterHash,
  getTradeValue,
  getTradeSymbol,
  blockDetail,
  addressDetail,
  tradeHash,
  addressEll,
  tradeGroup,
  addressCN,
  decodeTransferNote,
  checkURL,
  filterFee
}