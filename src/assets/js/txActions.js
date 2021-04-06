/**
 * 辅助解析交易的含义
 * 
 * 第一层的key 取自 execer
 * actions 取自 payload payload[action]
 * 
 * coinAmount 为币的数量所在字段 payload[action][coinAmount]
 *            若为空 则为0
 * coinSymbol 为币的代称所在字段 payload[action][coinSymbol]
 *            若为空 则取 coinStaticSymbol
 * 
 * coinStaticSymbol 为默认币种名称
 * 
 */
export function txParser(execer, payload, lang = 'cn') {
  if (/^user\./.test(execer)) return {
    execerName: execer,
    action: {}
  }
  if (/^user\.p\./.test(execer)) return {
    execerName: '平行链',
    action: {}
  }
  if (!txmap[execer]) {
    /* eslint-disable-next-line */
    console.warn('execer name undefined in tx parser', execer)
    return {
      execerName: execer,
      action: {}
    }
  }
  // 5.0.2.xxxx版本
  if (payload.Value) {
    payload = payload.Value
  }
  const execerName = txmap[execer]['name'][lang]
  let action = {}

  if (payload) {
    if (payload.ty) {
      delete payload.ty
    }
    let actionKey = Object.keys(payload)[0]

    if (actionKey) {
      // 转小写
      const actionKeyInMap = actionKey.toLowerCase()
      const actionmap = txmap[execer]['actions'][actionKeyInMap]
      if (!actionmap) {
        /* eslint-disable-next-line */
        console.warn('undefined actionKey', actionKey)
        return {
          execerName: execer,
          action: {}
        }
      }
      action = {
        name: actionmap['name'][lang],
        amount: actionmap["coinAmount"] ? payload[actionKey][actionmap["coinAmount"]] : 0,
        coin: actionmap["coinSymbol"] ? payload[actionKey][actionmap["coinSymbol"]] : actionmap["coinStaticSymbol"]
      }
    }
  }
  return {
    execerName,
    action
  }

}

/**
 *
 * 输出交易信息为字符串
 * @export
 * @param {*} execer
 * @param {*} payload
 * @param {string} [lang='cn']
 * @returns
 */
export function txInWords(execer, payload, lang = 'cn') {
  let {
    execerName,
    action
  } = txParser(execer, payload, lang)

  return `${execerName} ${JSON.stringify(action)}`
}


/**
 * 16进制字符串转unicode字符串
 *
 * @param {string} [hex='']
 * @returns
 */
export function hex2str(hex = '') {
  if (typeof hex !== 'string') throw new Error('hex2str required a string')
  hex = hex.trim()
  if (hex.substr(0, 2).toLowerCase() === "0x") {
    hex = hex.substr(2)
  }
  const len = hex.length;
  if (len % 2 !== 0) {
    throw new Error('Illegal Format ASCII Code!')
  }
  let curCharCode
  let resCharCode
  let resultStr = []
  for (var i = 0; i < len; i = i + 2) {
    // 16进制转10进制
    curCharCode = parseInt(hex.substr(i, 2), 16)
    // 10进制数字转unicode字符
    resCharCode = String.fromCharCode(curCharCode)
    resultStr.push(resCharCode)
  }
  return resultStr.join('');
}

/**
 * unicode字符串转16进制字符串
 *
 * @export
 * @param {*} str
 * @returns
 */
export function str2hex(str) {
  if (typeof str !== 'string') throw new Error('str2hex required a string')
  let hexArr = ['0x']
  const len = str.length
  for (let i = 0; i < len; i++) {
    hexArr.push(str.charCodeAt(i).toString(16))
  }
  return hexArr.join('')
}

// execer name
// 
const txmap = {
  "ticket": {
    "name": {
      "cn": "购票",
      "en": "ticket"
    },
    "actions": {
      "miner": {
        "name": {
          "cn": "挖矿",
          "en": "miner"
        },
        "coinAmount": "reward",
        "coinSymbol": null,
        "coinStaticSymbol": "BTY",
      },
      "topen": {
        "name": {
          "cn": "开启挖矿",
          "en": "topen"
        },
        "coinAmount": "reward",
        "coinSymbol": null,
        "coinStaticSymbol": "BTY",
      },
      "tclose": {
        "name": {
          "cn": "关闭挖矿",
          "en": "tclose"
        },
        "coinAmount": "reward",
        "coinSymbol": null,
        "coinStaticSymbol": "BTY",
      },
    }
  },

  "coins": {
    "name": {
      "cn": "币",
      "en": "coins"
    },
    "actions": {
      "withdraw": {
        "name": {
          "cn": "提币",
          "en": "withdraw"
        },
        "coinAmount": "amount",
        "coinSymbol": "cointoken",
        "coinStaticSymbol": "BTY",
      },
      "transfer": {
        "name": {
          "cn": "转账",
          "en": "transfer"
        },
        "coinAmount": "amount",
        "coinSymbol": "cointoken",
        "coinStaticSymbol": "BTY",
      }
    }
  },

  "none": {
    "name": {
      "cn": "空交易",
      "en": "none",
    },
  },

  "token": {
    "name": {
      "cn": "token",
      "en": "token",
    },
    "actions": {
      "withdraw": {
        "name": {
          "cn": "提币",
          "en": "withdraw"
        },
        "coinAmount": "amount",
        "coinSymbol": "cointoken",
        "coinStaticSymbol": "BTY",
      },
      "transfer": {
        "name": {
          "cn": "转账",
          "en": "transfer"
        },
        "coinAmount": "amount",
        "coinSymbol": "cointoken",
        "coinStaticSymbol": "BTY",
      }
    }
  },

  "trade": {
    "name": {
      "cn": "合约",
      "en": "trade",
    },
  },

  "user.write": {
    "name": {
      "cn": "user.write",
      "en": "user.write",
    },
  }
}

export default txmap