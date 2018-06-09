import fs from 'fs';
import path from 'path';
import * as Blocks from './';
const config = require(`${path.dirname(require.main.filename)}/config`);
const Parent = require(`../dbType/${config.database.type}`);

export default class Modal extends Parent {
  constructor({ structure, application = "unspecified" }) {
    super({ structure, application });
    this.structure = structure;
    this.application = application;
    if (!structure || typeof structure === 'undefined' || structure === null || structure === {}) {
      throw new Blocks.SBError('Database table modal cannot be empty.');
    }
  }

  async beforeActionHandler(type, data) {
    return await Blocks.Hook.executeHooks({ event: "before", type: Object.getPrototypeOf(this.constructor).name, application: this.application, className: this.constructor.name }, { type, data });
  }

  async afterActionHandler(type, data) {
    return await Blocks.Hook.executeHooks({ event: "after", type: Object.getPrototypeOf(this.constructor).name, application: this.application, className: this.constructor.name }, { type, data });
  }

  async beforeCreateHandler(data) {
    console.log("beforeCreateHandler");
    return await this.beforeActionHandler("create", data);
  }

  async afterCreateHandler(data) {
    return await this.afterActionHandler("create", data);
  }

  async beforeReadHandler(data) {
    return await this.beforeActionHandler("read", data);
  }

  async afterReadHandler(data) {
    return await this.afterActionHandler("read", data);
  }

  async beforeUpdateHandler(data) {
    return await this.beforeActionHandler("update", data);
  }

  async afterUpdateHandler(data) {
    return await this.afterActionHandler("update", data);
  }

  async beforeDeleteHandler(data) {
    return await this.beforeActionHandler("delete", data);
  }

  async afterDeleteHandler(data) {
    return await this.afterActionHandler("delete", data);
  }

  static loadModals() {
    const modals = {};
    return new Promise((resolve, reject) => {
        fs.readdir(`${path.dirname(require.main.filename)}/applications/`, (err, files) => {
          if (err) return reject(err);
          resolve(files);
        });
      })
      .then((files) => {
        return new Promise((resolve) => {
          const promises = [];
          files.forEach(file => {
            const ms = new Promise((resolve, reject) => {
              fs.readdir(`${path.dirname(require.main.filename)}/applications/${file}/modals`, (err, files2) => {
                if (err) return reject(err);
                files2.forEach(file2 => {
                  if (file2.substr(-3) === '.js') {
                    const Modal = require(`${path.dirname(require.main.filename)}/applications/${file}/modals/${file2}`);
                    const m = new Modal();
                    modals[m.constructor.name] = m;
                    resolve();
                  }
                })
              });
            });
            promises.push(ms);
          });
          resolve(promises);
        });
      })
      .then(promises => Promise.all(promises))
      .then(() => Promise.resolve(modals));
  }
}
