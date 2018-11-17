require("babel-core/register");
require("babel-polyfill");
import mongoose from 'mongoose';
import path from 'path';
import * as Blocks from './.';
const debug = require('debug')('SB: Init');
const info = require('debug')('SB: Info   ');

global._block = {};

export default async () => {
  // Load configs
  debug('Loading configs');
  global._block.config = require(`${path.dirname(require.main.filename)}/config/index.js`);
  // Load hooks
  // debug('Loading hooks');
  // global._block.hooks = await Blocks.Hook.loadHooks();
  // info(`Loaded ${global._block.hooks.length} hooks`);
  // Load routes
  debug('Loading routes');
  global._block.routes = await Blocks.Controller.loadRoutes();
  info(`Loaded ${global._block.routes.length} applications, ${global._block.routes.map(a => a.routes.length).reduce((a, c) => a + c)} files and ${global._block.routes.map(a => a.routes.map(r => r.reqs.length).reduce((a, c) => a + c)).reduce((a, c) => a + c)} methods`);
  // Load modals
  if (global._block.config.db) {
    debug('Connecting to MongoDB');
    await mongoose.connect(global._block.config.db, { keepAlive: 1, useNewUrlParser: true });
    info('Connected to MongoDB');
    debug('Loading modals');
    global._block.modals = await Blocks.Modal.loadModals();
    info(`Loaded ${Object.keys(global._block.modals).map(a => Object.keys(global._block.modals[a]).length).reduce((a, c) => a + c)} modals`);
  }
}
