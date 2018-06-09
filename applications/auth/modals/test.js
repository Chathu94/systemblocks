import * as Blocks from '../../../core/class';
export default class test extends Blocks.Modal {
  constructor() {
    super({ structure: {
      id: { type: "auto" },
      desc: { type: "string", required: true },
      amt: { type: "number", required: true }
    }, application: "auth" });
  }
}
