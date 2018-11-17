import passportJWT from "passport-jwt";
const ExtractJwt = passportJWT.ExtractJwt;

export default {
  db: "mongodb://localhost:27017/systemblocks",
  TIMEOUT: {
    HOOK_PROMISE: 20 * 1000
  },
  passport: {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "3722eae7-2a1e-4062-8ade-f823be9a443e",
    issuer: "test.example.com",
    audience: "example.net",
    validate: (jwtPayload, callback) => {
      global._block.modals.auth.User
        .findOne({
          _id: jwtPayload._id
        })
        .then(d => callback(undefined, d))
        .catch(e => callback(e, undefined));
    }
  },
  checkPermissions: (jwtPayload, checkingValue) => {}
};
