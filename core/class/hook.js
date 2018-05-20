import fs from 'fs';
import * as Blocks from './';
import { Logger } from "./index";

export default class Hook {
  constructor(async) {
    this.async = async || false;
  }

  static loadHooks() {
    return new Promise((resolve, reject) => {
      const hooks = [];
      fs.readdir('./hooks', (err, files) => {
        if (err) return reject(err);
        files.forEach(file => {
          const Hook = require(`../../hooks/${file}`);
          hooks.push(Hook);
        });
        resolve(hooks);
      });
    });
  }

  static executeHooks({ application, type, event }, data) {
    const hooks = _block.hooks.filter(h => h.application = application && h.type === type && h.event === event);
    const generated = hooks.map(h => new h(data));
    return new Promise((resolve, reject) => {
      const promises = generated.filter(g => g.async);
      const others = generated.filter(g => !g.async);
      others.map(hook => {
        try {
          hook.onEvent(data);
        } catch (e) {
          Logger.Log({ type: 'hook', module: hook.constructor.name, data: e });
        }
      });

      console.log(promises, others);
    });
  }

  handleHook() {
    try {
      throw new Error('test');
    } catch (e) {
      return new Blocks.SBError(e);
    }
  }
}