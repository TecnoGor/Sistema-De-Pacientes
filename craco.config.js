const { path } = require("pdfkit");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.devtool = false;
      // Elimina la restricción de importación fuera de /src

      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "fs": false,
        "path": require.resolve("path-browserify"),
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify")
      };
      
      // Actualiza para nueva versión de webpack
      webpackConfig.ignoreWarnings = [
        { module: /node_modules\/stylis-plugin-rtl/ },
        { module: /node_modules\/@tensorflow/ }
      ];
      webpackConfig.module.rules = webpackConfig.module.rules.filter(
        (rule) => !rule.loader?.includes('source-map-loader')
      );
      webpackConfig.resolve.plugins = webpackConfig.resolve.plugins.filter(
        (plugin) => plugin.constructor.name !== "ModuleScopePlugin"
      );
      return webpackConfig;
    },
  },
};