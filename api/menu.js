const express = require('express');
const menuRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

menuRouter.param('menuId', (req, res, next, menuId) => {
    const sql = 'Select * FROM Menu WHERE id = $menuId';
    db.get(sql,{$menuId: menuId}, (error, menu) =>{
        if(error){
            next(error);
        }else if(menu){
            req.menu = menu;
            next();
        }else{
            res.sendStatus(404);
        }
    })
});

menuRouter.get('/', (req, res, next) => {
    db.all('SELECT * FROM Menu', (error, menus) => {
        if(error){
            next(error);
        }else{
            res.status(200).json({menus: menus});
        }
    });
});

menuRouter.get();

module.exports = menuRouter;