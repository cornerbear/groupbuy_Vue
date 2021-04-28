// proxyObj['/ws'] = {
//     ws: true,
//     target: "ws://localhost:8888"
// };
module.exports = {
    devServer: {
        host: 'localhost',
        port: 8080,
        proxy: {
            '/' : {
                target : 'http://localhost:8888',
                changeOrigin : true,
                pathRewrite : {
                    '^/' : ''
                }
            }
        }
    }
}