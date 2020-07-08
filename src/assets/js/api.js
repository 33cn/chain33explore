// import json_parse from './json_parse'

const coinApi = '/coin'

const bityuanVersion = 'https://bityuan.com/mpapi/interface/app/last'

// 请求函数
export function myFetch(data, url = '', config = {}) {
  data = JSON.stringify(data);
  var params = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    redirect: 'follow',
    ...config
  }
  if (config.method === 'POST' || !config.method) {
    params.body = data
  }
  return fetch(url, params).then((response) => {
    if (response.status >= 200 && response.status < 300) {
      return response
    } else {
      var error = new Error(response.statusText)
      error.response = response
      throw error
    }
  }).then((response) => {
    return response.json()
  })
}


/* 接口部分 */

// 获取钱包下载版本
export function getwalletVersion() {
  return myFetch(null, bityuanVersion, {
    method: 'GET',
    headers: {}
  })
}

// 获取BTY/token信息
export function getBTYmsg(symbol) {
  let body = {
    names: [symbol]
  };
  let url = coinApi + '/interface/coin/coin-index'
  return myFetch(body, url);
}

// 获取多个Token信息
export function getTokenMsgArr(params) {
  let body = {
    "names": params
  };
  let url = coinApi + '/h5/coin/coin-info-by-names'
  return myFetch(body, url)
}

// 获取BTY/token详细介绍
export function getBTYdetail(id) {
  let body = {
    id: id
  }
  let url = coinApi + '/interface/coin/get-coin-by-id'
  return myFetch(body, url)
}