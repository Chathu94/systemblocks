require("babel-core/register");
require("babel-polyfill");

import * as Blocks from './class';
import config from './vars/config';
const debug = require('debug')('SB: Init');

global._block = {};

export default async () => {
  // Load configs
  debug('Loading configs');
  global._block.config = config;
  // Load hooks
  debug('Loading hooks');
  global._block.hooks = await Blocks.Hook.loadHooks();
  debug(`Loaded ${global._block.hooks.length} hooks`);
}