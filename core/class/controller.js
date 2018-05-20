import * as Blocks from '../class';
import Message from '../vars/message';

export default class Controller {
  constructor(req, res, application) {
    this.params = req.params;
    this.body = req.body;
    this.application = application;
    this.response = {
      success: false,
      message: Message.API_NOT_FOUND,
      data: {}
    };
    this.status = 404;
    Blocks.Hook.executeHooks({ event: "after", type: Object.getPrototypeOf(this.constructor).name, application: this.application });
  }

  getParameters() {
    return this.parameters || {};
  }

  setResponse({ success = true, message = Message.REQ_SUCCESS, data = {}, httpStatus = 200 }) {
    this.response = { success, message, data };
    this.status = httpStatus;
  }

  sendResponse() {

  }
}