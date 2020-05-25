const express = require('express');
const apiRouter = express.Router();

const employeesRouter = require('./employees.js');
apiRouter.use('/employees', employeesRouter);

// const menuRouter = require('./menu.js');
// const menuItemRouter = require('./menuItem')

// apiRouter.use('/menu', menuRouter);
// apiRouter.use('/menuItem',menuItemRouter);


module.exports = apiRouter;