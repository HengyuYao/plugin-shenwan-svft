const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const hasha = require('hasha');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackBar = require('webpackbar');
const webpack = require('webpack');
require('dotenv').config();

const distOutputPath = 'dist';
const appPerfix = 'item-link-doc';

// output配置
const outputConfig = isProd =>
  isProd
    ? {
        filename: 'js/[name].[chunkhash].min.js',
        path: path.resolve(__dirname, distOutputPath),
        publicPath: './',
        library: appPerfix,
        libraryTarget: 'umd',
      }
    : {
        filename: 'main.js',
        path: path.resolve(__dirname, distOutputPath),
        publicPath: '/',
        library: appPerfix,
        libraryTarget: 'umd',
      };

const getLocalIdent = ({ resourcePath }, localIdentName, localName) => {
  if (localName === appPerfix) {
    return localName;
  }
  if (/\.global\.(css|less)$/.test(resourcePath) || /node_modules/.test(resourcePath)) {
    // 不做cssModule 处理的
    return localName;
  }
  return `${localName}__${hasha(resourcePath + localName, { algorithm: 'md5' }).slice(0, 8)}`;
};

const getExternal = name => {
  return ['window modules', name];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
module.exports = (cliEnv = {}, argv) => {
  const mode = argv.mode;
  if (!['production', 'development'].includes(mode)) {
    throw new Error('The mode is required for NODE_ENV, BABEL_ENV but was not specified.');
  }

  const isProd = mode === 'production';
  const isDev = mode === 'development';

  const classNamesConfig = {
    loader: '@ecomfe/class-names-loader',
    options: {
      classNamesModule: require.resolve('classnames'),
    },
  };
  // 生产环境使用 MiniCssExtractPlugin
  const extractOrStyleLoaderConfig = isProd ? MiniCssExtractPlugin.loader : 'style-loader';

  const lessLoaderConfig = {
    loader: 'less-loader',
    options: {
      lessOptions: {
        javascriptEnabled: true,
        modifyVars: {
          'ant-prefix': 'ant',
          'border-radius-base': '4px',
        },
      },
    },
  };

  const cssLoaderConfig = {
    loader: 'css-loader',
    options: {
      modules: { getLocalIdent },
      importLoaders: 1,
    },
  };

  const postcssLoaderConfig = {
    loader: 'postcss-loader',
  };
  const webpackConfig = {
    entry: './src/index.tsx',
    mode: isProd ? 'production' : 'development',
    output: outputConfig(isProd),
    devtool: (() => {
      if (isDev) {
        return 'inline-cheap-module-source-map';
      }
      return false;
    })(),
    resolve: {
      extensions: ['.js', '.css', '.jsx', '.tsx', '.ts'],
      alias: {
        '@': path.resolve(__dirname, 'src/'),
        zlib: require.resolve('browserify-zlib'),
      },
      fallback: {
        https: false,
        http: false,
        child_process: false,
        fs: false,
        crypto: false,
      },
    },
    devServer: {
      hot: 'only',
      static: {
        directory: path.resolve(__dirname, '../dist'),
        serveIndex: true,
        watch: true,
      },
      historyApiFallback: {
        disableDotRule: true,
        index: '/',
      },
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
      },
      port: 3002,
      proxy: {
        '/api': {
          target: '',
          headers: {
            Cookie: '',
          },
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [
      new WebpackBar(),
      new webpack.DefinePlugin({
        'process.env.REACT_APP_API_SERVER': JSON.stringify(process.env.REACT_APP_API_SERVER),
        'process.env.REACT_APP_TEST_API_SERVER': JSON.stringify(
          process.env.REACT_APP_TEST_API_SERVER,
        ),
        'process.env.REACT_APP_NEXT_PUBLIC_PARSE_APP_ID': JSON.stringify(
          process.env.REACT_APP_NEXT_PUBLIC_PARSE_APP_ID,
        ),
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public/index.html'),
        filename: 'index.html',
        inject: true,
      }),
      isProd &&
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash].css',
          chunkFilename: '[name].[contenthash].chunk.css',
          ignoreOrder: true,
        }),
      new CleanWebpackPlugin(),
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            isDev && {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react'],
                plugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
              },
            },
            'ts-loader',
          ].filter(Boolean),
          exclude: /node_modules/,
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
            },
          },
        },
        {
          test: /\.css/,
          use: [classNamesConfig, extractOrStyleLoaderConfig, 'css-loader'],
        },
        {
          test: /\.less$/,
          exclude: /node_modules/,
          use: [
            classNamesConfig,
            extractOrStyleLoaderConfig,
            cssLoaderConfig,
            postcssLoaderConfig,
            lessLoaderConfig,
          ],
        },
        {
          test: /\.less$/,
          include: /node_modules/,
          use: [extractOrStyleLoaderConfig, 'css-loader', lessLoaderConfig],
        },
        // 静态资源
        {
          test: /\.(png|jpg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'resource/[hash][ext][query]',
          },
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        },
      ],
    },
  };

  if (isProd) {
    webpackConfig.externals = {
      antd: getExternal('antd'),
      react: getExternal('react'),
      'react-dom': getExternal('reactDOM'),
      axios: getExternal('axios'),
      lodash: getExternal('lodash'),
    };
  }
  return webpackConfig;
};
