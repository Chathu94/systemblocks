import * as Blocks from '../core/class';

export default class afterLoginHook extends Blocks.Hook {

  static application = "auth";
  static type = "Controller";
  static event = "before";

  constructor() {
    super();
    this.setPriorityLevel(1);
  }

  onEvent({ params, body, method }) {
    console.log(params, body, method);
    // return new Promise(resolve => {
    //   setTimeout(resolve({ params: { test: 'awdawd' }, body, method }), 2000);
    // });
    return { params: { test: 'awdawd' }, body, method };
  }
}