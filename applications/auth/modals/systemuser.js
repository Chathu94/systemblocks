import * as Blocks from '../../../core/class';
export default class systemuser extends Blocks.Modal {
  constructor() {
    super({ structure: {
        id: { type: "auto" },
        username: { type: "string", max: 50, unique: true, required: true },
        password: { type: "string", required: true, hashed: true },
        name: { type: "string", required: true },
        email: { type: "string" }
      }, application: "auth" });
  }

  register(username, password, name, email) {
    return this.create({ values: { username, password, name, email } });
  }

  login(username, password) {
    return this.read({ where: { username, password } });
  }
}
