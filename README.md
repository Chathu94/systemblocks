# SystemBlocks &middot; 
blocks bases easy rest api building framework.

#### Installing ?
```javascript
npm i -S systemblocks
```

#### Starting express server ?
_file: **/index.js**_
```javascript
import * as Blocks from 'systemblocks/core/class';

Blocks.Init();
```

#### Config file
_file: **/config/index.js**_
```javascript
export default {
  db: "mongodb://localhost:27017/systemblocks",
  TIMEOUT: {
    HOOK_PROMISE: 20 * 1000
  }
}
```

#### New database modal ?
_file: **/applications/auth/modals/user.js**_
```javascript
import mongoose from 'mongoose';
import * as Blocks from 'systemblocks/core/class';

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
```
_* Note that collection name in database will be 'auth_users'_

#### New Route ?
_file: **/applications/auth/routes/login.js**_
```javascript
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
```

### Test Now
#### Create User
###### PUT /auth/login
```json
{
	"name": "Hashan Chathuranga",
	"username": "test",
	"password": "Aa1"
}
```
#### Get Users
###### GET /auth/login

##### You can create multiple applications, routes, methods and modals
#### Support me by PR's and Bug Reporting. :pray:
