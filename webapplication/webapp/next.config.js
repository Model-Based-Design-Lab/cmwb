
const serverConfig = require('./config.js')

// remove the global imports, then can be replaced by imports in component tsx files, but it is not so clear which css need to be imported
const removeImports = require('next-remove-imports')({
    test: /node_modules([\s\S]*?)\.(tsx|ts|js|mjs|jsx)$/,
    matchImports: "\\.(less|css|scss|sass|styl)$"
  });

module.exports = removeImports({
        basePath: serverConfig.basePath,
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {

        // only modify the client-side configuration
        if (!isServer) {

            // TODO: is this still needed?
            // stub the net reference to avoid the vscode-jsonrpc module trying to use it
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false
            }

            // add loader for ttf
            config.module.rules.push({
                test: /\.ttf$/,
                type: 'asset/resource',
            })            

        }
        // return the modified config
        return config
    }
})
