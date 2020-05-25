const express = require('express');
const timesheetRouter =  express.Router({mergeParams: true});

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

timesheetRouter.get('/', (req, res, next) => {
    // console.log(req.params.id)
    db.all('SELECT * FROM Timesheet WHERE Timesheet.employee_id = $employeeId',{$employeeId: req.params.employeeId},
        (err, timesheet) => {
            if (err) {
                next(err);
            } else {
                res.status(200).json({timesheets: timesheet});
            }
        });
});

module.exports = timesheetRouter;