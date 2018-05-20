import Joi from 'joi';
import * as Blocks from '../../../core/class';

export default class LoginController extends Blocks.Controller {

  parameters = {
    username: Joi.string().required(),
    password: Joi.string().required()
  };

  method = "POST";

  constructor(req, res) {
    super(req, res, "auth");

  }

  response() {
    this.setData({ a: 'b' });
  }
}