import init from './core/init';
//import Login from './applications/auth/routes/login';

init()
  .then(() => {
    //const l = new Login({}, {});
    //console.log(l.sendResponse());
    global._block.modals.systemuser.register("test", "Aa1", "Hashan Chathuranga", "Hashan3SR@gmail.com");
  })
  .catch(e => console.log(e))

process.stdin.read();
