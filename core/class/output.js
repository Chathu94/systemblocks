import Message from '../vars/message';

export default class Output {

  success = false;
  message = Message.API_NOT_FOUND;
  data = undefined;
  status = 404;

  constructor({ success = false, message = Message.API_NOT_FOUND, data = undefined, status = 404 }) {
    this.success = success;
    this.message = message;
    this.status = status;
    this.data = data;
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