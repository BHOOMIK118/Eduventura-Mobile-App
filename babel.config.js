module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: {
            "@assets": "./src/assets",
            "@components": "./src/components",
            "@navigation": "./src/navigation",
            "@utils": "./src/utils",
            "@context": "./src/context",
            "@screens": "./src/screens",
            "@features": "./src/features",
            "@types": "./src/types",
            "@styles": "./src/styles",
          },
        },
      ],
    ],
  };
};
