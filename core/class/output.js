import Message from "../vars/message";
import * as Blocks from "./";

export default class Output {
  success = false;
  message = Message.API_NOT_FOUND;
  data = undefined;
  status = 404;

  constructor(datas) {
    if (datas instanceof Blocks.Output) {
      const { success, message, data, status } = datas.getResponse();
      this.success = success;
      this.message = message;
      this.status = status;
      this.data = data;
    } else if (datas instanceof Blocks.SBError) {
      this.setError(datas);
    } else if (
      typeof datas === "object" &&
      datas !== undefined &&
      Object.keys(datas).filter(
        k => ["success", "message", "data", "status"].indexOf(k) === -1
      ).length === 0
    ) {
      const {
        success = true,
        message = Message.REQ_SUCCESS,
        data = {},
        status = 200
      } = datas;
      this.success = success;
      this.message = message;
      this.status = status;
      this.data = data;
    } else if (
      typeof datas === "object" &&
      datas !== undefined &&
      Object.keys(datas).filter(
        k => ["success", "message", "data", "status"].indexOf(k) === -1
      ).length > 0
    ) {
      this.success = true;
      this.message = Message.REQ_SUCCESS;
      this.status = 200;
      this.data = datas;
    }
  }

  setSuccess(success) {
    this.success = success;
    return this;
  }

  setMessage(message) {
    this.message = message;
    return this;
  }

  setStatus(status) {
    this.status = status;
    return this;
  }

  setData(data) {
    this.data = data;
    return this;
  }

  setError(error) {
    this.success = false;
    this.message = Message.HANDLED_ERR;
    this.status = 500;
    this.data = error.message;
  }

  setReqSuccess(data) {
    this.success = true;
    this.message = Message.REQ_SUCCESS;
    this.status = 200;
    this.data = data;
  }

  getResponse() {
    const { success, message, data, status } = this;
    return { success, message, data, status };
  }
}
