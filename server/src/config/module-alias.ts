/**
 * Module aliases registration for the server
 * This helps resolve path aliases like @shared and @/ during runtime
 */

import { register } from 'tsconfig-paths';
import path from 'path';

// Load the config
const baseUrl = path.resolve(__dirname, '../..');
const { paths } = require('../../tsconfig.json').compilerOptions;

// Register path aliases
register({
  baseUrl,
  paths
});
