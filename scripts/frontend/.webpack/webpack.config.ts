import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TsconfigPathsPlugins from 'tsconfig-paths-webpack-plugin';

import webpackPaths from './webpack.paths';

module.exports = (env) => {
  return {
    entry: path.join(webpackPaths.srcPath, 'index.tsx'),

    output: {
      path: webpackPaths.buildPath,
      filename: 'main.js',
      publicPath: '',
      // https://github.com/webpack/webpack/issues/1114
      library: {
        type: 'commonjs2',
      },
    },

    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
            options: {
              // Remove this line to enable type checking in webpack builds
              compilerOptions: {
                module: 'esnext',
              },
            },
          },
        },
        {
          test: /\.s?(c|a)ss$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
                sourceMap: true,
                importLoaders: 1,
              },
            },
            'sass-loader',
          ],
          include: /\.module\.s?(c|a)ss$/,
        },
        {
          test: /\.s?css$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
          exclude: /\.module\.s?(c|a)ss$/,
        },
        // Fonts
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/,
          type: 'asset/resource',
        },
      ],
    },

    /**
     * Determine the array of extensions that should be used to resolve modules.
     */
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
      modules: [webpackPaths.srcPath, 'node_modules'],
      plugins: [new TsconfigPathsPlugins()],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(webpackPaths.publicPath, 'index.html'),
      }),
      new webpack.DefinePlugin({
        jest: undefined,
      }),
      new webpack.DefinePlugin({
        'process.env.BACKEND_HOST': JSON.stringify(env.BACKEND_HOST),
        'process.env.SNOWFLAKE_CLOUD': JSON.stringify(env.SNOWFLAKE_CLOUD),
      }),
    ],

    devServer: {
      compress: true,
      port: 9000,
    },
  };
};
