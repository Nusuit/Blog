module.exports = function override(config, env) {
    // Thêm tùy chỉnh cấu hình Webpack ở đây
  
    // Cấu hình devServer với setupMiddlewares thay vì onBeforeSetupMiddleware hoặc onAfterSetupMiddleware
    config.devServer = {
      ...config.devServer,
      setupMiddlewares: (middlewares, devServer) => {
        // Bạn có thể thêm các middlewares tùy chỉnh ở đây
        return middlewares;
      },
    };
  
    return config;
  };
  