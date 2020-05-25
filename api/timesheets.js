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

timesheetRouter.post('/', (req, res, next) => {
    const hours = req.body.timesheet.hours,
        rate = req.body.timesheet.rate,
        date = req.body.timesheet.date,
        employeeId = req.params.employeeId;

    if(!hours || !rate || !date){
        return res.sendStatus(400);
    }
  const sql = 'INSERT INTO Timesheet (hours, rate, date, employee_id)' +
      'VALUES ($hours, $rate, $date, $employeeId)';
  const values = {
    $hours: hours,
    $rate: rate,
    $date: date,
    $employeeId: employeeId
  };

    db.run(sql, values, function(error){
        if(error){
            next(error);
        }else{
            db.get(`SELECT * FROM Timesheet WHERE TImesheet.id = ${this.lastID}`, (error, timesheet) => {
                res.status(201).json({timesheet: timesheet});
            })
        }
    });

});

module.exports = timesheetRouter;