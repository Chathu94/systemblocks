import * as Blocks from "./";

export default class Output {
  success = false;
  message = "API not found.";
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
        message = "Request completed successfully.",
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
      this.message = "Request completed successfully.";
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
    this.message = error.message;
    this.status = 500;
    this.data = error.stack;
  }

  setReqSuccess(data) {
    this.success = true;
    this.message = "Request completed successfully.";
    this.status = 200;
    this.data = data;
  }

  getResponse() {
    const { success, message, data, status } = this;
    return { success, message, data, status };
  }
}
