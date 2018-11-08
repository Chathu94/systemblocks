import Joi from "joi";
import * as Blocks from "systemblocks/core/class";
import { Method } from "systemblocks/core/decorator";

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
  async save(req, res) {
    const { name, username, password } = req.body;
    const saved = await new _block.modals.auth.User({
      name, username, password
    }).save();
    res.json(new Blocks.Output(saved));
  }

  @Method({
    method: "GET"
  })
  async list(req, res) {
    const users = await _block.modals.auth.User.find({});
    res.json(new Blocks.Output(users));
  }
}
