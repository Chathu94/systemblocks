require("babel-core/register");
require("babel-polyfill");
import * as Blocks from '../class';
const SBError = Blocks.SBError;
import Message from '../vars/message';

export default class Controller {
  constructor({ req = { params: [], body: {} }, res = {}, application = "unspecified", method = "GET" }) {
    this.params = req.params;
    this.body = req.body;
    this.application = application;
    this.method = method;
    this.output = new Blocks.Output({});
  }

  async beforeResponseHandler() {
    if (this.beforeResponse === "function") {
      await this.beforeResponse();
    }
    const { params, body, method } = this;
    await Blocks.Hook.executeHooks({ event: "before", type: Object.getPrototypeOf(this.constructor).name, application: this.application }, { params, body, method });
  }

  async afterResponseHandler() {
    if (this.afterResponse === "function") {
      await this.afterResponse();
    }
    await Blocks.Hook.executeHooks({ event: "after", type: Object.getPrototypeOf(this.constructor).name, application: this.application }, this.output);
  }

  getParameters() {
    return this.parameters || {};
  }

  setResponse(datas) {
    if (datas instanceof Blocks.Output) {
      this.output = datas;
    } else if (datas instanceof Blocks.SBError) {
      this.output.setError(datas);
    } else if (typeof datas === 'object' && datas !== undefined && Object.keys(datas).filter(k => ['success', 'message', 'data', 'status'].indexOf(k) === -1).length === 0) {
      const { success = true, message = Message.REQ_SUCCESS, data = {}, status = 200 } = datas;
      this.output = new Blocks.Output({ success, message, data, status });
    } else if (typeof datas === 'object' && datas !== undefined && Object.keys(datas).filter(k => ['success', 'message', 'data', 'status'].indexOf(k) === -1).length > 0) {
      this.output = new Blocks.Output({ success: true, message: Message.REQ_SUCCESS, status: 200, data: datas });
    }
  }

  setMethod(method) {
    this.method = method;
  }

  async sendResponse() {
    await this.beforeResponseHandler();
    if (!this.response) {
      throw new SBError('Controller must have response function.');
    }
    if (typeof this.response !== 'function') {
      throw new SBError('this.response must be a function.');
    }
    this.response();
    await this.afterResponseHandler();
  }
}