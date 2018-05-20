import init from './core/init';
import Login from './applications/auth/routes/login';

init()
  .then(() => {
    const l = new Login({}, {});
    console.log(l.sendResponse());
  })
  .catch(e => console.log(e))

process.stdin.read();