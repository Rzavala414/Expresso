const express = require('express');
const menuRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const menuItemsRouter = require('./menuItems.js');

menuRouter.param('menuId', (req, res, next, menuId) => {
    const sql = 'Select * FROM Menu WHERE Menu.id = $menuId';
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

menuRouter.use('/:menuId/menu-items', menuItemsRouter);

menuRouter.get('/', (req, res, next) => {
    db.all('SELECT * FROM Menu', (error, menus) => {
        if(error){
            next(error);
        }else{
            res.status(200).json({menus: menus});
        }
    });
});

menuRouter.get('/:menuId', (req, res, next) => {
    res.status(200).json({menu: req.menu});
});

menuRouter.post('/', (req, res, next) => {
    const title = req.body.menu.title;
    if(!title){
        return res.sendStatus(400);
    }

    const sql = 'INSERT INTO Menu (title) VALUES($title)';
    db.run(sql, {$title: title}, function(error){
        if(error){
            next(error);
        }else{
            db.get(`SELECT * FROM Menu WHERE Menu.id = ${this.lastID}`, (error, menu) =>{
                res.status(201).json({menu: menu});
            });
        }
    });

});

menuRouter.put('/:menuId', (req, res, next) => {
    const title = req.body.menu.title;
    if(!title){
        return res.sendStatus(400);
    }

    const sql = 'UPDATE Menu SET title = $title';
    db.run(sql, {$title: title}, error => {
        if(error){
            next(error);
        }else{
            db.get(`SELECT * FROM Menu WHERE Menu.id = ${req.params.menuId}`, (error, menu) =>{
                res.status(200).json({menu: menu});
            });
        }
    });
});

menuRouter.delete('/:menuId', (req, res, next) => {
    const menuItemSql = 'SELECT * FROM MenuItem WHERE MenuItem.menu_id = $menuId';
    const menuItemValues = {$menuId: req.params.menuId};
    db.get(menuItemSql, menuItemValues, (error, menuItem) => {
      if (error) {
        next(error);
      } else if (menuItem) {
        return res.sendStatus(400);
      } else {
        const deleteSql = 'DELETE FROM Menu WHERE Menu.id = $menuId';
        const deleteValues = {$menuId: req.params.menuId};
  
        db.run(deleteSql, deleteValues, (error) => {
          if (error) {
            next(error);
          } else {
            res.sendStatus(204);
          }
        });
  
      }
    });
  });

module.exports = menuRouter;