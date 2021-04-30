module.exports = {
    publicPath: './',
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