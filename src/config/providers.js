export const defaultHttpOptions =[
    {
        // value: 'https://120.79.156.149:8801/',
        value: 'https://mainnode.bityuan.com:8801',
        label: 'mainnet 主链1'
    },
    {
        value: 'http://localhost:8801/',
        label: 'localhost 本地节点'
    },
    {
        value: 'http://localhost:8901/',
        label: 'localhost 本地平行链节点'
    },
    {
        value: 'http://39.98.51.242:8901/',
        label: 'mainnet 主链2'
    },
    {
        value: 'http://39.98.51.242:8801/',
        label: 'mainnet 主链3'
    },
    {
        // value: 'https://114.55.101.159:8801',
        value: 'https://testnode.bityuan.com:8801',
        label: 'testnet 测试链'
    },
    {
        value: 'https://beanwallet.com/api',
        label: '豆子钱包'
    }
]

export const defaultHttpsOptions =[
    {
        value: 'https://mainnode.bityuan.com:8801',
        label: 'mainnet 主链'
    },
    {
        value: 'https://testnode.bityuan.com:8801',
        label: 'testnet 测试链'
    },
    {
        value: 'https://beanwallet.com/api',
        label: '豆子钱包'
    }
]

function isHttps () {
    return /^https/.test(location.protocol)
}

export default isHttps() ? defaultHttpsOptions : defaultHttpOptions