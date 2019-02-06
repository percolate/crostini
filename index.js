require('ts-node').register({
    noCache: false,
    project: require('path').resolve(__dirname, 'tsconfig.json'),
    transpileOnly: true,
})
require('./src/index')
