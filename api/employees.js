const express = require('express');
const employeeRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// retrieves all current employees from database
employeeRouter.get('/', (req, res, next) =>{
    db.all('SELECT * FROM Employee WHERE is_current_employee = 1', (error, employee) => {
        if(error){
            next(error);
        }else{
            res.status(200).json({employees: employee});
        }

    });
});

module.exports = employeeRouter;