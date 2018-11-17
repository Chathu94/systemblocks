require("babel-core/register");
require("babel-polyfill");

export default ({ method, parameters, secure = false, permission }) => (target, key, descriptor) => {
  const originalMethod = descriptor.value;
  descriptor.value = function () {
    return { originalMethod, method, parameters, args: arguments, secure, permission };
  }
};
