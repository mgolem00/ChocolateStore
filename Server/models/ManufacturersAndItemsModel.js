const mongoose = require("mongoose");

const {Schema} = mongoose;

const itemSub = new Schema({
    item_id: {type:String, unique: true, dropDups: true, required:true},
    item_name: {type:String, unique: true, dropDups: true, required:true},
    weight: {type:Number},
    price: {type:Number},
    carbs: {type:Number},
    picture: {type:String}
});

const manufacturersAndItemsModel = new Schema({
    id: {type:Number, unique: true, dropDups: true, required:true},
    name: {type:String, unique: true, dropDups: true, required:true},
    yearFounded: {type:Number},
    logo: {type:String},
    desc: {type:String},
    items: [itemSub]
    },
    {collection: 'ManufacturersAndItems'}
);

module.exports = mongoose.model('ManufacturerAndItem', manufacturersAndItemsModel);