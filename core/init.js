require("babel-core/register");
require("babel-polyfill");

import * as Blocks from './class';
const debug = require('debug')('SB: Init');

global._block = {};

// Load hooks
debug('Loading hooks');
export default async () => {
  global._block.hooks = await Blocks.Hook.loadHooks();
  debug(`Loaded ${global._block.hooks.length} hooks`);
}