const express = require('express');
const apiRouter = express.Router();
const employeeRouter = require('./employees.js');
apiRouter.use('/employees', employeeRouter);

// const timesheetRouter = require('./timesheet.js');
// const menuRouter = require('./menu.js');
// const menuItemRouter = require('./menuItem')

// apiRouter.use('/timesheet', timesheetRouter);
// apiRouter.use('/menu', menuRouter);
// apiRouter.use('/menuItem',menuItemRouter);


module.exports = apiRouter;