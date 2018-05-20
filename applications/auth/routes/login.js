import Joi from 'joi';
import * as Blocks from '../../../core/class';

export default class LoginController extends Blocks.Controller {

  parameters = {
    username: Joi.string().required(),
    password: Joi.string().required()
  };

  constructor(req, res) {
    super({ params: req.params, body: req.body, application: "auth", method: "POST" });
  }

  response() {
    this.setResponse({ a: 'b' });
  }
}