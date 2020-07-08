/** 
 * 处理区块跟交易的逻辑
 * 获取最新区块
 * 获取最新交易
 * 缓存区块和交易信息
 */
import {
    txParser
} from '@33cn/chain33-transaction-parser'

/*
 *  需要保存的一个区块的信息
 */
class BlockInfo {
    constructor(params) {
        this.height = params.height || 0
        this.blockTime = params.blockTime || 0
        this.hash = params.hash || ''
        this.txCount = params.txCount || 0
        // 默克尔哈希
        this.merkleHash = params.txHash || ''
        // 挖矿地址
        this.minerAddress = params.minerAddress || ''
    }
}

/**
 * 创建区块列表
 * 
 * @export
 * @param {*} amount
 * @returns Array
 */
export function createBlockList(endHeight, amount) {
    if (amount < 0) return []
    if (endHeight < 0) return []
    if (endHeight - amount <= 0) {
        amount = endHeight
    }

    let list = []
    while (amount) {
        list.push(new BlockInfo({
            height: endHeight - amount
        }))
        amount--
    }
    // 高度较大的排在前面 70 69 68 ...
    list.reverse()
    return list
}

/*
 *需要保存的一个交易的信息， 在交易详情首屏展示
 */
class TxInfo {
    constructor(params = {}) {
        // 交易所在区块高度
        this.hash = params.hash || ''
        // 交易状态 读取 tyName === 'ExecOk' 则为成功
        if (params.tyName === 'ExecOk') {
            this.status = 1
        } else {
            this.status = 0
        }
        this.blockTime = params.blockTime || 0
        this.payload = params.payload || {}
        this.fee = params.fee || 0
        this.nonce = params.nonce || 0
        this.from = params.from || ''
        this.to = params.to || ''

        // 交易的含义
        this.execer = params.execer || ''
        // 币的数量
        this.value = 0
        if (this.execer) {
            const {
                execerName,
                action
            } = txParser(params.execer, params.payload)
            this.execerName = execerName
            if (action.amount) {
                this.value = `${action.amount/1e8} ${action.coin}`
            }
        }
    }
}

export function createTxList(amount) {
    if (amount < 0) return []

    let list = []
    while (amount) {
        const tx = new TxInfo()
        tx.id = amount
        list.push(tx)
        amount--
    }
    return list
}

// 刷新区块的计时器
let timer = null


/**
 * 缓存的区块信息 
 * key 为blockHeight
 * value 为 blockInfo
 *  */
let cachedBlockInfo = new Map()

/**
 * 最多缓存多少条交易信息
 *  */
export const BLOCK_CACHED_MAX_SIZE = 100


/**
 * 缓存的交易信息
 * 按照区块高度入队
 * 高度小的在前 高度大的在尾
 *  */
let cachedTxList = []

/**
 * 最多缓存20条数据
 *  */
export const TX_CACHED_MAX_LENGTH = 20

export default {

    methods: {

        /** 
         * 等待上一次请求结束 5 秒 之后再次询问
         * 每次设置定时器之前先清除定时器
         */
        checkNewBlockLater() {
            timer ? clearTimeout(timer) : null
            timer = setTimeout(() => {
                timer = null
                this.checkNewBlock().then(this.checkNewBlockLater())
            }, 15 * 1000);
        },

        /**
         * 检查是否有新块
         *
         * @returns promise
         */
        checkNewBlock() {
            return this.$chain33Rpc.getLastHeader()
                .then(({
                    result
                }) => {
                    const {
                        height,
                        blockTime,
                        hash,
                        txCount
                    } = result
                    // 有新块
                    if (height !== this.$store.state.maxHeight) {
                        this.$store.commit('updateMaxHeight', height)
                        this.$store.commit('updateMaxBlockHash', hash)
                    }
                    if (!cachedBlockInfo.has(height)) {
                        // 需要使用mixins的组件提供
                        this.updateBlockInfo && this.updateBlockInfo([{
                            height,
                            blockTime,
                            hash,
                            txCount
                        }])
                    }
                    return height
                })
        },

        /**
         * 排除已经缓存过的块
         * 返回一个区间
         * @param {*} startHeight
         * @param {*} endHeight
         * @returns
         */
        checkCachedBlockHeight(startHeight, endHeight) {
            startHeight > endHeight ? (startHeight = endHeight) : null
            let notCachedStartHeight = null
            let cachedBlockList = []

            if (cachedBlockInfo.size === 0) {
                notCachedStartHeight = startHeight
            } else {
                while (startHeight < endHeight && !notCachedStartHeight) {
                    if (!cachedBlockInfo.has(startHeight)) {
                        notCachedStartHeight = startHeight
                    } else {
                        cachedBlockList.push(cachedBlockInfo.get(startHeight))
                    }
                    startHeight++
                }

                if (!notCachedStartHeight) {
                    // 此时 startHeight === endHeight
                    if (cachedBlockInfo.has(endHeight)) {
                        return Promise.resolve({
                            allcached: true
                        })
                    } else {
                        notCachedStartHeight = endHeight
                    }
                }
            }

            return Promise.resolve({
                unCachedStartHeight: notCachedStartHeight,
                cachedBlockList: cachedBlockList.reverse()
            })

        },

        /**
         * 获取区块和交易信息
         *
         * @param {number} startHeight
         * @param {number} endHeight
         * @param {number} [maxAmountOfTxs=100]
         * @returns promise
         */
        getBlocksAndTxInfo(startHeight, endHeight, endBlockHash, maxAmountOfTxs = 20) {
            return this.$chain33Rpc.getBlocks(startHeight, endHeight, true)
                .then(({
                    result
                }) => {
                    if (!result || result.items.length <= 0) return {}

                    let blockList = [],
                        txList = [],
                        // 遗留任务 补充hash
                        reminderTasks = [],
                        // 创造 编号
                        timestamp = +new Date(),
                        counter = 0;

                    const createId = () => {
                        counter += 1
                        return `${timestamp}-${counter}`
                    }

                    result.items.map((item, blockindex) => {
                        const {
                            block = {}, recipts = []
                        } = item
                        let {
                            txs = [], ...otherBlockInfo
                        } = block
                        if (txs === null) {
                            txs = []
                        }

                        // 返回结果中无区块hash 取下一块的parentHash
                        let hash = result.items[blockindex + 1] ? result.items[blockindex + 1].block.parentHash : endBlockHash

                        // 给交易补充上状态 & 找出挖矿的地址
                        // 挖矿地址为每个区块的第一笔交易的发送地址 或者 调用函数为 miner
                        // 平行链可能出现空块 挖矿地址为undefined
                        let minerAddress = txs[0] && txs[0].from

                        let blockInfo = new BlockInfo({
                            ...otherBlockInfo,
                            minerAddress,
                            hash,
                            txCount: txs.length
                        })
                        blockList.push(blockInfo)

                        // 限制解析的交易条数
                        txs.splice(maxAmountOfTxs - txList.length)

                        if (txs.length > 0) {

                            txs.map((tx, i) => {
                                tx.tyName = recipts[i].tyName
                                tx.blockTime = block.blockTime
                                tx = new TxInfo(tx)
                                // id 是为了 等待请求期间 补充 hash 时使用
                                tx.id = createId()
                                tx.height = block.height
                                txList.push(tx)
                            })

                            // 此处的交易缺少交易hash
                            // 需要额外请求blocks的overview补充上hash
                            // 未来此接口补充上hash之后可减少请求
                            reminderTasks.push(this.completeTxHash(
                                blockInfo.hash,
                                txList.slice(txList.length - txs.length)
                            ))
                        }

                    })

                    if (reminderTasks.length > 0) {
                        // 先更新一波用来渲染的数据
                        this.updateTxInfo && this.updateTxInfo(txList.reverse())
                        this.updateBlockInfo && this.updateBlockInfo(blockList)

                        // 请求 & 解析 hash期间 可根据tx的id 在渲染时补充
                        return Promise.all(reminderTasks).then(values => {
                                // 返回带hash的交易
                                // value = [ txs =[] , txs = []]
                                let list = []
                                values.map(txs => {
                                    if (txs && txs.length > 0) {
                                        list = list.concat(txs)
                                    }
                                })
                                return list.reverse()
                            })
                            .then(txList => {
                                return {
                                    blockList,
                                    txList
                                }
                            })

                    } else {
                        // 最终返回的是准确并且完整的数据
                        return {
                            blockList,
                            txList
                        }
                    }

                })
        },

        /**
         * 补充交易hash
         *
         * @param {string} blockhash
         * @param {array} txs
         */
        completeTxHash(blockhash, txs) {
            return this.$chain33Rpc.getBlockOverview(blockhash)
                .then(({
                    result
                }) => {
                    if (!result) return null
                    const {
                        txHashes
                    } = result
                    // 由于前面有截断处理
                    // txHashes.length >= txs.length
                    txs.forEach((tx, i) => {
                        tx.hash = txHashes[i]
                    })

                    // 更新渲染的数据
                    this.updateTxInfo && this.updateTxInfo(txs)

                    return txs
                })
        },

        // 从缓存中取区块信息
        getCachedBlockInfo(startHeight, endHeight) {
            startHeight > endHeight ? (startHeight = endHeight) : null
            let blockList = []
            while (startHeight <= endHeight) {
                blockList.push(cachedBlockInfo.get(startHeight))
                startHeight++
            }
            blockList.reverse()
            return blockList
        },

        // 从缓存中取交易信息
        getCachedTxInfo(amount = 0) {
            amount >= cachedTxList.length ? (amount = cachedTxList.length) : null
            return cachedTxList.slice(0, amount)
        },

        // 缓存一下
        // 每次缓存时丢弃老的数据
        cacheBlockAndTxInfo(blockList, txList) {
            cachedTxList = [...txList, ...cachedTxList]
            if (cachedTxList.length > TX_CACHED_MAX_LENGTH) {
                cachedTxList.splice(TX_CACHED_MAX_LENGTH)
            }

            blockList.map(item => {
                cachedBlockInfo.set(item.height, item)
            })

            if (cachedBlockInfo.size > BLOCK_CACHED_MAX_SIZE) {
                // 删除高度较小的已缓存区块信息
                // let keys = [...cachedBlockInfo.keys()]
                let oldHeight = this.$store.state.maxHeight - BLOCK_CACHED_MAX_SIZE
                while (cachedBlockInfo.delete(oldHeight)) {
                    oldHeight--
                }
            }
        }
    },

    destroyed() {
        clearTimeout(timer)
    },
}