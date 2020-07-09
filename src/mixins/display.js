import { 
    STYLE_WHITE 
} from '@/config/constants'

export default {
    computed: {
        isDay () {
            return this.$store.state.dispalyStyle === STYLE_WHITE || this.$store.state.isMobile
        },
        isMobile () {
            return this.$store.state.isMobile
        },
        isParallelChain () {
            return this.$store.getters.isParallelChain
        },
        connectStatus () {
            return this.$store.state.connectStatus
        }
    }
}