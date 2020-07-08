import Vue from 'vue'
import Vuex from 'vuex'
import Chain33Rpc from 'chain33-rpc-api'
import createLogger from 'vuex/dist/logger'
import {
    DEFAULT_PROVIDER,
    DEFAULT_EXECER,
    STORAGE_PROVIDER_KEY,
    STORAGE_EXECER_KEY,
    STORAGE_STYLE_KEY,
    STYLE_WHITE,
    SESSION_MAXHEIGHT_KEY,
    SESSION_MAXHASH_KEY,
    STORAGE_NODES_KEY
} from '@/config/constants'
import {
    checkIsMobile
} from '@/assets/js/common'
import {
    urlQuery
} from '@/assets/js/common.js'
import {
    resolve
} from 'bluebird';
Vue.use(Vuex)

export function applySettingInUrl() {
    let providerInUrl = urlQuery('provider')
    let execerInUrl = urlQuery('execer')
    if (providerInUrl && execerInUrl) {
        providerInUrl = decodeURIComponent(providerInUrl)
        execerInUrl = decodeURIComponent(execerInUrl)
        localStorage.setItem(STORAGE_PROVIDER_KEY, providerInUrl)
        localStorage.setItem(STORAGE_EXECER_KEY, execerInUrl)
        cleanNodeCache()
    }
}

/**
 * 清除缓存的与某一个节点相关的数据
 *
 * @export
 */
export function cleanNodeCache() {
    sessionStorage.removeItem(SESSION_MAXHEIGHT_KEY)
    sessionStorage.removeItem(SESSION_MAXHASH_KEY)
}

// 优先采用url中携带的参数
applySettingInUrl()

export function getValueInStorage(storageKey, defaultValue) {
    const storaged = localStorage.getItem(storageKey)
    if (storaged) return storaged
    return defaultValue
}

export function getValueInSession(storageKey, defaultValue) {
    const sessioned = sessionStorage.getItem(storageKey)
    if (sessioned) return sessioned
    return defaultValue
}

export const defaultNodeAddress = getValueInStorage(STORAGE_PROVIDER_KEY, DEFAULT_PROVIDER)


export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    plugins: process.env.NODE_ENV !== 'production' ? [createLogger()] : [],
    state: {
        // 浏览的区块链节点版本号 eg: 1.0.1
        nodeVersion: '',

        // 与节点的连接状态
        connectStatus: true,

        apiSetting: {
            // 节点地址
            provider: defaultNodeAddress,
            // 执行器
            execer: getValueInStorage(STORAGE_EXECER_KEY, process.env.VUE_APP_DEFAULT_EXECER || DEFAULT_EXECER)
        },

        // 浏览器界面风格 
        // 取值为 black white
        dispalyStyle: getValueInStorage(STORAGE_STYLE_KEY, STYLE_WHITE),

        isMobile: checkIsMobile(),

        // 最新区块的高度
        maxHeight: Number(getValueInSession(SESSION_MAXHEIGHT_KEY, 0)),
        // 最新区块的hash
        maxHash: getValueInSession(SESSION_MAXHASH_KEY, ''),

        // 节点设置列表
        nodesList: getValueInStorage(STORAGE_NODES_KEY, '[]')
    },

    getters: {
        // 是否平行链
        isParallelChain: state => {
            // 当前的节点配置为平行链，或者代码打包的配置为平行链
            return true
        },
        // 基础币
        baseCoin: () => {
            return process.env.VUE_APP_DEFAULT_COIN || 'BTY'
        },
        baseIcon: () => {
            let path = process.env.VUE_APP_DEFAULT_ICON || ''
            if (path) return require(`../../public/baseCoin/${path}`)
            else return require('../../public/baseCoin/baseCoin.png')
        }
    },

    mutations: {
        updateNodeVersion(state, version) {
            state.nodeVersion = version
        },
        // 更新节点设置
        updateApiSetting(state, setting) {
            // 当api地址变化时 清空高度和hash
            if (state.apiSetting.provider !== setting.provider) {
                localStorage.removeItem(SESSION_MAXHEIGHT_KEY)
                localStorage.removeItem(SESSION_MAXHASH_KEY)
            }
            state.apiSetting = {
                ...state.apiSetting,
                ...setting
            }
            localStorage.setItem(STORAGE_PROVIDER_KEY, setting.provider)
            localStorage.setItem(STORAGE_EXECER_KEY, setting.execer)
            cleanNodeCache()
        },
        changeStyle(state, style) {
            state.dispalyStyle = style
            localStorage.setItem(STORAGE_STYLE_KEY, style)
        },
        changeViewSize(state, isMobile) {
            state.isMobile = isMobile
        },
        updateMaxHeight(state, Height) {
            state.maxHeight = Height
            sessionStorage.setItem(SESSION_MAXHEIGHT_KEY, Height)
            // 浏览器会持续更新节点的高度，如果重新连接上节点，可认为已恢复连接
            if (state.connectStatus !== true) {
                state.connectStatus = true
            }
        },
        updateMaxBlockHash(state, hash) {
            state.maxHash = hash
            sessionStorage.setItem(SESSION_MAXHASH_KEY, hash)
        },
        connectStatusOff(state) {
            if (state.connectStatus !== false) {
                state.connectStatus = false
            }
        },
        connectStatusOn(state) {
            state.connectStatus = true
        },
        // 添加配置节点
        addNodesOptions(state, node) {
            let list = JSON.parse(state.nodesList)
            list.push(node)
            localStorage.setItem(STORAGE_NODES_KEY, JSON.stringify(list))
            state.nodesList = JSON.stringify(list)
        },
        // 删除配置节点
        delNodesOptions(state, node) {
            let list = JSON.parse(state.nodesList)
            list.map((current, index) => {
                if (current.value === node.value) list.splice(index, 1)
            })
            localStorage.setItem(STORAGE_NODES_KEY, JSON.stringify(list))
            state.nodesList = JSON.stringify(list)
        }
    },
    actions: {
        // 异步获取节点版本号
        getNodeVersion({
            commit
        }) {
            let chain33 = new Chain33Rpc(defaultNodeAddress)
            chain33.version().then((res) => {
                // 老版本的version直接写在result中
                if (typeof res.result === 'string') {
                    commit('updateNodeVersion', res.result)
                } else {
                    commit('updateNodeVersion', res.result.chain33)
                }
            })
        }
    }
})