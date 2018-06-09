import * as Blocks from '../core/class';

export default class beforeCreateSystemUserHook extends Blocks.Hook {

  static application = "auth";
  static type = "Modal";
  static event = "before";
  static className = "systemuser";

  constructor() {
    super();
    this.setPriorityLevel(0);
  }


  onEvent({ type, data: { query } }) {
    console.log('beforeCreateSystemUserHook', type, query);
    return new Promise((resolve) => {
      resolve({ query });
    });
  }
}
