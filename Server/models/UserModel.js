const mongoose = require("mongoose");

const {Schema} = mongoose;

const userModel = new Schema(
    {
        username:{type:String, unique: true, dropDups: true, required:true},
        password:{type:String, required: true},
        admin: {type:Boolean},
        favorites: [{type:String}]
    },
    {collection: 'Users'}
);

module.exports = mongoose.model('User', userModel);