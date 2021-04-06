import Chain33Rpc from '@33cn/chain33-rpc-api'
/**
 * 判断交易的准确性 return false交易成功  true交易失败
 * @param {交易执行器} Actuators  
 * @param {交易type} ty 
 */
let tradeAccuracy = async function (result, ty, execer) {
  let Actuators = result.tx.execer
  // none 交易处理
  if (result.actionName === 'unknown') {
    if (result.tx.next && result.tx.groupCount) {
      let sdk = new Chain33Rpc(process.env.VUE_APP_DEFAULT_PROVIDER)
      let data = await sdk.queryTransaction(result.tx.next)
      if (data.error === null) {
        return tradeAccuracy(data.result, data.result.receipt.ty, execer) === true
      }
    } else return false
  } else if ((Actuators == 'none' || Actuators.substring(0, 5) == "user.") && !execer) {
    return false;
  } else {
    if (ty == 1) {
      return true;
    } else {
      return false;
    }
  }
};

// let check = async function(result, execer) {
//   let sdk = new Chain33Rpc(process.env.VUE_APP_DEFAULT_PROVIDER)
//   let data = await sdk.queryTransaction(result.tx.next)
//   if(data.error === null){
//     return tradeAccuracy(data.result, data.result.receipt.ty, execer)
//   }
// }

let checkIsMobile = function () {
  let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
  let width = document.documentElement.clientWidth;
  return !!(flag || width <= 500)
}

function urlQuery(e) {
  const t = window.location.search.match(new RegExp("(\\?|&)" + e + "=([^&]*)(&|$)"));
  return t ? decodeURIComponent(t[2]) : ""
}

export {
  urlQuery,
  tradeAccuracy,
  checkIsMobile
}