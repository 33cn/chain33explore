/*
 * 各种常量
 */

// 默认的浏览节点为当前服务器的 /api
export const DEFAULT_PROVIDER = process.env.VUE_APP_DEFAULT_PROVIDER === '/api' ? `${location.origin}/api` : process.env.VUE_APP_DEFAULT_PROVIDER
// 执行器，主网是 token 平行链是 user.p.xxx
export const DEFAULT_EXECER = 'token'

// 本地存放 节点地址的key
export const STORAGE_PROVIDER_KEY = 'Provide_API'

// 本地存放 节点execer的key
export const STORAGE_EXECER_KEY = 'Provide_EXECER'

// 本地存放 风格 key
export const STORAGE_STYLE_KEY = 'dispalyStyle'

// 界面显示风格风格
export const STYLE_BLACK = 'black'
export const STYLE_WHITE = 'white'

// 存放在session中的key
// maxHeight
export const SESSION_MAXHEIGHT_KEY = 'maxHeight'
export const SESSION_MAXHASH_KEY = 'maxHash'

// 节点设置列表key
export const STORAGE_NODES_KEY = 'nodes'

// Basic auth 节点信息
export const STORAGE_BASIC = 'Auth'