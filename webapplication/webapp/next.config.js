
const serverConfig = require('./config.js')

// remove the global imports, then can be replaced by imports in component tsx files, for monaco, see pages/restricted/editor.tsx
const removeImports = require('next-remove-imports')({
    test: /node_modules([\s\S]*?)\.(tsx|ts|js|mjs|jsx)$/,
    matchImports: "\\.(less|css|scss|sass|styl)$"
  });

module.exports = removeImports({
        basePath: serverConfig.basePath,
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {

        // only modify the client-side configuration
        if (!isServer) {

            // add loader for ttf font for monaco
            config.module.rules.push({
                test: /\.ttf$/,
                type: 'asset/resource',
            })            

        }
        // return the modified config
        return config
    }
})
