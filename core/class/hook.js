require("babel-core/register");
require("babel-polyfill");
import fs from 'fs';
import * as Blocks from './';
import { Logger } from "./index";

export default class Hook {

  constructor() {
    this.priorityLevel = 0;
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

  static async executeHooks({ application, type, event }, data) {
    const hooks = _block.hooks.filter(h => h.application === application && h.type === type && h.event === event);
    const generated = hooks.map(h => new h(data));
    const sorted = generated.sort((g1, g2) => g2.priorityLevel - g1.priorityLevel);
    let datas = data || {};
    return sorted.reduce((p, hook) => {
      return p.then(async () => {
        const r = hook.onEvent(datas);
        if (r instanceof Promise) {
          const r2 = await r;
          datas = (typeof r2 !== "undefined") ? r2 : datas;
        } else if (typeof r !== 'undefined') {
          datas = r;
        }
        console.log('hook', hook.constructor.name, datas);
      });
    }, Promise.resolve());
  }

  setPriorityLevel(p) {
    this.priorityLevel = p;
  }

  handleHook() {
    try {
      throw new Error('test');
    } catch (e) {
      return new Blocks.SBError(e);
    }
  }
}