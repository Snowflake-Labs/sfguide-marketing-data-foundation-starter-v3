import path from 'path';

const rootPath = path.join(__dirname, '..');

const srcPath = path.join(rootPath, 'src');
const publicPath = path.join(rootPath, 'public');
const buildPath = path.join(rootPath, 'dist');

export default {
  rootPath,
  srcPath,
  publicPath,
  buildPath,
};
