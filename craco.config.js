module.exports = {
  webpack: {
    configure: (webpackConfig, { env }) => {
      if (env === 'production') {
        // Find TerserPlugin in the plugins array
        const terserPlugin = webpackConfig.optimization.minimizer.find(
          (plugin) => plugin.constructor.name === 'TerserPlugin'
        );

        if (terserPlugin) {
          // Configure Terser to remove console statements except error and warn
          terserPlugin.options.terserOptions.compress = {
            ...terserPlugin.options.terserOptions.compress,
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace']
          };
        }
      }
      return webpackConfig;
    }
  }
};
