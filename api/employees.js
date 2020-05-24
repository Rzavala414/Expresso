const express = require('express');
const employeeRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// Checks if employee exist, if so sends employee if not sends status 404
employeeRouter.param('id', (req, res, next, id) =>{
    const sql = 'SELECT * FROM Employee WHERE id = $employeeId'
    
    db.get(sql, {$employeeId: id}, (error, employee) => {
        if(error){
            next(error);
        }else if(employee){
           req.employee = employee;
           next();
        }else{
            res.sendStatus(404);
        }
    });

});

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

employeeRouter.get('/:id', (req, res, next) => {
    res.status(200).json({employee: req.employee});
});
 


module.exports = employeeRouter;