import * as Blocks from '../core/class';

export default class afterLoginHook extends Blocks.Hook {

  static application = "auth";
  static type = "Controller";
  static event = "after";

  constructor(data) {
    super(true);
    console.log(data);
  }

  onEvent({ params, body, method }) {
    console.log(params, body, method);
  }
}