const mongoose = require('mongoose');
const { Schema } = mongoose;



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
   email:{
    type:String,
    unique: true,
    required: true
   },
   password:{
    type:String,
    required:true
   },
   date:{
    type:Date,
    default:Date.now
   }
})


const User = new mongoose.model('User', userSchema);
module.exports = User;











