import * as Blocks from '../core/class';

export default class afterLoginHook extends Blocks.Hook {

  static application = "auth";
  static type = "Controller";
  static event = "before";

  constructor() {
    super();
    this.setPriorityLevel(0);
  }


  onEvent({ params, body, method }) {
    console.log(params, body, method);
    // return new Promise(resolve => {
    //   setTimeout(resolve({ params: { test: 'awdawd' }, body, method }), 3000);
    // });
    return { params: { test: 'awdawdd awd lawd l' }, body, method };
  }
}