
const serverConfig = require('./config.js')

module.exports = {
    basePath: serverConfig.basePath,
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {

        // only modify the client-side configuration
        if (!isServer) {

            // add work for the monaco editor
            // node that config.entry is an async function, so we need to build a new one
            var entryAsyncFunction = config.entry
            config.entry = async function () {
                var entry = await entryAsyncFunction()
                entry['editor.worker'] = 'monaco-editor-core/esm/vs/editor/editor.worker.js'
                return entry
            }

            // we need to set the globalObject to this, because otherwise the editor worker 
            // generates an error for undefined reference 'window', which I cannot yet explain as
            // it seems to be running client-side
            config.output.globalObject = 'this'

            // stub the net reference to avoid the vscode-jsonrpc module trying to use it
            config.node = {
                net: 'empty',
                fs: 'empty'
            }

            // require alias for the monaco-languageclient module
            // see https://github.com/TypeFox/monaco-languageclient/blob/master/CHANGELOG.md#breaking-changes-1
            config.resolve.alias['vscode'] = require.resolve('monaco-languageclient/lib/vscode-compatibility')

            // add loader for css
            config.module.rules.push({
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
            })

            // add loader for ttf
            config.module.rules.push({
                test: /\.ttf$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        publicPath: `${serverConfig.basePath}/_next/static/fonts`,
                        outputPath: 'static/fonts'
                    }
                }],
            })

        }

        // return the modified config
        return config
    }
}
