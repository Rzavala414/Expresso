const express = require('express');
const menuItemsRouter = express.Router({mergeParams: true});
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

menuItemsRouter.param('menuItemId', (req, res, next, menuItemId) => {
    const sql = 'SELECT * FROM MenuItem WHERE MenuItem.id = $menuItemId';
    
    db.get(sql, {$menuItemId:menuItemId}, (error, menuItem) => {
        if(error){
            next(error);
        }else if(menuItem){
            req.menuItem = menuItem;
            next();
        }else{
            res.sendStatus(404);
        }
    })
});

menuItemsRouter.get('/', (req, res, next) => {
    const sql = 'SELECT * FROM MenuItem WHERE MenuItem.menu_id = $menuId';
    const values = { $menuId: req.params.menuId};
    db.all(sql, values, (error, menuItems) => {
      if (error) {
        next(error);
      } else {
        res.status(200).json({menuItems: menuItems});
      }
    });
  });

menuItemsRouter.post('/', (req, res, next) => {
    const name = req.body.menuItem.name,
          description = req.body.menItem.description,
          inventory = req.body.menuItem.inventory,
          price = req.body.menuItem.price,
          menuId = req.params.menuId;
    
   
    const menuSql = 'SELECT * FROM Menu WHERE Menu.id = $menuId';
    db.get(menuSql, {$menuId: menuId}, (error, menu) =>{
        if(error){
            next(error);
        }else{

            if(!name || !inventory || !price || !menu){
                return res.sendStatus(400);
            }
        
            const sql = 'INSERT INTO MenuItem (name, description, inventory, price, menu_id) VALUES($name, $description, $inventory $price, $menu_id)';
            const values = {
                $name: name,
                $description: description,
                $inventory: inventory,
                $price: price,
                $menu_id: menuId
            }

            db.run(sql, values, function(error){
                if(error){
                    next(error);
                }else{
                    db.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${this.lastID}`, (error, menuItem) => {
                        res.status(201).json({menuItem: menuItem});
                    })
                }
            })
        }
    });
});

// menuItemsRouter.put('/', (req, res, next) => {
    
// });

// menuItemsRouter.delete('/', (req, res, next) => {

// });
  

module.exports = menuItemsRouter;