require("babel-core/register");
require("babel-polyfill");
import fs from 'fs';
import path from 'path';
import { SBError } from "./index";
const debug = require('debug')('SB: Logger');

export default class Logger {

  static logFile = undefined;

  static Log({ type = 'message', module = undefined, data }) {
    if (data instanceof Error || data instanceof EvalError || data instanceof InternalError || data instanceof RangeError || data instanceof ReferenceError || data instanceof SyntaxError || data instanceof TypeError || data instanceof URIError) return Logger.Error({ type, module, error: new SBError(data) });
    if (data instanceof SBError) return Logger.Error({ type, module, error: data });
    if (typeof data === 'string' || typeof data === 'object') {
      debug(type, module, data);
      Logger.WriteLog({ module, level: 1, text: data });
    }
  }

  static Error({ type = 'message', module = undefined, error }) {
    debug(type, module, error);
    return Logger.WriteLog({ module, level: 3, text: `${error.message}\n${error.stack}` });
  }

  static async Initialize() {
    const logs = `${path.dirname(require.main.filename)}/logs`;
    const today = new Date();
    const file = `${logs}/${today.getFullYear()}_${today.getMonth()}_${today.getDate()}.log`;
    if (!fs.existsSync(logs)) {
      fs.mkdirSync(logs);
    }
    if (!fs.existsSync(logs)) {
      fs.writeFileSync(file, '', 'utf8');
    }
    Logger.logFile = file;
  }

  static async WriteLog({ module = 'global', level = '0', text = '' }) {
    if (!Logger.logFile) {
      await Logger.Initialize();
    }
    const now = new Date();
    fs.appendFileSync(Logger.logFile, `[${level}][${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}][${module}] ${text}\n`, 'utf8');
  }
}