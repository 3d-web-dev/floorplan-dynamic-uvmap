const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = {
    entry: path.resolve(__dirname, '../src/index.js'),
    output:
    {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../public')
    },
    devtool: 'source-map',
    plugins:
        [
            new CopyWebpackPlugin({
                patterns: [
                    { from: path.resolve(__dirname, '../public/') }
                ]
            }),
        ],
    module:
    {
        rules:
            [
                // HTML
                {
                    test: /\.(html)$/,
                    use: ['html-loader']
                },

                // JS
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use:
                        [
                            'babel-loader'
                        ]
                },
            ]
    }
}
