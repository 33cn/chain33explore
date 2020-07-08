<template>
    <div class="records-box">
        <h4 class="records-title flex-between" v-if="!isMobile">
            <span>最新交易</span>
            <router-link to="/tradeList">查看全部</router-link>
        </h4>
        <div v-if="txList.length === 0">
            最新 5 个区块中暂无交易
        </div>
        <div v-else v-for="txinfo in txList" :key="txinfo.id" class="record-item">
            <div class="record-title flex-between">
                <div>
                    交易哈希：
                    <placeholder v-if="!txinfo.hash" :width="192" :height="16"></placeholder>
                    <router-link v-else :to="txinfo.hash | tradeHash">{{txinfo.hash | addressEll}}</router-link>
                </div>
                <div v-show="txinfo.blockTime"><span>交易时间：</span><p style="display:inline-block">{{txinfo.blockTime | fulltime}}</p></div>
            </div>
            <div v-if="txinfo.from" class="record-content flex-center">
                <div class="record-col address">
                    <p>发送方</p>
                    <p><router-link :to="txinfo.from | addressDetail">{{txinfo.from | addressEll}}</router-link></p>
                </div>
                <div class="record-col address">
                    <p>接收方</p>
                    <p><router-link :to="txinfo.to | addressDetail">{{txinfo.to | addressEll}}</router-link></p>
                </div>
                <div class="record-col">
                    <p>            
                        <!-- <el-badge :value="txinfo.height"> -->
                            交易金额
                        <!-- </el-badge> -->
                    </p>
                    <p><span class="text">{{txinfo.value}}</span></p>
                </div>
            </div>
            <div v-else class="record-content flex-center">
                <div class="placeholder-wraper">
                    <placeholder :width="480" :height="18"/>
                    <placeholder :width="270" :height="18"/>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Placeholder from '@/components/Placeholder.vue'
import display from '@/mixins/display.js'
export default {
    props: ['txList'],
    mixins: [display], 
    components: {
        placeholder: Placeholder
    }
}
</script>