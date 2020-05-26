const express = require('express');
const apiRouter = express.Router();

const employeesRouter = require('./employees.js');
apiRouter.use('/employees', employeesRouter);

const menuRouter = require('./menu.js');
apiRouter.use('/menus', menuRouter);

// const menuItemRouter = require('./menuItem');
// apiRouter.use('/menuItem',menuItemRouter);


module.exports = apiRouter;