import * as Blocks from '../core/class';

export default class afterLoginHook extends Blocks.Hook {

  static application = "auth";
  static type = "Controller";
  static event = "before";
  static className = "login";

  constructor() {
    super();
    this.setPriorityLevel(0);
  }


  onEvent({ params, body, method }) {
    // console.log(params, body, method);
    return new Promise((resolve) => {
      resolve({ params, body, method });
    });
  }
}
