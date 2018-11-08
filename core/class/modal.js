import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import * as Blocks from './';
// const config = require(`${path.dirname(require.main.filename)}/config`);
// const Parent = require(`../dbType/${config.database.type}`);

export default class Modal {
  constructor({ structure, application = "unspecified", name = "undefined", type }) {
    this.structure = structure;
    this.application = application;
    this.name = name;
    this.type = type;
    if (!structure || typeof structure === 'undefined' || structure === null || structure === {}) {
      throw new Blocks.SBError('Database table modal cannot be empty.');
    }
  }
  // async beforeActionHandler(type, data) {
  //   return await Blocks.Hook.executeHooks({ event: "before", type: Object.getPrototypeOf(this.constructor).name, application: this.application, className: this.constructor.name }, { type, data });
  // }
  //
  // async afterActionHandler(type, data) {
  //   return await Blocks.Hook.executeHooks({ event: "after", type: Object.getPrototypeOf(this.constructor).name, application: this.application, className: this.constructor.name }, { type, data });
  // }
  //
  // async beforeCreateHandler(data) {
  //   console.log("beforeCreateHandler");
  //   return await this.beforeActionHandler("create", data);
  // }
  //
  // async afterCreateHandler(data) {
  //   return await this.afterActionHandler("create", data);
  // }
  //
  // async beforeReadHandler(data) {
  //   return await this.beforeActionHandler("read", data);
  // }
  //
  // async afterReadHandler(data) {
  //   return await this.afterActionHandler("read", data);
  // }
  //
  // async beforeUpdateHandler(data) {
  //   return await this.beforeActionHandler("update", data);
  // }
  //
  // async afterUpdateHandler(data) {
  //   return await this.afterActionHandler("update", data);
  // }
  //
  // async beforeDeleteHandler(data) {
  //   return await this.beforeActionHandler("delete", data);
  // }
  //
  // async afterDeleteHandler(data) {
  //   return await this.afterActionHandler("delete", data);
  // }

  static async loadModals() {
    const readFiles = folder =>
      new Promise((resolve, reject) => {
        fs.readdir(folder, (err, files) => {
          if (err) reject(err);
          resolve(files);
        });
      });

    let apps = await readFiles(`${path.dirname(require.main.filename)}/applications`);
    apps = apps.filter(app => !app.startsWith("."));
    let modalFiles = await Promise.all(
      apps.map(app => readFiles(`${path.dirname(require.main.filename)}/applications/${app}/modals`))
    );
    modalFiles = modalFiles.map(app =>
      app.filter(routeFile => !routeFile.startsWith("."))
    );
    modalFiles = modalFiles.map(a =>
      a.map(r => {
        if (!r.endsWith(".js")) return;
        return r;
      }).filter(r => !!r)
    );
    let combined = [];
    for (let i = 0; i < apps.length; i++) {
      combined.push({
        app: apps[i],
        modals: modalFiles[i].map(r => ({
          file: `applications/${apps[i]}/modals/${r}`,
          name: r.toString().substr(0, r.toString().length - 3)
        }))
      });
    }
    let modals = {};
    combined.map(app => app.modals.map(m => {
      const imported = require(`${path.dirname(require.main.filename)}/${m.file}`);
      const modal = new imported();
      if (!modals[app.app]) modals[app.app] = {};
      if (!!modals[app.app][modals.name]) throw new Error(`Duplicated modal name "${modal.name}" in application ${app.app}`);
      modals[app.app][modal.name] = mongoose.model(`${app.app}_${modal.name}`, modal.structure);
    }));
    return modals;
  }
}
