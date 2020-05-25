const express = require('express');
const employeeRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// Checks if employee exist, if so sends employee if not sends status 404
employeeRouter.param('id', (req, res, next, id) =>{
    const sql = 'SELECT * FROM Employee WHERE id = $employeeid'
    
    db.get(sql, {$employeeid: id}, (error, employee) => {
        if(error){
            next(error);
        }else if(employee){
           req.employee = employee;
           next();
        }else{
            return res.sendStatus(404);
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

// retrieves one employee from database
employeeRouter.get('/:id', (req, res, next) => {
    res.status(200).json({employee: req.employee});
});
 
// Creates a new employee in database
employeeRouter.post('/', (req, res, next) =>{
    const name = req.body.employee.name,
          position = req.body.employee.position,
          wage = req.body.employee.wage;
    
    if(!name || !position || !wage){
        return res.sendStatus(400);
    }else{
        const sql = 'INSERT INTO Employee (name, position, wage) VALUES($name, $position, $wage)';
        const values ={
            $name: name,
            $position: position,
            $wage: wage
        }

        db.run(sql, values, function(error) {
            if(error){
                next(error);
            }else{
                db.get(`Select * FROM Employee WHERE id = ${this.lastid}`, (error, employee) =>{
                    res.status(201).json({employee: employee})
                })
            }
        });
    }
    
});


// fix the put route!!!!
employeeRouter.put('/:id', (req, res, next) =>{
    const name = req.body.employee.name,
          position = req.body.employee.position,
          wage = req.body.employee.wage;
    
    if(!name || !position || !wage){
        return res.sendStatus(400);
    }else{
        const sql = 'UPDATE Employee SET name = $name, position = $position, wage = $wage WHERE id = $id ';
        const values ={
            $id: req.params.id,
            $name: name,
            $position: position,
            $wage: wage
        }

        db.run(sql, values, error => {
            if(error){
                next(error);
            }else{
               db.get(`SELECT * FROM Employee WHERE id = ${req.params.id}`, (error, employee) => {
                   res.status(200).json({employees: employee});
               });
            }
        });

    }

});

employeeRouter.delete('/:id', (req, res, next) => {
  
    db.run(`UPDATE Employee SET is_current_employee = 0 WHERE id =${req.params.id}`, error =>{
        if(error){
            next(error);
        }else{
            db.get(`SELECT * FROM Employee WHERE id = ${req.params.id}`, (error, employee) => {
                res.status(200).json({employee: employee});
            });
        }
    });
});

module.exports = employeeRouter;