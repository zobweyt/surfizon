const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const config = {
  mode: "development",
  entry: {
    main: ["./src/ts/index.ts", "./src/scss/main.scss"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
  },
  stats: {
    loggingDebug: ["sass-loader"],
  },
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                includePaths: ["./src/scss/"],
                outputStyle: "compressed",
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [new MiniCssExtractPlugin()],
};

module.exports = config;
