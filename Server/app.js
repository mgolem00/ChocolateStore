//"C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe" --dbpath="c:\data\db"
//npm start
const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const result = require('dotenv').config()
const app = express();
const db = mongoose.connect('mongodb://localhost:27017/NPWA_Seminar');//database connection
const port = process.env.PORT || 3000;
const userRouter = express.Router();
const manufacturerAndItemRouter = express.Router();
const ManufacturerAndItem = require('./models/manufacturersAndItemsModel');
const User = require('./models/userModel');
const {signJwt, verifyJwt, verifyRole} = require('./jwt');
const cors = require('cors');

app.use(cors())
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//ISPITNI ZADATAK-----------------------------------------------------------------------------
userRouter.route('/getUsers')
.get(verifyRole, (req, res)=>{
    User.find({admin: false}, (err, users)=>{
        if(err){
            res.send(err);
        }
        else{
            res.json(users);
        }
    });
});

//USER-----------------------------------------------------------------------------------------
userRouter.route('/login')
.post((req, res)=>{
    User.find({username: req.body.username}, function (error, users) { 
        if (error || users.length === 0) {
            return res.send(error);
        }
        if (req.body.password !== users[0].password) {
            return res.send("Wrong password")
        }
        const token = signJwt(users[0]._id, users[0].admin);
        return res.json({accessToken: token, user: users[0]});
    })
});

userRouter.route('/register')
.post((req, res)=>{
    console.log(req.body.username + req.body.password);
    User.find({username: req.body.username}, function (error, users) { 
        if (error || users.length > 0) {
            console.log(users.length);
            return res.send(error);
        }
        let user = new User({username: req.body.username, password: req.body.password, admin: false, favorites:[]});
        user.save();
        return res.json(user);
    })
});
app.use("/api", userRouter);

userRouter.route('/addToFavorite')
.post(verifyJwt, (req, res)=>{
    const query = {};
    if(req.body.username){
        query.username = req.body.username;
    }
    User.find(query,(err, user)=>{
        if(err){
            return res.send(err);
        }else{
            let isInArrayIndex = user[0].favorites.findIndex((i) => {return i===req.body.itemID});
            if(isInArrayIndex === -1) {
                user[0].favorites.push(req.body.itemID);
            }
            else {
                user[0].favorites.splice(isInArrayIndex, 1);
            }

            let updatedFavorites = new User(user[0]);
            updatedFavorites.save();
            return res.json(updatedFavorites);
        }
    });
});
app.use("/api", userRouter);

//SHOP GET-----------------------------------------------------------------------------------------
manufacturerAndItemRouter.route('/manufacturersAndItems')
.get(verifyJwt, (req, res)=>{
    ManufacturerAndItem.find((err, manufacturers)=>{
        if(err){
            res.send(err);
        }
        else{
            res.json(manufacturers);
        }
    });
});
app.use("/api", manufacturerAndItemRouter);

manufacturerAndItemRouter.route('/findManufacturer')
.get(verifyJwt, (req, res)=>{
    const query = {};
    if(req.query.manufacturerID){
        query.id = req.query.manufacturerID;
    }
    ManufacturerAndItem.find(query,(err, manufacturer)=>{
        if(err){
            return res.send(err);
        }else{
            return res.json(manufacturer[0]);
        }
    });
});
app.use("/api", manufacturerAndItemRouter);

manufacturerAndItemRouter.route('/findItem')
.get(verifyJwt, (req, res)=>{
    const query = {};
    if(req.query.manufacturerID && req.query.itemID){
        query.id = req.query.manufacturerID;
    }
    ManufacturerAndItem.find(query,(err, manufacturer)=>{
        if(err){
            return res.send(err);
        }else{
            const item = manufacturer[0].items.find(({item_id}) => item_id === req.query.itemID);
            return res.json(item);
        }
    });
});
app.use("/api", manufacturerAndItemRouter);

//SHOP CUD-----------------------------------------------------------------------------------------
manufacturerAndItemRouter.route('/createManufacturer')
.post(verifyRole, (req, res)=>{
    const query = {};
    if(req.body.name){
        query.name = req.body.name;
    }
    ManufacturerAndItem.find(query,(err, manufacturer)=>{
        if(err || manufacturer.length > 0){
            return res.send(err);
        }else{
            let newManufacturerID = 1;
            ManufacturerAndItem.find().sort({id: -1}).limit(1).exec(function (err, maxManufacturer) {
                if (err) {return err;}
                else {
                    newManufacturerID = maxManufacturer[0].id + 1;
                    let newManufacturer = new ManufacturerAndItem({id: newManufacturerID, name: req.body.name, yearFounded: req.body.yearFounded, logo: req.body.logo, desc: req.body.desc, items: []});
                    newManufacturer.save();
                    return res.json(newManufacturer);
                }
            });
        }
    });
});
app.use("/api", manufacturerAndItemRouter);

manufacturerAndItemRouter.route('/updateManufacturer')
.post(verifyRole, (req, res)=>{
    const query = {};
    if(req.body.manufacturerID){
        query.id = req.body.manufacturerID;
    }
    ManufacturerAndItem.find(query,(err, manufacturer)=>{
        if(err){
            return res.send(err);
        }else{
            if(req.body.name !== manufacturer[0].name) {
                manufacturer[0].name = req.body.name;
            }
            if(req.body.yearFounded !== manufacturer[0].yearFounded) {
                manufacturer[0].yearFounded = req.body.yearFounded;
            }
            if(req.body.logo !== manufacturer[0].logo) {
                manufacturer[0].logo = req.body.logo;
            }
            if(req.body.desc !== manufacturer[0].desc) {
                manufacturer[0].desc = req.body.desc;
            }

            let newMaI = new ManufacturerAndItem(manufacturer[0]);
            newMaI.save();
            return res.json(newMaI);
        }
    });
});
app.use("/api", manufacturerAndItemRouter);

manufacturerAndItemRouter.route('/deleteManufacturer')
.delete(verifyRole, (req, res)=>{
    const query = {};
    if(req.body.manufacturerID){
        query.id = req.body.manufacturerID;
    }
    ManufacturerAndItem.find(query,(err, manufacturer)=>{
        if(err){
            return res.send(err);
        }else{
            if(manufacturer[0].items.length == 0) {
                ManufacturerAndItem.deleteOne(query, function (err, _result) {
                    if (err) {
                      res.status(400).send(`Error deleting listing with id ${query.id}!`);
                    } else {
                      console.log("1 document deleted");
                      return res.send("1 document deleted");
                    }
                });
            }
            else{
                return res.send("Can't delete manufacturer because it has items!")
            }
        }
    });
});
app.use("/api", manufacturerAndItemRouter);

manufacturerAndItemRouter.route('/createItem')
.post(verifyRole, (req, res)=>{
    const query = {};
    if(req.body.manufacturerID){
        query.id = req.body.manufacturerID;
    }
    ManufacturerAndItem.find(query,(err, manufacturer)=>{
        if(err){
            return res.send(err);
        }else{
            let itemIDs = [];
            manufacturer[0].items.forEach(({item_id}) => {
                i = parseInt(item_id.substring(item_id.indexOf("_") + 1));
                itemIDs.push(i);
            });
            let currentMaxID = 1;
            if(itemIDs.length > 0) {
                currentMaxID = itemIDs.reduce((prev, current) => {
                    return (prev > current) ? prev : current;
                }) + 1;
            }

            let newItemID = manufacturer[0].id.toString().concat("_",currentMaxID.toString());
            let newItem = {item_id: newItemID, item_name: req.body.itemName, weight: req.body.itemWeight, price: req.body.itemPrice, carbs: req.body.itemCarbs, picture: req.body.itemPicture}

            manufacturer[0].items.push(newItem);
            let newMaI = new ManufacturerAndItem(manufacturer[0]);
            newMaI.save();
            return res.json(newMaI);
        }
    });
});
app.use("/api", manufacturerAndItemRouter);

manufacturerAndItemRouter.route('/updateItem')
.post(verifyRole, (req, res)=>{
    const query = {};
    if(req.body.manufacturerID && req.body.itemID){
        query.id = req.body.manufacturerID;
    }
    ManufacturerAndItem.find(query,(err, manufacturer)=>{
        if(err){
            return res.send(err);
        }else{
            let item = manufacturer[0].items.find(({item_id}) => item_id === req.body.itemID);
            let editIndex = manufacturer[0].items.findIndex(({item_id}) => item_id === req.body.itemID);
            if(req.body.itemName !== item.item_name) {
                item.item_name = req.body.itemName;
            }
            if(req.body.itemWeight !== item.weight) {
                item.weight = req.body.itemWeight;
            }
            if(req.body.itemPrice !== item.price) {
                item.price = req.body.itemPrice;
            }
            if(req.body.itemCarbs !== item.carbs) {
                item.carbs = req.body.itemCarbs;
            }
            if(req.body.itemPicture !== item.picture) {
                item.picture = req.body.itemPicture;
            }
            manufacturer[0].items[editIndex] = item;

            let newMaI = new ManufacturerAndItem(manufacturer[0]);
            newMaI.save();
            return res.json(newMaI);
        }
    });
});
app.use("/api", manufacturerAndItemRouter);

manufacturerAndItemRouter.route('/deleteItem')
.delete(verifyRole, (req, res)=>{
    const query = {};
    if(req.body.manufacturerID && req.body.itemID){
        query.id = req.body.manufacturerID;
    }
    ManufacturerAndItem.find(query,(err, manufacturer)=>{
        if(err){
            return res.send(err);
        }else{
            let filteredItems = manufacturer[0].items.filter(({item_id}) => item_id !== req.body.itemID);
            manufacturer[0].items = filteredItems;

            let newMaI = new ManufacturerAndItem(manufacturer[0]);
            newMaI.save();
            return res.json(newMaI);
        }
    });
});
app.use("/api", manufacturerAndItemRouter);

//-----------------------------------------------------------------------------------------
app.listen(port, ()=>{
    console.log("Running on port" + port);
});