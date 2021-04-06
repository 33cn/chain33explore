import blockAndTxs, {
    createTxList,
    createBlockList
} from './blockAndTxs'

// 首页需要展示的区块条数
const BLOCK_AMOUNT_IN_FIRST_PAGE = 5

// 首页需要展示的交易条数
const TX_AMOUNT_IN_FIRST_PAGE = 5

export default {
    mixins: [blockAndTxs],
    data() {
        return {
            blockList: [],
            txList: [],
            tabActive: true
        }
    },
    computed: {
        maxHeight() {
            return this.$store.state.maxHeight
        },
        maxHash() {
            return this.$store.state.maxHash
        }
    },
    mounted() {
        if (this.maxHeight) {
            this.blockList = createBlockList(this.maxHeight, 5)
        }
        this.txList = createTxList(5)
        // 组件挂载后首先检查新块
        // 获取首页需要的块
        // 平均15秒一个块，每隔5秒检查一次
        // 当有新块时，diff一下缓存，补全最新5个块的信息
        this.checkNewBlock()
            .then(this.syncBlocksAndTxs())
            .then(this.checkNewBlockLater())
    },
    watch: {
        maxHeight() {
            // 最新区块高度变更时
            clearTimeout(this.timer)
            this.timer = null
            this.syncBlocksAndTxs().then(this.checkNewBlockLater())
        }
    },
    methods: {
        syncBlocksAndTxs() {
            const endHeight = this.maxHeight
            const endBlockHash = this.maxHash
            /* eslint-disable-next-line */
            if (!endBlockHash) return console.warn('no hash')
            const startHeight = (endHeight - BLOCK_AMOUNT_IN_FIRST_PAGE + 1) < 0 ? 0 : (endHeight - BLOCK_AMOUNT_IN_FIRST_PAGE + 1)

            return this.checkCachedBlockHeight(startHeight, endHeight)
                .then(({
                    allcached,
                    unCachedStartHeight
                }) => {

                    if (allcached) {
                        const blockList = this.getCachedBlockInfo(startHeight, endHeight)
                        const txList = this.getCachedTxInfo(TX_AMOUNT_IN_FIRST_PAGE)
                        return {
                            blockList,
                            txList
                        }

                    } else {

                        // 获取区块和交易信息并且缓存一下
                        return this.getBlocksAndTxInfo(unCachedStartHeight, endHeight, endBlockHash)
                            .then(({
                                blockList = [],
                                txList = []
                            }) => {
                                this.cacheBlockAndTxInfo(blockList, txList)
                                return {
                                    blockList: this.getCachedBlockInfo(startHeight, endHeight),
                                    txList: this.getCachedTxInfo(TX_AMOUNT_IN_FIRST_PAGE)
                                }
                            })
                    }

                })
                .then(({
                    blockList,
                    txList
                }) => {
                    this.blockList = blockList
                    this.txList = txList
                })
        },

        // 更新区块信息
        // 高度发生变化之后会触发同步 
        // 此处更新只是为了优先渲染出来一部分结果
        updateBlockInfo(blockList = []) {
            if (blockList.length === 0) return
            /* eslint-disable-next-line */
            // console.warn('update blockList')
            // console.table(blockList)
            let currentBlockList = this.blockList
            blockList.map(blockInfo => {
                const blockIndexInData = currentBlockList.findIndex(item => item.height === blockInfo.height)

                if (blockIndexInData > -1) {
                    currentBlockList[blockIndexInData] = {
                        ...currentBlockList[blockIndexInData],
                        ...blockInfo
                    }
                } else {
                    currentBlockList = [blockInfo, ...currentBlockList]
                }
            })

            currentBlockList.splice(BLOCK_AMOUNT_IN_FIRST_PAGE)
            this.blockList = currentBlockList
            return
        },

        // 更新交易信息
        // 暂时用来更新交易的hash值
        updateTxInfo(txs = []) {
            if (txs.length === 0) return
            /* eslint-disable-next-line */
            // console.warn('update tx')
            // console.table(txs)
            let currentTxList = this.txList
            txs.map(tx => {
                const txIndexInData = currentTxList.findIndex(item => {
                    return item.id === tx.id
                })
                if (txIndexInData > -1) {
                    currentTxList[txIndexInData] = {
                        ...currentTxList[txIndexInData],
                        ...tx
                    }
                } else if (tx.height > currentTxList[0].height) {
                    // 加入最新的交易 抛弃不在列表中的交易
                    currentTxList = [tx, ...currentTxList]
                }
            })
            currentTxList.splice(TX_AMOUNT_IN_FIRST_PAGE)
            this.txList = currentTxList
        }
    }
}