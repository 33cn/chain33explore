/**
 * 比较两个版本号
 * compareVersion( '1.2.0' , '1.3.0')
 * @export
 * @param {string} version1
 * @param {string} version2
 * @returns string 'equal' | 'beyond' | 'less'
 */
export function compareVersion(version1, version2) {
    if (version1 === version2) return 'equal'
    version1 = version1.split('.')
    version2 = version2.split('.')
    let result = null,
        i = 0,
        maxTimes = version1.length > version2.length ? version1.length : version2.length
    while (!result && i < maxTimes) {
        i++
        if (version2[i] === undefined || version1[i] > version2[i]) {
            result = 'beyond'
        } else if (version1[i] === undefined || version1[i] < version2[i]) {
            result = 'less'
        }
    }
    if (!result) {
        throw 'the format of version is not support!'
    } else {
        return result
    }
}

export default {
    mounted() {
        if (!this.$store.state.nodeVersion) {
            this.$store.dispatch('getNodeVersion')
        }
    }
}