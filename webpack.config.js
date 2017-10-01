var path = require('path');
var webpack = require('webpack');
var CompressionPlugin = require('compression-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    bundle: './app/index.js',
    vendor: ['jquery', 'mapbox-gl', 'uikit', 'csv2geojson']
  },
  resolve: {
    modules: [
      path.resolve('./'),
      path.resolve('./node_modules')

    ]
  },
  // https://webpack.js.org/configuration/devtool/
  // for production
  // devtool: 'nosources-source-map',
  // for development
  devtool: 'eval-source-map',
  devServer: {
    compress: true,
    port: 9000
  },
  performance: {
    hints: 'warning'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'dist/'
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint-loader'
    },
    {
      test: /\.json$/,
      loader: 'json-loader'
    },
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    },
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader',
        publicPath: 'dist/'
      })
    },
    {
      test: /\.png|csv$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000
        }
      }
    },
    {
      test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000
        }
      }
    }, {
      test: /\.html$/,
      use: {
        loader: 'mustache-loader'
        // loader: 'mustache?minify'
        // loader: 'mustache?{ minify: { removeComments: false } }'
        // loader: 'mustache?noShortcut'
      }
    }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"'
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    new ExtractTextPlugin({
      filename: 'bundle.css',
      disable: false,
      allChunks: true
    })
    // function() {
    //  this.plugin('done', function(stats) {
    //    require('fs').writeFileSync(
    //      path.join(__dirname, 'dist', 'stats.json'),
    //      JSON.stringify(stats.toJson()));
    //  });
    // }
  ]
};
