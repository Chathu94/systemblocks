require("babel-core/register");
require("babel-polyfill");
import path from 'path';
import * as Blocks from './class';
import config from './vars/config';
const aconfig = require(`${path.dirname(require.main.filename)}/config`);
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
  // Load modals
  debug('Loading modals');
  global._block.modals = await Blocks.Modal.loadModals();
  debug(`Loaded ${global._block.modals.length} modals`);
  const DBType = require(`${path.dirname(require.main.filename)}/core/dbType/${aconfig.database.type}`);
  await DBType.initialize();
  debug(`Modals initialized`);
}
