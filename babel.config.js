module.exports = {
  presets: [
    '@vue/app',
    ["@babel/preset-env", {
      "debug": false,
      "modules": false,
      "useBuiltIns": false
    }], 
    "@babel/preset-react"
  ],
  plugins:[
    // "transform-runtime",
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-transform-runtime",
    "syntax-dynamic-import",
    [ "@babel/plugin-proposal-class-properties", { "loose": true } ],
    "transform-async-to-generator"
  ],
  env: {
    "production": {
      "presets": ["react-optimize"]
    }
  },
  'postcss-pxtorem': {
    rootValue: 37.5,
    propList: ['*']
  }
}
