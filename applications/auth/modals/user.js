import mongoose from 'mongoose';
import * as Blocks from '../../../core/class';

const { Schema } = mongoose;

export default class User extends Blocks.Modal {
  constructor() {
    const structure = new mongoose.Schema({
      name: { type: String, required: true },
      username: { type: String, required: true },
      password: { type: String, required: true }
    });
    super({ structure, application: "auth", name: "User" });
  }
}
