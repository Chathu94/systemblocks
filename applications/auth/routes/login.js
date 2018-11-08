import Joi from "joi";
import * as Blocks from "../../../core/class";
import { Method } from "../../../core/decorator";

export default class LoginController extends Blocks.Controller {
  constructor() {
    super({ application: "auth" });
  }

  @Method({
    method: "PUT",
    parameters: {
      name: Joi.string().required(),
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  })
  async returnLogins(req, res) {
    const { name, username, password } = req.body;
    const saved = await new _block.modals.auth.User({
      name, username, password
    }).saveA();
    res.json(new Blocks.Output(saved));
  }

  @Method({
    method: "POST",
    parameters: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  })
  returnLoginsx(req, res) {
    res.json(new Blocks.Output({ a: 'B' }));
  }
}
