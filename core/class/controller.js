import mongoose from "mongoose";

require("babel-core/register");
require("babel-polyfill");
import fs from "fs";
import path from "path";
import jwt from 'jsonwebtoken';
import express from "express";
import validate from 'express-validation';
import bodyParser from 'body-parser';
import passport from 'passport';
import passportJWT from 'passport-jwt';
import * as Blocks from "../class";
const debug = require('debug')('SB: Controller');
const jwtStrategy = passportJWT.Strategy;

export default class Controller {
  static generateToken(data) {
    const { validate, jwtFromRequest, secretOrKey, ...opts } = global._block.config.passport;
    return jwt.sign(data, global._block.config.passport.secretOrKey, opts);
  }

  static async loadRoutes() {
    const readFiles = folder =>
      new Promise((resolve, reject) => {
        fs.readdir(folder, (err, files) => {
          if (err) reject(err);
          resolve(files);
        });
      });

    let apps = await readFiles(`${path.dirname(require.main.filename)}/applications`);
    apps = apps.filter(app => !app.startsWith("."));
    let routeFiles = await Promise.all(
      apps.map(app => readFiles(`${path.dirname(require.main.filename)}/applications/${app}/routes`))
    );
    routeFiles = routeFiles.map(app =>
      app.filter(routeFile => !routeFile.startsWith("."))
    );
    let combined = [];
    routeFiles = routeFiles.map(a =>
      a.map(r => {
        if (!r.endsWith(".js")) return;
        if (!r.match(/^[A-Za-z0-9_.-]+$/i)) {
          throw new Error(
            `Invalid file name "${r.substr(0, r.length - 3)}" in routes`
          );
        }
        return r;
      }).filter(r => !!r)
    );
    for (let i = 0; i < apps.length; i++) {
      combined.push({
        app: apps[i],
        routes: routeFiles[i].map(r => ({
          file: `applications/${apps[i]}/routes/${r}`,
          name: r.toString().substr(0, r.toString().length - 3)
        }))
      });
    }
    const app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    if (global._block.config.passport && typeof global._block.config.passport === "object") {
      debug('Config passport');
      const { validate, ...opts } = global._block.config.passport;
      passport.use(new jwtStrategy(opts, validate));
    }

    const router = express.Router();
    app.use("/", router);

    combined = combined.map(app => {
      app.routes = app.routes.map(r => {
        const route = require(`${path.dirname(require.main.filename)}/${r.file}`);
        const imported = new route();
        let reqs = imported.handleRequest();
        const handlerException = fn => (req, res, next) => {
          const p = fn(req, res);
          if (!!p.then) p.catch((error) => next(error));
        };
        reqs = reqs.map(req => {
          const args = [];
          if (req.secure) {
            const { validate, ...opts } = global._block.config.passport;
            args.push((req, res, next) => passport.authenticate('jwt', { session: false }, (e, d) => {
              if (e) {
                next(e);
              } else if (!d) {
                next(new Blocks.SBError("token is valid but no user found."));
              } else {
                req.jwtPayload = d;
                next();
              }
            })(req, res, next));
          }
          if (req.parameters) args.push(validate(req.parameters));
          args.push(handlerException(req.originalMethod));
          return router.route(`/${app.app}/${r.name}`)[req.method.toLowerCase()](...args);
        });
        return { ...r, reqs };
      });
      return app;
    });
    app.use((req, res, next) => {
      res.status(404).json(new Blocks.Output({ success: false, message: "API Not found.", status: '404' }));
      next();
    });
    app.use((err, req, res, next) => {
      if (!!process.env.DEBUG) {
        if (!err instanceof Blocks.SBError) debug(err);
        res.status(500).json(new Blocks.Output({ success: false, message: err.message, status: '500', data: err.stack }));
      } else {
        res.status(500).json(new Blocks.Output({ success: false, message: "Something went wrong.", status: '500' }));
      }
    });
    await new Promise(resolve => app.listen(global._block.config.port || 3010, () => resolve()));
    return combined;
  }

  constructor({ application = "unspecified" }) {
    this.application = application;
  }

  async beforeResponseHandler({ params, body, method }) {
    return await Blocks.Hook.executeHooks(
      {
        event: "before",
        type: Object.getPrototypeOf(this.constructor).name,
        application: this.application,
        className: this.constructor.name
      },
      { params, body, method }
    );
  }

  async afterResponseHandler({ params, body, method, output }) {
    return await Blocks.Hook.executeHooks(
      {
        event: "after",
        type: Object.getPrototypeOf(this.constructor).name,
        application: this.application,
        className: this.constructor.name
      },
      { params, body, method, output }
    );
  }

  handleRequest() {
    const proto = Object.getPrototypeOf(this);
    const names = Object.getOwnPropertyNames(proto);
    const methods = names.filter(
      name => typeof this[name] === "function" && name !== "constructor"
    );
    return methods.map(m => {
      try {
        const ret = this[m]();
        if (!!ret.method) return { ...ret, func: m };
      } catch (e) {}
      return null;
    });
    // const { params, body, method } = await this.beforeResponseHandler();
    // this.params = params;
    // this.body = body;
    // this.method = method;
    // if (!this.response) {
    //   throw new SBError("Controller must have response function.");
    // }
    // if (typeof this.response !== "function") {
    //   throw new SBError("this.response must be a function.");
    // }
    // this.response();
    // const { output } = await this.afterResponseHandler();
    // this.output = output;
  }
}
