import Joi from "joi";
import * as Blocks from "../../../../core/class";
import { Method } from "../../../../core/decorator";

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
  async create(req, res) {
    const { name, username, password } = req.body;
    const saved = await new _block.modals.auth.User({
      name, username, password
    }).save();
    res.json(new Blocks.Output(saved));
  }

  @Method({
    method: "POST",
    parameters: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  })
  async login(req, res) {
    const { username, password } = req.body;
    let user = await _block.modals.auth.User.findOne({
      username, password
    });
    if (!user) throw new Blocks.SBError('User not found.');
    const token = Blocks.Controller.generateToken({ _id: user._id });
    user.token = token;
    user = await user.save();
    res.json(new Blocks.Output(user));
  }

  @Method({
    method: "GET",
    secure: true
  })
  async get(req, res) {
    res.json(new Blocks.Output(req.jwtPayload));
  }
}
